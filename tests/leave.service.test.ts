import { LeaveService } from "../server/api/leave/service/leave.service";
import { LeaveRepository } from "../server/api/leave/repository/leave.repository";
import { EmployeeRepository } from "../server/api/employee/repository/employee.repository";

jest.mock("../server/api/leave/repository/leave.repository");
jest.mock("../server/api/employee/repository/employee.repository");

describe("LeaveService - ManageLeave", () => {
  let leaveService: LeaveService;

  beforeEach(() => {
    const leaveRepository = new LeaveRepository();
    const employeeRepository = new EmployeeRepository();
    leaveService = new LeaveService(leaveRepository, employeeRepository);
  });

  it("should auto-approve leave ≤ 2 days", async () => {
    const mockLeave = {
      id: 1,
      startDate: new Date("2025-10-05"),
      endDate: new Date("2025-10-06"),
      status: "pending_approval",
      save: jest.fn().mockResolvedValue(true),
    };

    jest.spyOn(leaveService["leaveRepository"], "FindLeaveByPK").mockResolvedValue(mockLeave as any);

    await leaveService.ManageLeave({ leaveId: 1 });

    expect(mockLeave.status).toBe("approved");
    expect(mockLeave.save).toHaveBeenCalled();
  });

  it("should mark leave > 2 days as pending_approval", async () => {
    const mockLeave = {
      id: 2,
      startDate: new Date("2025-10-01"),
      endDate: new Date("2025-10-05"),
      status: "pending",
      save: jest.fn().mockResolvedValue(true),
    };

    jest.spyOn(leaveService["leaveRepository"], "FindLeaveByPK").mockResolvedValue(mockLeave as any);

    await leaveService.ManageLeave({ leaveId: 2 });

    expect(mockLeave.status).toBe("pending_approval");
    expect(mockLeave.save).toHaveBeenCalled();
  });
});
