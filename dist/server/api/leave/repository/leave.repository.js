"use strict";
// Employee Repository
// handles all database queries for leave
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveRepository = void 0;
const leave_model_1 = require("../model/leave.model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class LeaveRepository {
    async CreateLeave(data) {
        return await leave_model_1.LeaveModel.create({
            employeeId: data.employeeId,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            status: data.status,
        });
    }
    async FindLeaveByPK(id) {
        return leave_model_1.LeaveModel.findOne({ where: { id } });
    }
    async FindLeavesByEmployeeId(employeeId) {
        return leave_model_1.LeaveModel.findAll({ where: { employeeId } });
    }
    async GetEmployeeLeaveHistory(employeeId) {
        return leave_model_1.LeaveModel.findAll({ where: { employeeId } });
    }
}
exports.LeaveRepository = LeaveRepository;
