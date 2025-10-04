"use strict";
// Employee Repository
// handles all database queries for an employee
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRepository = void 0;
const employee_model_1 = require("../model/employee.model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class EmployeeRepository {
    async CreateEmployee(data) {
        return employee_model_1.EmployeeModel.create(data);
    }
    async FindEmployeeByPK(id) {
        return employee_model_1.EmployeeModel.findByPk(id);
    }
    async GetEmployeesInDepartment(deptId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        return employee_model_1.EmployeeModel.findAndCountAll({
            where: { departmentId: deptId },
            offset,
            limit,
            order: [["createdAt", "DESC"]],
        });
    }
}
exports.EmployeeRepository = EmployeeRepository;
