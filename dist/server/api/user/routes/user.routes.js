"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controllers_1 = require("../controllers/user.controllers");
const validateInput_1 = require("../../../middleware/validateInput");
const user_schema_1 = require("../../../schema/user.schema");
const user_repository_1 = require("../repository/user.repository");
const user_service_1 = require("../services/user.service");
const guard_1 = require("../../../middleware/guard");
const repository = new user_repository_1.UserRepository();
const service = new user_service_1.UserService(repository);
const controller = new user_controllers_1.UserController(service);
exports.default = express_1.default.Router()
    //@ts-ignore
    .post("/register", (0, validateInput_1.validateInput)(user_schema_1.registerSchema), (req, res) => controller.RegisterUser(req, res))
    //@ts-ignore
    .get("/verify", (0, validateInput_1.validateInput)(user_schema_1.verifySchema), (req, res) => controller.VerifyUser(req, res))
    .post("/login", (0, validateInput_1.validateInput)(user_schema_1.loginSchema), (req, res) => controller.LoginUser(req, res))
    .post("/forgot", (0, validateInput_1.validateInput)(user_schema_1.forgotSchema), (req, res) => controller.Forgot(req, res))
    .post("/reset", (0, validateInput_1.validateInput)(user_schema_1.resetSchema), (req, res) => controller.Reset(req, res))
    //@ts-ignore
    .get("/all-users", guard_1.isAdmin, (req, res) => controller.GetUsers(req, res))
    //@ts-ignore
    .get("/get-user", guard_1.isAdmin, (0, validateInput_1.validateInput)(user_schema_1.getUserSchema), (req, res) => controller.GetUser(req, res))
    //@ts-ignore
    .get("/manage-user", guard_1.isAdmin, (0, validateInput_1.validateInput)(user_schema_1.manageSchema), (req, res) => controller.ManageUser(req, res))
    //@ts-ignore
    .patch("/update-user", guard_1.isAuth, (0, validateInput_1.validateInput)(user_schema_1.updateUserSchema), (req, res) => controller.UpdateUser(req, res))
    //@ts-ignore
    .post("/update-password", guard_1.isAuth, (0, validateInput_1.validateInput)(user_schema_1.updatePasswordSchema), (req, res) => controller.UpdatePassword(req, res));
