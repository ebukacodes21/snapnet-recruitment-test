import _ from "lodash";
import dotenv from "dotenv";
import { CreateEmployeeInput } from "../../../schema/employee.schema";
import { EmployeeRepository } from "../repository/employee.repository";
import { DepartmentRepository } from "../../department/repository/department.repository";
import { AppError } from "../../../utils/appError";
import { UniqueConstraintError, ValidationError } from "sequelize";
import { LeaveRepository } from "../../leave/repository/leave.repository";
import redisClient from "../../../utils/redis";
dotenv.config();

export class EmployeeService {
  private employeeRepository: EmployeeRepository;
  private departmentRepository: DepartmentRepository;
  private leaveRepository: LeaveRepository;

  constructor(
    employeeRepository: EmployeeRepository,
    departmentRepository: DepartmentRepository,
    leaveRepository: LeaveRepository
  ) {
    this.employeeRepository = employeeRepository;
    this.departmentRepository = departmentRepository;
    this.leaveRepository = leaveRepository;
  }

  async CreateEmployee(data: CreateEmployeeInput) {
    const department = await this.departmentRepository.FindDepartmentByPK(
      data.departmentId
    );
    if (!department)
      throw new AppError(
        `department with the given ID: ${data.departmentId} does not exist.`,
        404
      );

    try {
      return await this.employeeRepository.CreateEmployee(data);
    } catch (error: any) {
      if (error instanceof UniqueConstraintError) {
        const field = error.errors[0]?.path;
        throw new AppError(`${field} already taken.`, 409);
      }

      if (error instanceof ValidationError)
        throw new AppError(error.message, 400);
      throw new AppError(`failed to create employee: ${error.message}`, 500);
    }
  }

  async GetEmployeeWithLeaveHistory(employeeId: number) {
    try {
      // check cache
      const cacheKey = `employee:${employeeId}:withLeaves`;
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("cache key found")
        return JSON.parse(cachedData);
      }

      // not cached, fetch from db
      const employee = await this.employeeRepository.FindEmployeeByPK(employeeId);
      if (!employee) throw new AppError(`employee with given ID ${employeeId} not found`, 404);
      const leaves = await this.leaveRepository.FindLeavesByEmployeeId(employeeId);
      const result = { employee, leaves };

      // store in cache with TTL (60 seconds)
      await redisClient.set(cacheKey, JSON.stringify(result), { EX: 60 });
      return result;
    } catch (error: any) {
      throw new AppError(`failed to fetch employee with leave history: ${error.message}`,500);
    }
  }
}
