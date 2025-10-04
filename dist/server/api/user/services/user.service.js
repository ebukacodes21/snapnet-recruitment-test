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
exports.UserService = void 0;
const jwt_1 = require("../../../utils/jwt");
const password_1 = require("../../../utils/password");
const user_model_1 = require("../model/user.model");
const lodash_1 = __importDefault(require("lodash"));
const sendMail_1 = require("../../../utils/mail/sendMail");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { omit } = lodash_1.default;
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    CreateUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salt = yield (0, password_1.GenSalt)();
                const hash = yield (0, password_1.GetHashedPassword)(data.password, salt);
                const payload = Object.assign(Object.assign({}, data), { password: hash });
                const result = yield this.userRepository.Register(payload);
                const user = omit(result.toJSON(), user_model_1.privateFields);
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    VerifyUser(id, code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.FindUserByCode(Number(id), code);
                if (!user)
                    throw new Error("user not found with code");
                if (user.emailVerified)
                    throw new Error(`account already verified. login to access your account.`);
                user.emailVerified = true;
                user.accountEnabled = true;
                yield user.save();
                return { message: "verification successful" };
            }
            catch (error) {
                throw error;
            }
        });
    }
    LoginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.FindUserByEmail(email);
                if (!result)
                    throw new Error("user not found with email");
                if (!result.emailVerified)
                    throw new Error("please verify email address to login");
                if (!result.accountEnabled)
                    throw new Error("your account is temporarily disabled");
                const validatePwd = yield (0, password_1.ValidatePassword)(password, result.password);
                if (!validatePwd)
                    throw new Error("incorrect password!");
                result.lastLogin = new Date();
                yield result.save();
                const user = omit(result.toJSON(), user_model_1.privateFields);
                const token = (0, jwt_1.signToken)(user);
                return Object.assign(Object.assign({}, user), { token });
            }
            catch (error) {
                throw error;
            }
        });
    }
    Forgot(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.FindUserByEmail(email);
                if (!result)
                    return {
                        message: "a reset link has been sent to the email address, follow link to reset password",
                    };
                const user = omit(result.toJSON(), user_model_1.privateFields);
                const token = (0, jwt_1.signToken)(user, { expiresIn: "5m" });
                const html = `
            <div>
                 <h2>Password Reset Request!</h2>
                 <p>Hi ${result.firstName} ${result.lastName},</p>
                 <p>You have requested to reset your GAAT Investment password.</p>
                 <p>Click on this <a href="${process.env.FRONTEND}/auth-pages/reset?token=${token}" class="link">link</a> to reset your account password.</p>
                 <div class="footer">
                 <p>&copy; 2025 GAAT Investment | All Rights Reserved</p>
                 </div>
            </div>
         `;
                yield (0, sendMail_1.mailUser)(result.email, "Password Reset Request", html);
                return {
                    message: "a reset link has been sent to the email address, follow link to reset password",
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    Reset(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = yield (0, jwt_1.verifyToken)(data.token);
                if (!payload)
                    throw new Error("invalid or expired token, please request a fresh link");
                const user = yield this.userRepository.FindUserByEmail(payload.email);
                if (!user)
                    throw new Error("no user found");
                const salt = yield (0, password_1.GenSalt)();
                const hash = yield (0, password_1.GetHashedPassword)(data.password, salt);
                user.password = hash;
                yield user.save();
                return { message: "password reset successful" };
            }
            catch (error) {
                throw error;
            }
        });
    }
    GetUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.userRepository.GetUsers();
                const users = data.users.map((user) => {
                    return omit(user.toJSON(), user_model_1.privateFields);
                });
                return { users, loans: data.loans, deposits: data.deposits };
            }
            catch (error) {
                throw error;
            }
        });
    }
    GetUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.FindUserByPK(id);
                if (!result)
                    throw new Error("user not found with id");
                const userData = yield this.userRepository.GetUserData(result === null || result === void 0 ? void 0 : result.id);
                const user = omit(result.toJSON(), user_model_1.privateFields);
                return { user, userData };
            }
            catch (error) {
                throw error;
            }
        });
    }
    ManageUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.FindUserByPK(data.id);
                if (!user)
                    throw new Error("user not found with id");
                if (data.action === "true") {
                    user.accountEnabled = true;
                    yield user.save();
                    return { message: "account enabled" };
                }
                user.accountEnabled = false;
                yield user.save();
                return { message: "account disabled" };
            }
            catch (error) {
                throw error;
            }
        });
    }
    UpdateUser(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.UpdateUser(userId, data);
                const user = omit(result.user.toJSON(), user_model_1.privateFields);
                return { message: result.message, user };
            }
            catch (error) {
                throw error;
            }
        });
    }
    UpdatePassword(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.FindUserByPK(userId);
                if (!user)
                    throw new Error("user not found with id");
                let passwordUpdate = null;
                const isOldPasswordValid = yield (0, password_1.ValidatePassword)(data.currentPassword, user.password);
                if (!isOldPasswordValid)
                    throw new Error("incorrect password!");
                const salt = yield (0, password_1.GenSalt)();
                passwordUpdate = yield (0, password_1.GetHashedPassword)(data.newPassword, salt);
                user.password = passwordUpdate;
                yield user.save();
                return { message: "password update successful" };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserService = UserService;
