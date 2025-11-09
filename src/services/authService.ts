import prisma from "../config/database";
import { CustomError } from "../utils/customError";
import { compare, hash } from "bcrypt";
import { generateTokens, saveRefreshToken } from "./tokenService";

type UserProps = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
};
class AuthService {
  //not used
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        username: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      throw CustomError.Unauthorized("Invalid email or password");
    }
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw CustomError.Unauthorized("Invalid email or password");
    }
    const { password: _, ...payload } = user;
    const tokens = generateTokens(payload);
    await saveRefreshToken(payload.id, tokens.refreshToken);
    return {
      user: payload,
      ...tokens,
    };
  }
  //not used
  async signup(user: UserProps) {
    const hashedPassword = await hash(user.password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      throw CustomError.BadRequest("User with this email already exists");
    }

    const newUser = await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        username: true,
        role: true,
      },
    });
    if (!newUser) {
      throw CustomError.Internal("Failed to create user");
    }
    const tokens = generateTokens(newUser);
    await saveRefreshToken(newUser.id, tokens.refreshToken);
    return {
      user: newUser,
      ...tokens,
    };
  }
  async verifyUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        username: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      throw CustomError.Unauthorized("Invalid email or password");
    }
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw CustomError.Unauthorized("Invalid email or password");
    }
    const { password: _, ...payload } = user;
    return payload;
  }
}
export default new AuthService();
