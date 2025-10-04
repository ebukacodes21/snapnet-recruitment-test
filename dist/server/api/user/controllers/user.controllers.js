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
exports.UserController = void 0;
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    // register
    RegisterUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = (yield this.userService.CreateUser(req.body));
                return res
                    .status(201)
                    .json({
                    message: "registration successful. click link in mail to verify email address",
                    data: result,
                });
            }
            catch (error) {
                if ((_a = error === null || error === void 0 ? void 0 : error.parent) === null || _a === void 0 ? void 0 : _a.sqlMessage.includes("Duplicate")) {
                    return res.status(400).json({ message: "email address already taken" });
                }
                return res
                    .status(500)
                    .json({ message: "internal server error. please inspect logs" });
            }
        });
    }
    // verify
    VerifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.id;
                const code = req.query.code;
                const result = yield this.userService.VerifyUser(id, code);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // login 
    LoginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.userService.LoginUser(email, password);
                const role = result.isAdmin ? "gaat_admin" : "gaat_user";
                res.cookie(role, result.token, { httpOnly: true, sameSite: true, path: "/" });
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // forgot
    Forgot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const result = yield this.userService.Forgot(email);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    Reset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, token } = req.body;
                const result = yield this.userService.Reset({ password, token });
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    GetUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userService.GetUsers();
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
            }
        });
    }
    // get user related info
    GetUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.id;
                const result = yield this.userService.GetUser(Number(id));
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    ManageUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.id;
                const action = req.query.action;
                const result = yield this.userService.ManageUser({ id: Number(id), action });
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    UpdateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userService.UpdateUser(res.locals.id, req.body);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    UpdatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userService.UpdatePassword(res.locals.id, req.body);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.UserController = UserController;
