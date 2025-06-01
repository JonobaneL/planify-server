import { Router } from "express";
import projectsController from "../controllers/projectsController";
// import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", projectsController.getProjects);
router.post("/", projectsController.createProject);
router.delete("/:id", projectsController.deleteProject);

export default router;
