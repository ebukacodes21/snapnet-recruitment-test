import { Request, Response } from "express";
import { HealthService } from "../service/health.service";

export class HealthController {
  static async systemHealth(req: Request, res: Response) {
    const result = await HealthService.checkSystem();
    return res.status(200).json(result);
  }

  static async dbHealth(req: Request, res: Response) {
    const result = await HealthService.checkDatabase();
    const statusCode = result.status === "OK" ? 200 : 500;
    return res.status(statusCode).json(result);
  }

  static async queueHealth(req: Request, res: Response) {
    const result = await HealthService.checkQueue();
    const statusCode = result.status === "OK" ? 200 : 500;
    return res.status(statusCode).json(result);
  }
}
