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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const leave_routes_1 = __importDefault(require("../server/api/leave/routes/leave.routes"));
// Mock RabbitMQ channel
const mockChannel = {
    assertQueue: jest.fn().mockResolvedValue({}),
    assertExchange: jest.fn().mockResolvedValue({}),
    bindQueue: jest.fn().mockResolvedValue({}),
    consume: jest.fn().mockResolvedValue({}),
    sendToQueue: jest.fn().mockResolvedValue({}),
    publish: jest.fn().mockReturnValue(true),
    close: jest.fn().mockResolvedValue({}),
};
describe("Leave API Integration Tests", () => {
    let app;
    beforeAll(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use("/leaves", (0, leave_routes_1.default)(mockChannel));
    });
    it("POST /leaves - should create a leave successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const leaveData = {
            employeeId: 1,
            startDate: "2025-10-04T09:00:00Z",
            endDate: "2025-10-09T18:00:00Z",
            status: "pending",
        };
        const response = yield (0, supertest_1.default)(app)
            .post("/leaves")
            .send(leaveData)
            .expect(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.employeeId).toBe(leaveData.employeeId);
    }));
    it("POST /leaves - should return 400 if input is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidData = {
            employeeId: true, // invalid type
            startDate: "invalid-date",
            endDate: "invalid-date",
            status: "pending",
        };
        yield (0, supertest_1.default)(app).post("/leaves").send(invalidData).expect(400);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        yield ((_a = mockChannel.close) === null || _a === void 0 ? void 0 : _a.call(mockChannel));
        jest.clearAllTimers();
    }));
});
