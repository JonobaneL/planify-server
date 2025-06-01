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
  async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await prisma.project.create({
        data: req.body,
      });
      res.status(200).json(project);
    } catch (e) {
      next(e);
    }
  }
  async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.task.deleteMany({
        where: {
          projectId: req.params.id,
        },
      });
      const project = await prisma.project.delete({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json(project);
    } catch (e) {
      next(e);
    }
  }
}
export default new ProjectsController();
