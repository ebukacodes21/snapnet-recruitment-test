import request from "supertest";
import express from "express";
import amqp from "amqplib";
import leaveRoutes from "../server/api/leave/route/leave.route";

// Mock RabbitMQ channel
const mockChannel = {
  assertQueue: jest.fn().mockResolvedValue({}),
  assertExchange: jest.fn().mockResolvedValue({}),
  bindQueue: jest.fn().mockResolvedValue({}),
  consume: jest.fn().mockResolvedValue({}),
  sendToQueue: jest.fn().mockResolvedValue({}),
  publish: jest.fn().mockReturnValue(true),
  close: jest.fn().mockResolvedValue({}),
} as unknown as amqp.Channel;

describe("Leave API Integration Tests", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    app.use("/leaves", leaveRoutes(mockChannel));
  });

  it("POST /leaves - should create a leave successfully", async () => {
    const leaveData = {
      employeeId: 1,
      startDate: "2025-10-04T09:00:00Z",
      endDate: "2025-10-09T18:00:00Z",
      status: "pending",
    };

    const response = await request(app)
      .post("/leaves")
      .send(leaveData)
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.employeeId).toBe(leaveData.employeeId);
  });

  it("POST /leaves - should return 400 if input is invalid", async () => {
    const invalidData = {
      employeeId: true, // invalid type
      startDate: "invalid-date",
      endDate: "invalid-date",
      status: "pending",
    };

    await request(app).post("/leaves").send(invalidData).expect(400);
  });

  afterAll(async () => {
    await mockChannel.close?.();
    jest.clearAllTimers();
  });
});
