"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employee_controllers_1 = require("../controllers/employee.controllers");
const validateInput_1 = require("../../../middleware/validateInput");
const employee_schema_1 = require("../../../schema/employee.schema");
const employee_repository_1 = require("../repository/employee.repository");
const employee_service_1 = require("../services/employee.service");
const department_repository_1 = require("../../department/repository/department.repository");
const leave_repository_1 = require("../../leave/repository/leave.repository");
const repository = new employee_repository_1.EmployeeRepository();
const departmentRepository = new department_repository_1.DepartmentRepository();
const leaveRepository = new leave_repository_1.LeaveRepository();
const service = new employee_service_1.EmployeeService(repository, departmentRepository, leaveRepository);
const controller = new employee_controllers_1.EmployeeController(service);
exports.default = express_1.default.Router()
    .post("/", (0, validateInput_1.validateInput)(employee_schema_1.createEmployeeSchema), (req, res) => controller.CreateEmployee(req, res))
    .get("/:id", (0, validateInput_1.validateInput)(employee_schema_1.getEmployeeSchema), (req, res) => controller.GetEmployeeWithLeaveHistory(req, res));
