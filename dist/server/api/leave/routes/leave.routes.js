"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = leaveRoutes;
// leave.routes.ts
const express_1 = __importDefault(require("express"));
const leave_controllers_1 = require("../controllers/leave.controllers");
const validateInput_1 = require("../../../middleware/validateInput");
const leave_schema_1 = require("../../../schema/leave.schema");
const leave_repository_1 = require("../repository/leave.repository");
const leave_service_1 = require("../services/leave.service");
const employee_repository_1 = require("../../employee/repository/employee.repository");
const rabbitmq_1 = require("../worker/rabbitmq");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
function leaveRoutes(channel) {
    const repository = new leave_repository_1.LeaveRepository();
    const employeeRepository = new employee_repository_1.EmployeeRepository();
    const service = new leave_service_1.LeaveService(repository, employeeRepository);
    service.setChannel(channel);
    (0, rabbitmq_1.SubscribeMessage)(channel, process.env.LEAVE_QUEUE_NAME, service, process.env.LEAVE_BINDING_KEY);
    const controller = new leave_controllers_1.LeaveController(service);
    const leaveLimiter = (0, express_rate_limit_1.default)({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 5,
        message: {
            statusCode: 429,
            message: "too many leave requests from this IP. Please try again later.",
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
    return express_1.default.Router()
        .post("/", leaveLimiter, (0, validateInput_1.validateInput)(leave_schema_1.createLeaveSchema), (req, res) => controller.CreateLeave(req, res));
}
