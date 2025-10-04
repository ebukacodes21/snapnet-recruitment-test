import express from "express";
import { EmployeeController } from "../controller/employee.controller";
import { validateInput } from "../../../middleware/validateInput";
import { 
    createEmployeeSchema, 
    getEmployeeSchema
} from "../../../schema/employee.schema";
import { EmployeeRepository } from "../repository/employee.repository";
import { EmployeeService } from "../service/employee.service";
import { DepartmentRepository } from "../../department/repository/department.repository";
import { LeaveRepository } from "../../leave/repository/leave.repository";
// import { isAdmin } from "../middleware/employee.guard";

const repository = new EmployeeRepository()
const departmentRepository = new DepartmentRepository()
const leaveRepository = new LeaveRepository()
const service = new EmployeeService(repository, departmentRepository, leaveRepository)
const controller = new EmployeeController(service)

export default express.Router()
    .post("/", validateInput(createEmployeeSchema), (req, res) => controller.CreateEmployee(req, res))
    .get("/:id", validateInput(getEmployeeSchema), (req, res) => controller.GetEmployeeWithLeaveHistory(req, res))
    
    // RBAC, only admins can access this route
    // a jwt token will be issued upon login, which will be used to access guarded routes/resources
    // for the purposes of this test, i left it commented
    // .get("/:id", isAdmin, validateInput(getEmployeeSchema), (req, res) => controller.GetEmployeeWithLeaveHistory(req, res))