// Employee Repository
// handles all database queries for an employee

import { CreateEmployeeInput } from "../../../schema/employee.schema";
import { EmployeeModel } from "../model/employee.model";
import dotenv from "dotenv";
dotenv.config();

export class EmployeeRepository {
  async CreateEmployee(data: CreateEmployeeInput) {
    return EmployeeModel.create(data);
  }

  async FindEmployeeByPK(id: number) {
    return EmployeeModel.findByPk(id);
  }

  async GetEmployeesInDepartment(deptId: number, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return EmployeeModel.findAndCountAll({
      where: { departmentId: deptId },
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });
  }
}
