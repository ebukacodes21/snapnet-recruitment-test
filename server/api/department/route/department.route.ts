import express from "express";
import { DepartmentController } from "../controller/department.controller";
import { DepartmentService } from "../service/department.service";
import { DepartmentRepository } from "../repository/department.repository";
import { validateInput } from "../../../middleware/validateInput";
import { departmentSchema, getEmployeeInDeptSchema } from "../../../schema/department.schema";
import { EmployeeRepository } from "../../employee/repository/employee.repository";

const repository = new DepartmentRepository()
const employeeRepository = new EmployeeRepository()
const service = new DepartmentService(repository, employeeRepository)
const controller = new DepartmentController(service)

export default express.Router()
    .post("/", validateInput(departmentSchema), (req, res) => controller.CreateDepartment(req, res))
    .get("/:id/employees", validateInput(getEmployeeInDeptSchema), (req, res) => controller.GetEmployeesInDepartment(req, res));
