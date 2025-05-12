import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";
import { CustomError } from "../utils/customError";
import config from "../config/config";

export const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return next(CustomError.BadRequest("Access token not provided"));

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
