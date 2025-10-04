import { Request, Response } from "express";
import { DepartmentService } from "../service/department.service";
import {
  DepartmentInput,
  GetEmployeeIndeptInput,
} from "../../../schema/department.schema";
import { AppError } from "../../../utils/appError";

export class DepartmentController {
  private departmentService: DepartmentService;
  constructor(departmentService: DepartmentService) {
    this.departmentService = departmentService;
  }

  async CreateDepartment(req: Request<{}, {}, DepartmentInput>, res: Response) {
    try {
      const result = await this.departmentService.CreateDepartment(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "internal server error" });
    }
  }

  async GetEmployeesInDepartment(req: Request, res: Response) {
    const departmentId = parseInt(req.params.id);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await this.departmentService.ListEmployeesInDepartment(
        departmentId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: {
          total: result.count,
          employees: result.rows,
          page,
          limit,
        },
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
      }
      return res.status(500).json({ message: "internal server error" });
    }
  }
}
