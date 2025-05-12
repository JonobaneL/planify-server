import { Router } from "express";
import authController from "../controllers/authController";
import { body } from "express-validator";

const router = Router();

router.post("/signup", authController.signup);
router.post(
  "/login",
  body("email").trim().isEmail(),
  body("password").trim().notEmpty(),
  authController.login
);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);

export default router;
