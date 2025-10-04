import { Request, Response } from "express";
import {
  CreateEmployeeInput,
} from "../../../schema/employee.schema";
import { EmployeeService } from "../service/employee.service";
import { AppError } from "../../../utils/appError";

export class EmployeeController {
  private employeeService: EmployeeService;
  constructor(employeeService: EmployeeService) {
    this.employeeService = employeeService;
  }

  // create employee
  async CreateEmployee(req: Request<{}, {}, CreateEmployeeInput>, res: Response) {
    try {
      const result = await this.employeeService.CreateEmployee(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
      }
      return res.status(500).json({ message: "internal server error" });
    }
  }

  // get employee with leave history
  async GetEmployeeWithLeaveHistory(req: Request, res: Response) {
    const employeeId = parseInt(req.params.id);

    try {
      const result = await this.employeeService.GetEmployeeWithLeaveHistory(employeeId);
      res.status(200).json({message: "successful", data: result, statusCode: 200});
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
      }
      return res.status(500).json({ message: "internal server error", statusCode: 500 });
    }
  }
}
