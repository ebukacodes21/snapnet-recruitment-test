"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const appError_1 = require("../../../utils/appError");
const sequelize_1 = require("sequelize");
dotenv_1.default.config();
class EmployeeService {
    constructor(employeeRepository, departmentRepository, leaveRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.leaveRepository = leaveRepository;
    }
    async CreateEmployee(data) {
        var _a;
        const department = await this.departmentRepository.FindDepartmentByPK(data.departmentId);
        if (!department)
            throw new appError_1.AppError(`department with the given ID: ${data.departmentId} does not exist.`, 404);
        try {
            return await this.employeeRepository.CreateEmployee(data);
        }
        catch (error) {
            if (error instanceof sequelize_1.UniqueConstraintError) {
                const field = (_a = error.errors[0]) === null || _a === void 0 ? void 0 : _a.path;
                throw new appError_1.AppError(`${field} already taken.`, 409);
            }
            if (error instanceof sequelize_1.ValidationError)
                throw new appError_1.AppError(error.message, 400);
            throw new appError_1.AppError(`failed to create employee: ${error.message}`, 500);
        }
    }
    async GetEmployeeWithLeaveHistory(employeeId) {
        try {
            const employee = await this.employeeRepository.FindEmployeeByPK(employeeId);
            if (!employee)
                throw new appError_1.AppError(`employee with given ID ${employeeId} not found`, 404);
            const leaves = await this.leaveRepository.FindLeavesByEmployeeId(employeeId);
            return { employee, leaves };
        }
        catch (error) {
            throw new appError_1.AppError(`failed to fetch employee with leaves: ${error.message}`, 500);
        }
    }
}
exports.EmployeeService = EmployeeService;
