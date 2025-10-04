"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentController = void 0;
const appError_1 = require("../../../utils/appError");
class DepartmentController {
    constructor(departmentService) {
        this.departmentService = departmentService;
    }
    async CreateDepartment(req, res) {
        try {
            const result = await this.departmentService.CreateDepartment(req.body);
            return res.status(201).json(result);
        }
        catch (error) {
            if (error instanceof appError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: "internal server error" });
        }
    }
    async GetEmployeesInDepartment(req, res) {
        const departmentId = parseInt(req.params.id);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        try {
            const result = await this.departmentService.ListEmployeesInDepartment(departmentId, page, limit);
            res.status(200).json({
                success: true,
                data: {
                    total: result.count,
                    employees: result.rows,
                    page,
                    limit,
                },
            });
        }
        catch (error) {
            if (error instanceof appError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
            }
            return res.status(500).json({ message: "internal server error" });
        }
    }
}
exports.DepartmentController = DepartmentController;
