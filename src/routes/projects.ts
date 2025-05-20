import { Router } from "express";
import projectsController from "../controllers/projectsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, projectsController.getProjects);

export default router;
