import { Request, Response } from "express";
import { LeaveInput } from "../../../schema/leave.schema";
import { LeaveService } from "../service/leave.service";
import { AppError } from "../../../utils/appError";

export class LeaveController {
  private leaveService: LeaveService;
  constructor(leaveService: LeaveService) {
    this.leaveService = leaveService;
  }

  // create leave
  async CreateLeave(req: Request<{}, {}, LeaveInput>, res: Response) {
    try {
      const result = await this.leaveService.CreateLeave(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "internal server error", statusCode: 500, error: error.message });
    }
  }
}
