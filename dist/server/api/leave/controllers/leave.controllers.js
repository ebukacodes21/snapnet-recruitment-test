"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveController = void 0;
const appError_1 = require("../../../utils/appError");
class LeaveController {
    constructor(leaveService) {
        this.leaveService = leaveService;
    }
    // create leave
    async CreateLeave(req, res) {
        try {
            const result = await this.leaveService.CreateLeave(req.body);
            return res.status(201).json(result);
        }
        catch (error) {
            console.log(error);
            if (error instanceof appError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: "internal server error" });
        }
    }
}
exports.LeaveController = LeaveController;
