// leave.routes.ts
import express from "express";
import { LeaveController } from "../controller/leave.controller";
import { validateInput } from "../../../middleware/validateInput";
import { createLeaveSchema } from "../../../schema/leave.schema";
import { LeaveRepository } from "../repository/leave.repository";
import { LeaveService } from "../service/leave.service";
import { EmployeeRepository } from "../../employee/repository/employee.repository";
import amqp from "amqplib";
import { SubscribeMessage } from "../worker/rabbitmq";
import rateLimit from "express-rate-limit"; 

export default function leaveRoutes(channel: amqp.Channel) {
  const repository = new LeaveRepository();
  const employeeRepository = new EmployeeRepository();
  const service = new LeaveService(repository, employeeRepository);
  service.setChannel(channel); 
  SubscribeMessage(channel, process.env.LEAVE_QUEUE_NAME!, service, process.env.LEAVE_BINDING_KEY!);

  const controller = new LeaveController(service);

  const leaveLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, 
    message: {
      statusCode: 429,
      message: "too many leave requests from this IP. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  return express.Router()
    .post("/", leaveLimiter, validateInput(createLeaveSchema), (req, res) => controller.CreateLeave(req, res));
}
