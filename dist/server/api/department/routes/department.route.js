"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const department_controller_1 = require("../controllers/department.controller");
const department_service_1 = require("../services/department.service");
const department_repository_1 = require("../repository/department.repository");
const validateInput_1 = require("../../../middleware/validateInput");
const department_schema_1 = require("../../../schema/department.schema");
const employee_repository_1 = require("../../employee/repository/employee.repository");
const repository = new department_repository_1.DepartmentRepository();
const employeeRepository = new employee_repository_1.EmployeeRepository();
const service = new department_service_1.DepartmentService(repository, employeeRepository);
const controller = new department_controller_1.DepartmentController(service);
exports.default = express_1.default.Router()
    .post("/", (0, validateInput_1.validateInput)(department_schema_1.departmentSchema), (req, res) => controller.CreateDepartment(req, res))
    .get("/:id/employees", (0, validateInput_1.validateInput)(department_schema_1.getEmployeeInDeptSchema), (req, res) => controller.GetEmployeesInDepartment(req, res));
