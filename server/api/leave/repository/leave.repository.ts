// Employee Repository
// handles all database queries for leave

import { LeaveInput } from "../../../schema/leave.schema";
import { LeaveModel } from "../model/leave.model";
import dotenv from "dotenv";
dotenv.config();

export class LeaveRepository {
  async CreateLeave(data: LeaveInput) {
    return await LeaveModel.create({
      employeeId: data.employeeId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate!),
      status: data.status,
    });
  }


  async FindLeaveByPK(id: number) {
    return LeaveModel.findOne({where: { id }});
  }

  async FindLeavesByEmployeeId(employeeId: number) {
    return LeaveModel.findAll({ where: { employeeId } });
  }

  async GetEmployeeLeaveHistory(employeeId: number) {
    return LeaveModel.findAll({where: { employeeId }});
  }
}
