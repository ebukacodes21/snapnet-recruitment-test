"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const appError_1 = require("../../../utils/appError");
const sequelize_1 = require("sequelize");
const rabbitmq_1 = require("../worker/rabbitmq");
const date_fns_1 = require("date-fns");
dotenv_1.default.config();
class LeaveService {
    constructor(leaveRepository, employeeRepository) {
        this.channel = null;
        this.leaveRepository = leaveRepository;
        this.employeeRepository = employeeRepository;
    }
    setChannel(channel) {
        this.channel = channel;
    }
    async CreateLeave(data) {
        var _a;
        const employee = await this.employeeRepository.FindEmployeeByPK(data.employeeId);
        if (!employee)
            throw new appError_1.AppError(`employee with the given ID: ${data.employeeId} does not exist.`, 404);
        try {
            const leave = await this.leaveRepository.CreateLeave(data);
            if (this.channel) {
                const message = {
                    event: "MANAGE_LEAVE",
                    leaveId: leave.id,
                    startDate: leave.startDate,
                    endDate: leave.endDate,
                    status: leave.status
                };
                await (0, rabbitmq_1.PublishMessage)(this.channel, process.env.LEAVE_BINDING_KEY, JSON.stringify(message));
            }
            else {
                console.warn("rabbit channel is not initialized.");
            }
            return leave;
        }
        catch (error) {
            if (error instanceof sequelize_1.UniqueConstraintError) {
                const field = (_a = error.errors[0]) === null || _a === void 0 ? void 0 : _a.path;
                throw new appError_1.AppError(`${field} already exists.`, 409);
            }
            if (error instanceof sequelize_1.ValidationError) {
                throw new appError_1.AppError(error.message, 400);
            }
            throw new appError_1.AppError(`failed to create leave: ${error.message}`, 500);
        }
    }
    async ManageLeave(payload) {
        try {
            if (!payload.leaveId)
                return;
            const leave = await this.leaveRepository.FindLeaveByPK(payload.leaveId);
            if (!leave)
                throw new appError_1.AppError(`leave with payload id ${payload.leaveId} not found`, 404);
            // idempotency Check
            if (leave.status !== "pending") {
                console.log(`leave with ID ${leave.id} already processed with status: ${leave.status}`);
                return; // already processed
            }
            const startDate = new Date(leave.startDate);
            const endDate = new Date(leave.endDate);
            const duration = (0, date_fns_1.differenceInDays)(endDate, startDate) + 1;
            const newStatus = duration <= 2 ? "approved" : "rejected";
            leave.status = newStatus;
            await leave.save();
        }
        catch (error) {
            throw new appError_1.AppError(error.message, 500);
        }
    }
}
exports.LeaveService = LeaveService;
