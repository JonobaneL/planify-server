import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";
import { CustomError } from "../utils/customError";
import config from "../config";

export const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies["authjs.session-token"];

  if (!token)
    return next(CustomError.Unauthorized("Access token not provided"));

  try {
    verify(token, config.accessSecret, { algorithms: ["HS256"] });
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(CustomError.Unauthorized("Access token expired"));
    }
    if (error instanceof JsonWebTokenError) {
      return next(CustomError.Unauthorized("Invalid access token"));
    }

    return next(CustomError.Internal("Failed to verify access token", [error]));
  }
};
