"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const leave_service_1 = require("../server/api/leave/services/leave.service");
const leave_repository_1 = require("../server/api/leave/repository/leave.repository");
const employee_repository_1 = require("../server/api/employee/repository/employee.repository");
jest.mock("../server/api/leave/repository/leave.repository");
jest.mock("../server/api/employee/repository/employee.repository");
describe("LeaveService - ManageLeave", () => {
    let leaveService;
    beforeEach(() => {
        const leaveRepository = new leave_repository_1.LeaveRepository();
        const employeeRepository = new employee_repository_1.EmployeeRepository();
        leaveService = new leave_service_1.LeaveService(leaveRepository, employeeRepository);
    });
    it("should auto-approve leave ≤ 2 days", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockLeave = {
            id: 1,
            startDate: new Date("2025-10-05"),
            endDate: new Date("2025-10-06"),
            status: "pending",
            save: jest.fn().mockResolvedValue(true),
        };
        jest.spyOn(leaveService["leaveRepository"], "FindLeaveByPK").mockResolvedValue(mockLeave);
        yield leaveService.ManageLeave({ leaveId: 1 });
        expect(mockLeave.status).toBe("approved");
        expect(mockLeave.save).toHaveBeenCalled();
    }));
    it("should mark leave > 2 days as rejected", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockLeave = {
            id: 2,
            startDate: new Date("2025-10-01"),
            endDate: new Date("2025-10-05"),
            status: "pending",
            save: jest.fn().mockResolvedValue(true),
        };
        jest.spyOn(leaveService["leaveRepository"], "FindLeaveByPK").mockResolvedValue(mockLeave);
        yield leaveService.ManageLeave({ leaveId: 2 });
        expect(mockLeave.status).toBe("rejected");
        expect(mockLeave.save).toHaveBeenCalled();
    }));
});
