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
exports.UserRepository = void 0;
const deposit_model_1 = require("../../loan/models/deposit.model");
const loan_model_1 = require("../../loan/models/loan.model");
const user_model_1 = require("../model/user.model");
const sendMail_1 = require("../../../utils/mail/sendMail");
const database_config_1 = require("../../../database/database.config");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class UserRepository {
    Register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield database_config_1.database.transaction();
            try {
                const user = yield user_model_1.UserModel.create(data, { transaction });
                const html = `
            <div>
              <h2>Welcome to GAAT Investment!</h2>
              <p>Hi ${user.firstName} ${user.lastName},</p>
              <p>Thank you for registering with GAAT Investment. We're excited to have you on board!</p>
              <p>Click on this <a href="${process.env.FRONTEND}/auth-pages/verify?id=${user.id}&code=${user.verificationCode}" class="link">link</a> to verify your account.</p>
              <div class="footer">
                <p>&copy; 2025 GAAT Investment | All Rights Reserved</p>
              </div>
            </div>
          `;
                yield (0, sendMail_1.mailUser)(user.email, "Registration Mail", html);
                yield transaction.commit();
                return user;
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    FindUserByCode(id, code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.UserModel.findOne({
                    where: { id, verificationCode: code },
                });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    FindUserByPK(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.UserModel.findByPk(id);
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    FindUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.UserModel.findOne({ where: { email } });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    GetUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [users, loans, deposits] = yield Promise.all([
                    (yield user_model_1.UserModel.findAll()).reverse(),
                    (yield loan_model_1.LoanModel.findAll()).reverse(),
                    (yield deposit_model_1.DepositModel.findAll()).reverse(),
                ]);
                return { users, loans, deposits };
            }
            catch (error) {
                throw error;
            }
        });
    }
    GetUserData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userLoans, userDeposits] = yield Promise.all([
                    (yield loan_model_1.LoanModel.findAll({ where: { userId: id } })).reverse(),
                    (yield deposit_model_1.DepositModel.findAll({ where: { userId: id } })).reverse(),
                ]);
                return { userLoans, userDeposits };
            }
            catch (error) {
                throw error;
            }
        });
    }
    UpdateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield database_config_1.database.transaction();
            try {
                const user = yield user_model_1.UserModel.findByPk(id, { transaction });
                if (!user)
                    throw new Error('user not found');
                const emailChanged = user.email !== data.email;
                if (emailChanged) {
                    user.emailVerified = false;
                    const html = `
          <div>
            <h2>Welcome to GAAT Investment!</h2>
            <p>Hi ${data.firstName} ${data.lastName},</p>
            <p>Your email has been updated. To verify your new email, please click on the link below:</p>
            <p><a href="${process.env.FRONTEND}/auth-pages/verify?id=${user.id}&code=${user.verificationCode}" class="link">Verify Email</a></p>
            <div class="footer">
              <p>&copy; 2025 GAAT Investment | All Rights Reserved</p>
            </div>
          </div>
        `;
                    yield (0, sendMail_1.mailUser)(data.email, 'Email Verification', html);
                }
                yield user.update(data, { transaction });
                yield transaction.commit();
                return { message: "update successful", user };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
}
exports.UserRepository = UserRepository;
