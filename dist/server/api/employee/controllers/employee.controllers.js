"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const appError_1 = require("../../../utils/appError");
class EmployeeController {
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    // create employee
    async CreateEmployee(req, res) {
        try {
            const result = await this.employeeService.CreateEmployee(req.body);
            return res.status(201).json(result);
        }
        catch (error) {
            if (error instanceof appError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
            }
            return res.status(500).json({ message: "internal server error" });
        }
    }
    // get employee with leave history
    async GetEmployeeWithLeaveHistory(req, res) {
        const employeeId = parseInt(req.params.id);
        try {
            const result = await this.employeeService.GetEmployeeWithLeaveHistory(employeeId);
            res.status(200).json({ message: "successful", data: result, statusCode: 200 });
        }
        catch (error) {
            if (error instanceof appError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
            }
            return res.status(500).json({ message: "internal server error", statusCode: 500 });
        }
    }
}
exports.EmployeeController = EmployeeController;
