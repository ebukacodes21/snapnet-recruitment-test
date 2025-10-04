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
exports.LoanRepository = void 0;
// import { Deposit } from "../../../types";
const database_config_1 = require("../../../database/database.config");
const helper_1 = require("../../../utils/helper");
const sendMail_1 = require("../../../utils/mail/sendMail");
const user_model_1 = require("../../user/model/user.model");
const deposit_model_1 = require("../models/deposit.model");
const file_model_1 = require("../models/file.model");
const loan_model_1 = require("../models/loan.model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class LoanRepository {
    CreateFile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findOne({ where: { email: data.email } });
            if (!user)
                throw new Error("user not found with email");
            try {
                const fileRecord = yield file_model_1.FileModel.create({
                    path: data.path,
                    name: data.name,
                    email: data.email,
                });
                return fileRecord;
            }
            catch (error) {
                throw error;
            }
        });
    }
    RequestLoan(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield database_config_1.database.transaction();
            try {
                yield loan_model_1.LoanModel.create(data, { transaction });
                const html = `
        <div>
          <h2>Loan Request</h2>
          <p>Hi ${(0, helper_1.capitalizeWords)(user.firstName + " " + user.lastName)},</p>
          <p>We have received your loan request. An admin will verify and approve your request.</p>
          <p>Thank You for choosing GAAT Investment</p>
          <div class="footer">
            <p>&copy; 2025 GAAT Investment | All Rights Reserved</p>
          </div>
        </div>
      `;
                const adminHtml = `
        <div>
          <h2>Loan Request</h2>
          <p>New Loan Request</p>
          <a href="${process.env.ADMIN}/">Login to view loan request</a>
          <div class="footer">
            <p>&copy; 2025 GAAT Investment | All Rights Reserved</p>
          </div>
        </div>
      `;
                yield Promise.all([
                    (0, sendMail_1.mailUser)(user.email, "Loan Request", html),
                    (0, sendMail_1.mailUser)(process.env.STAFF_EMAIL, "Loan Request", adminHtml),
                ]);
                yield transaction.commit();
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    GetUserLoans(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.UserModel.findByPk(id);
                if (!user)
                    throw new Error("user not found with id");
                return loan_model_1.LoanModel.findAll({ where: { userId: id } });
            }
            catch (error) {
                throw error;
            }
        });
    }
    GetUserLoan(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.UserModel.findByPk(id);
                if (!user)
                    throw new Error("user not found with id");
                return loan_model_1.LoanModel.findOne({ where: { userId: id } });
            }
            catch (error) {
                throw error;
            }
        });
    }
    GetLoans() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return loan_model_1.LoanModel.findAll();
            }
            catch (error) {
                throw error;
            }
        });
    }
    FindUserByMail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return user_model_1.UserModel.findOne({ where: { email } });
            }
            catch (error) {
                throw error;
            }
        });
    }
    GetLoan(email, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return loan_model_1.LoanModel.findOne({ where: { id, email } });
            }
            catch (error) {
                throw error;
            }
        });
    }
    CreateDeposit(deposit, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield database_config_1.database.transaction();
            try {
                const newDeposit = yield deposit_model_1.DepositModel.create(deposit, { transaction });
                const html = `
        <div>
          <h2>Loan Deposit</h2>
          <p>Hi ${(0, helper_1.capitalizeWords)(user.firstName + " " + user.lastName)},</p>
          <p>We have received your loan deposit. An admin will verify and approve your deposit.</p>
          <p>Thank You for choosing GAAT Investment</p>
          <div class="footer">
            <p>&copy; 2025 GAAT Investment | All Rights Reserved</p>
          </div>
        </div>
      `;
                const adminHtml = `
        <div>
          <h2>Loan Deposit</h2>
          <p>New Loan Deposit</p>
          <a href="${process.env.ADMIN}/">Login to view loan deposit</a>
          <div class="footer">
            <p>&copy; 2025 GAAT Investment | All Rights Reserved</p>
          </div>
        </div>
      `;
                yield Promise.all([
                    (0, sendMail_1.mailUser)(user.email, "Loan Deposit", html),
                    (0, sendMail_1.mailUser)(process.env.STAFF_EMAIL, "Loan Deposit", adminHtml),
                ]);
                yield transaction.commit();
                return newDeposit;
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    GetUserDeposits(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return deposit_model_1.DepositModel.findAll({ where: { userId: id } });
            }
            catch (error) {
                throw error;
            }
        });
    }
    GetDeposits() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return deposit_model_1.DepositModel.findAll();
            }
            catch (error) {
                throw error;
            }
        });
    }
    GetDeposit(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return deposit_model_1.DepositModel.findOne({
                    where: { email: data.email, txId: data.txId },
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.LoanRepository = LoanRepository;
