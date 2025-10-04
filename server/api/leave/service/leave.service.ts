import { LeaveRepository } from "../repository/leave.repository";
import _ from "lodash";
import dotenv from "dotenv";
import { LeaveInput } from "../../../schema/leave.schema";
import { EmployeeRepository } from "../../employee/repository/employee.repository";
import { AppError } from "../../../utils/appError";
import { UniqueConstraintError, ValidationError } from "sequelize";
import amqp from "amqplib";
import { PublishMessage } from "../worker/rabbitmq";
import { differenceInDays } from "date-fns";
dotenv.config();

export class LeaveService {
  private leaveRepository: LeaveRepository;
  private employeeRepository: EmployeeRepository;
  private channel: amqp.Channel | null = null;

  constructor(
    leaveRepository: LeaveRepository,
    employeeRepository: EmployeeRepository
  ) {
    this.leaveRepository = leaveRepository;
    this.employeeRepository = employeeRepository;
  }

  setChannel(channel: amqp.Channel) {
    this.channel = channel;
  }

  async CreateLeave(data: LeaveInput) {
    const employee = await this.employeeRepository.FindEmployeeByPK(data.employeeId);
    if (!employee)throw new AppError(`employee with the given ID: ${data.employeeId} does not exist.`, 404);

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
        await PublishMessage(this.channel, process.env.LEAVE_BINDING_KEY!, JSON.stringify(message))
      } else {
        console.warn("rabbit channel is not initialized.");
      }

      return leave
    } catch (error: any) {
      if (error instanceof UniqueConstraintError) {
        const field = error.errors[0]?.path;
        throw new AppError(`${field} already exists.`, 409);
      }

      if (error instanceof ValidationError) {
        throw new AppError(error.message, 400);
      }

      throw new AppError(`failed to create leave: ${error.message}`, 500);
    }
  }

  async ManageLeave(payload: any) {
    try {
      if (!payload.leaveId) return
      const leave = await this.leaveRepository.FindLeaveByPK(payload.leaveId)
      if (!leave) throw new AppError(`leave with payload id ${payload.leaveId} not found`, 404)

      // idempotency Check
      if (leave.status !== "pending_approval") {
        console.log(`leave with ID ${leave.id} already processed with status: ${leave.status}`);
        return; // already processed
      }

      const startDate = new Date(leave.startDate)
      const endDate = new Date(leave.endDate!)

      const duration = differenceInDays(endDate, startDate) + 1; 
      const newStatus = duration <= 2 ? "approved" : "pending_approval";

      leave.status = newStatus;
      await leave.save();
    } catch (error: any) {
      throw new AppError(error.message, 500);
    }
  }
}
