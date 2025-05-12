import { User } from "../types/user";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { compare, hash } from "bcrypt";
import prisma from "../config/database";
import { CustomError } from "../utils/customError";

type DecodedPayload = {
  id: string;
  email: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
};

/**
 * Generates an access token and refresh token for the given user.
 *
 * @param user - The user for which to generate tokens.
 * @returns An object containing the access token and refresh token.
 */
export const generateTokens = (user: User) => {
  const accessToken = jwt.sign(user, config.accessSecret, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(user, config.refreshSecret, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};
/**
 * Saves a refresh token to the database.
 *
 * @param userId - The user ID the refresh token belongs to.
 * @param token - The refresh token to save.
 */
export const saveRefreshToken = async (userId: string, token: string) => {
  const hashedToken = await hash(token, 10);
  await prisma.refreshToken.create({
    data: {
      userId,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
};

/**
 * Verifies and decodes a refresh token.
 *
 * @param refreshToken - The refresh token to verify.
 * @returns The decoded payload from the refresh token.
 * @throws {JsonWebTokenError} If the token verification fails.
 */

export const verifyRefreshToken = (refreshToken: string) => {
  const decoded = jwt.verify(
    refreshToken,
    config.refreshSecret
  ) as DecodedPayload;
  return decoded;
};
export const getRefreshToken = async (userId: string, refreshToken: string) => {
  const tokens = await prisma.refreshToken.findMany({
    where: {
      userId: userId,
    },
  });
  const currentToken = tokens.find(
    async (item) => await compare(refreshToken, item.token)
  );

  if (!currentToken) throw CustomError.Internal("Token not found");

  return currentToken;
};

/**
 * Removes a refresh token from the database.
 *
 * @param refreshToken - The refresh token to remove.
 *
 * @throws {ServerError} If the refresh token is not found.
 */
export const removeRefreshToken = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);

  const currentToken = await getRefreshToken(decoded.id, refreshToken);

  await prisma.refreshToken.delete({
    where: {
      id: currentToken.id,
    },
  });
};

/**
 * Updates an access token using the given refresh token.
 *
 * @param refreshToken - The refresh token to use for updating the access token.
 * @returns An object containing the new access token.
 * @throws {Unauthorized} If the refresh token is invalid or expired.
 */
export const updateAccessToken = async (refreshToken: string) => {
  const { iat, exp, ...user } = verifyRefreshToken(refreshToken);
  const storedToken = await getRefreshToken(user.id, refreshToken);

  if (!storedToken) throw CustomError.Unauthorized("Invalid refresh token");

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw CustomError.Unauthorized("Expired refresh token");
  }
  const accessToken = jwt.sign(user, config.accessSecret, {
    expiresIn: "15m",
  });
  return { accessToken };
};
