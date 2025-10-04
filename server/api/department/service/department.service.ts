import { DepartmentRepository } from "../repository/department.repository";
import { DepartmentInput } from "../../../schema/department.schema";
import { UniqueConstraintError, ValidationError } from "sequelize";
import { AppError } from "../../../utils/appError";
import { EmployeeRepository } from "../../employee/repository/employee.repository";

export class DepartmentService {
  private departmentRepository: DepartmentRepository;
  private employeeRepository: EmployeeRepository;

  constructor(departmentRepository: DepartmentRepository, employeeRepository: EmployeeRepository) {
    this.departmentRepository = departmentRepository;
    this.employeeRepository = employeeRepository;
  }

  async CreateDepartment(data: DepartmentInput) {
    try {
      return await this.departmentRepository.CreateDepartment(data);
    } catch (error: any) {
      if (error instanceof UniqueConstraintError) {
        const field = error.errors[0]?.path;
        throw new AppError(`${field} already exists.`, 409);
      }

      if (error instanceof ValidationError) {
        throw new AppError(error.message, 400);
      }

      throw new AppError(`failed to create department: ${error.message}`, 500);
    }
  }

  async ListEmployeesInDepartment(deptId: number, page: number, limit: number) {
    const department = await this.departmentRepository.FindDepartmentByPK(deptId);
    if (!department) throw new AppError("department not found", 404);

    return this.employeeRepository.GetEmployeesInDepartment(deptId, page, limit);
  }
}
