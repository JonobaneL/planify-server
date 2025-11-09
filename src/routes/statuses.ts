import { Router } from "express";
import StatusController from "../controllers/statusController";
import { statusMiddleware } from "../middleware/statusMiddleware";
import {
  StatusSchema,
  UpdateStatusSchema,
} from "../validators/status.validator";

const router = Router();

router.get("/", StatusController.getStatuses);
router.get("/:id", StatusController.getStatus);
router.post("/", statusMiddleware(StatusSchema), StatusController.createStatus);
router.patch(
  "/:id",
  statusMiddleware(UpdateStatusSchema),
  StatusController.updateStatus
);
router.delete("/:id", StatusController.deleteStatus);

export default router;
