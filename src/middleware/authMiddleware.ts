import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";
import { CustomError } from "../utils/customError";
import config from "../config";

export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.cookies["access_token"];
  if (!token)
    return next(CustomError.Unauthorized("Access token not provided"));

  try {
    verify(token, config.accessSecret);
    next();
  } catch (error) {
    if (
      error instanceof TokenExpiredError ||
      error instanceof JsonWebTokenError
    )
      return next(CustomError.Unauthorized("Expired or invalid access token"));

    return next(CustomError.Internal("Failed to verify access token", [error]));
  }
};
