import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "backup-access-secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "backup-refresh-secret";

class AuthController {
  login: RequestHandler = async (req: Request, res: Response) => {
    try {
      const accessToken = jwt.sign({ sub: "user123" }, ACCESS_SECRET, {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign({ sub: "user123" }, REFRESH_SECRET, {
        expiresIn: "24h",
      });
      res.setHeader("Set-Cookie", [
        cookie.serialize("access_token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60,
          path: "/",
        }),
        cookie.serialize("refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60,
          path: "/",
        }),
      ]);
      res.status(200).json({ message: "Logged in" });
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  };

  signup: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      // Placeholder for signup logic (e.g., create user in DB)
      res.status(201).json({ message: "User signed up" });
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  };
  logout: RequestHandler = async (req: Request, res: Response) => {
    try {
      res.setHeader("Set-Cookie", []);
      res.status(201).json({ message: "User logged out" });
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  };
  refresh: RequestHandler = async (req: Request, res: Response) => {
    try {
      res.status(201).json({ message: "User signed up" });
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  };
}

export default new AuthController();
