import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InvalidPassword, UserNotFound } from './exceptions/auth.exception';
import { compare, hash } from 'bcrypt';
import { JwtPayload } from './entities/jwt-payload.interface';
import { User } from '@generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new UserNotFound(email);
    }
    const { password: userPassword, ...result } = user;

    const passwordMatch = await compare(password, userPassword);

    if (!passwordMatch) {
      throw new InvalidPassword();
    }

    return result;
  }
  private async generateTokens(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('ACCESS_TOKEN_EXPIRATION', '15m'),
    });

    const refreshPayload = { sub: user.id }; // minimal for refresh
    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('REFRESH_TOKEN_EXPIRATION', '7d'),
    });

    const hashedRefresh = await hash(refreshToken, 10);

    await this.prisma.refreshToken.create({
      data: {
        hashedToken: hashedRefresh,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // match expiresIn
      },
    });

    return { accessToken, refreshToken };
  }

  async login(user: User) {
    return this.generateTokens(user);
  }

  async refreshTokens(oldRefreshToken: string) {
    let payload: { sub: string };

    try {
      payload = this.jwtService.verify(oldRefreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!storedToken)
      throw new UnauthorizedException('Refresh token not found or expired');

    const isValid = await compare(oldRefreshToken, storedToken.hashedToken);
    if (!isValid) throw new UnauthorizedException('Refresh token mismatch');

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) throw new UnauthorizedException();

    const tokens = await this.generateTokens(user);

    return tokens;
  }

  async logout(userId: string, refreshToken: string) {
    const stored = await this.prisma.refreshToken.findFirst({
      where: { userId, revoked: false },
    });

    if (stored) {
      const match = await compare(refreshToken, stored.hashedToken);
      if (match) {
        await this.prisma.refreshToken.update({
          where: { id: stored.id },
          data: { revoked: true },
        });
      }
    }
  }
}
