"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentService = void 0;
const sequelize_1 = require("sequelize");
const appError_1 = require("../../../utils/appError");
class DepartmentService {
    constructor(departmentRepository, employeeRepository) {
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
    }
    async CreateDepartment(data) {
        var _a;
        try {
            return await this.departmentRepository.CreateDepartment(data);
        }
        catch (error) {
            if (error instanceof sequelize_1.UniqueConstraintError) {
                const field = (_a = error.errors[0]) === null || _a === void 0 ? void 0 : _a.path;
                throw new appError_1.AppError(`${field} already exists.`, 409);
            }
            if (error instanceof sequelize_1.ValidationError) {
                throw new appError_1.AppError(error.message, 400);
            }
            throw new appError_1.AppError(`failed to create department: ${error.message}`, 500);
        }
    }
    async ListEmployeesInDepartment(deptId, page, limit) {
        const department = await this.departmentRepository.FindDepartmentByPK(deptId);
        if (!department)
            throw new appError_1.AppError("department not found", 404);
        return this.employeeRepository.GetEmployeesInDepartment(deptId, page, limit);
    }
}
exports.DepartmentService = DepartmentService;
