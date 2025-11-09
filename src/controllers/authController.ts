import { NextFunction, Request, RequestHandler, Response } from "express";
import { CustomError } from "../utils/customError";
import { validationResult } from "express-validator";
import authService from "../services/authService";
import {
  removeRefreshToken,
  updateAccessToken,
} from "../services/tokenService";

class AuthController {
  //not used
  login: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(CustomError.BadRequest("Validation error", errors.array()));
      }
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await authService.login(
        email,
        password
      );

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      res.status(200).json(user);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
  //not used
  signup: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { user, accessToken, refreshToken } = await authService.signup(
        req.body
      );
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  };

  //not used
  logout: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        return next(CustomError.BadRequest("Refresh token not provided"));
      }
      await removeRefreshToken(refreshToken);

      res.clearCookie("refresh_token");
      res.clearCookie("access_token");

      res.status(200).json({ message: "User logged out" });
    } catch (e) {
      next(e);
    }
  };

  //not used
  refresh: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken)
        return next(CustomError.Unauthorized("Refresh token not provided"));

      const { accessToken } = await updateAccessToken(refreshToken);
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.status(200).json({ message: "Access token refreshed", accessToken });
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  };

  verifyUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      const user = await authService.verifyUser(email, password);
      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  };
}

export default new AuthController();
