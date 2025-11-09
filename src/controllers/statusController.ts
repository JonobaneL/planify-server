import { NextFunction, Request, Response } from "express";
import statusService from "../services/statusService";

class StatusController {
  async getStatuses(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;
      const type = query.type as string;
      const statuses = await statusService.getStatuses(type);
      res.status(200).json(statuses);
    } catch (e) {
      next(e);
    }
  }
  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await statusService.getStatus(req.params.id);
      res.status(200).json(status);
    } catch (e) {
      next(e);
    }
  }
  async createStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await statusService.createStatus(req.body);
      res.status(200).json(status);
    } catch (e) {
      next(e);
    }
  }
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await statusService.updateStatus(req.params.id, req.body);
      res.status(200).json(status);
    } catch (e) {
      next(e);
    }
  }
  async deleteStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await statusService.deleteStatus(req.params.id);
      res.status(200).json(status);
    } catch (e) {
      next(e);
    }
  }
}

export default new StatusController();
