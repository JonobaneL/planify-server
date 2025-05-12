import { Router } from "express";
import prisma from "../config/database";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/test-prisma",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await prisma.user.findMany();
      res.status(200).json({ message: "Test route", data });
    } catch (e) {
      console.log(e);
    }
  }
);

export default router;
