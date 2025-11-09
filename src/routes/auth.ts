import { Router } from "express";
import authController from "../controllers/authController";
import { body } from "express-validator";

const router = Router();

router.post("/signup", authController.signup); //not used
router.post(
  "/login",
  body("email").trim().isEmail(),
  body("password").trim().notEmpty(),
  authController.login
); //not used
router.post("/logout", authController.logout); //not used
router.post("/refresh", authController.refresh); //not used
router.post("/verify-user", authController.verifyUser);

export default router;
