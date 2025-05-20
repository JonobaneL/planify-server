import { NextFunction, Request, Response } from "express";
import prisma from "../config/database";

class ProjectsController {
  async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const projects = await prisma.project.findMany();
      res.status(200).json(projects);
    } catch (e) {
      next(e);
    }
  }
}
export default new ProjectsController();
