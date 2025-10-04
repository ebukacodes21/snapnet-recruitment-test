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
exports.LoanService = void 0;
const constant_1 = require("../../../constant");
const helper_1 = require("../../../utils/helper");
const sendMail_1 = require("../../../utils/mail/sendMail");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const formatCurrency = (amount) => `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})}`;
class LoanService {
    constructor(loanRepository) {
        this.loanRepository = loanRepository;
    }
    CreateFile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileUrl = `${process.env.SERVER_ADDRESS}/${data.path}`;
                const fileRecord = yield this.loanRepository.CreateFile({
                    path: fileUrl,
                    name: data.name,
                    email: data.email,
                });
                return { message: "file upload successful", fileRecord };
            }
            catch (error) {
                throw error;
            }
        });
    }
    RequestLoan(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            try {
                const loanType = constant_1.loanTypes.find((loan) => loan.name === data.type);
                if (!(loanType === null || loanType === void 0 ? void 0 : loanType.name))
                    throw new Error("invalid loan type");
                const occupation = data.occupation;
                const isPofLoan = loanType.name === "Proof of Funds Loan";
                const isEmployed = occupation === "Employed";
                const isUnemployedOrStudentOrSelfEmployed = ["Unemployed", "Student", "Self-Employed"].includes(occupation);
                if (!isPofLoan) {
                    if (isEmployed) {
                        if (!((_a = data.employerAddress) === null || _a === void 0 ? void 0 : _a.trim()) ||
                            !((_b = data.employerName) === null || _b === void 0 ? void 0 : _b.trim()) ||
                            !((_c = data.employerPhone) === null || _c === void 0 ? void 0 : _c.trim())) {
                            throw new Error("All Employer details must be provided for employed users.");
                        }
                        if (!((_d = data.guarantorEmail) === null || _d === void 0 ? void 0 : _d.trim()) ||
                            !((_e = data.guarantorIppisNo) === null || _e === void 0 ? void 0 : _e.trim()) ||
                            !((_f = data.guarantorName) === null || _f === void 0 ? void 0 : _f.trim()) ||
                            !((_g = data.guarantorPhone) === null || _g === void 0 ? void 0 : _g.trim())) {
                            throw new Error("All Guarantor details must be provided for employed users.");
                        }
                    }
                    else if (isUnemployedOrStudentOrSelfEmployed) {
                        if (!((_h = data.guarantorEmail) === null || _h === void 0 ? void 0 : _h.trim()) ||
                            !((_j = data.guarantorIppisNo) === null || _j === void 0 ? void 0 : _j.trim()) ||
                            !((_k = data.guarantorName) === null || _k === void 0 ? void 0 : _k.trim()) ||
                            !((_l = data.guarantorPhone) === null || _l === void 0 ? void 0 : _l.trim())) {
                            throw new Error("All Guarantor details must be provided for your occupation.");
                        }
                    }
                }
                if (isPofLoan && !((_m = data.loanInterest) === null || _m === void 0 ? void 0 : _m.trim())) {
                    throw new Error("Evidence of Proof of Funds Loan interest paid upfront must be provided.");
                }
                const monthlyPayment = (0, helper_1.calculateMonthlyPayment)(data.amount, data.term, loanType.rate);
                const monthlyInterest = data.amount * loanType.rate;
                const totalPayment = monthlyPayment * data.term;
                const totalInterest = totalPayment - data.amount;
                const adminFee = loanType.name === "Proof of Funds Loan"
                    ? 0.005 * data.amount
                    : 0.01 * data.amount;
                const totalAmountToPayBack = data.amount + totalInterest;
                const numberOfMonths = data.term;
                const dueDate = new Date();
                dueDate.setMonth(dueDate.getMonth() + numberOfMonths);
                const payload = {
                    loanType: loanType.name,
                    amount: data.amount,
                    interestRate: loanType.rate,
                    monthlyAmount: monthlyPayment,
                    monthlyInterest,
                    totalInterest,
                    adminFee,
                    totalRepayment: totalAmountToPayBack,
                    dueDate,
                    status: "received",
                    collateral: data.collateral,
                    collateralDocument: data.collateralDocument,
                    accountHolder: data.accountHolder,
                    guarantorName: data.guarantorName,
                    guarantorEmail: data.guarantorEmail,
                    guarantorPhone: data.guarantorPhone,
                    guarantorIppisNo: data.guarantorIppisNo,
                    bankName: data.bankName,
                    accountNumber: data.accountNumber,
                    bvn: data.bvn,
                    occupation: data.occupation,
                    employerAddress: data.employerAddress,
                    employerName: data.employerName,
                    employerPhone: data.employerPhone,
                    yourIppisNo: data.yourIppisNo,
                    statement: data.statement,
                    adminFeeReceipt: data.adminFeeReceipt,
                    loanInterest: data.loanInterest,
                    months: data.term,
                    userId: user.id,
                    borrower: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                };
                yield Promise.all([this.loanRepository.RequestLoan(payload, user)]);
                const userLoans = (yield this.loanRepository.GetUserLoans(user.id)).reverse();
                return {
                    message: "Loan request successful. Admin will review your loan.",
                    userLoans,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    GetUserLoan(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.loanRepository.GetUserLoan(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
    GetUserLoans(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userLoans, userDeposits] = yield Promise.all([
                    (yield this.loanRepository.GetUserLoans(id)).reverse(),
                    (yield this.loanRepository.GetUserDeposits(id)).reverse(),
                ]);
                return { userLoans, userDeposits };
            }
            catch (error) {
                throw error;
            }
        });
    }
    GetLoans() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield this.loanRepository.GetLoans()).reverse();
            }
            catch (error) {
                throw error;
            }
        });
    }
    Message(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.loanRepository.FindUserByMail(data.email);
                if (!user)
                    throw new Error("user not found with email");
                const html = `
      <div>
           <p>Hi ${user.firstName} ${user.lastName},</p>
           <p>${data.message}</p>
           <p>Thank You for choosing GAAT Investment</p>
           <div class="footer">
           <p>&copy; 2025 GAAT Investment | All Rights Reserved</p>
           </div>
      </div>
   `;
                yield (0, sendMail_1.mailUser)(user.email, "Loan Management", html);
                return { message: "message sent successfully" };
            }
            catch (error) {
                throw error;
            }
        });
    }
    ForwardLoan(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [loan] = yield Promise.all([
                    this.loanRepository.GetLoan(data.email, data.id),
                ]);
                if (!loan)
                    throw new Error("loan not found");
                if (loan.status !== "received")
                    throw new Error("loan already decided");
                loan.status = "pending";
                yield loan.save();
                const adminHtml = `
              <div>
                <h2>Pending Request</h2>
                <p>Pending Loan Request</p>
                <a href="${process.env.ADMIN}/">Login to view pending loan request</a>
                <div class="footer">
                  <p>&copy; 2025 GAAT Investment | All Rights Reserved</p>
                </div>
              </div>
            `;
                const [loans] = yield Promise.all([
                    (yield this.loanRepository.GetLoans()).reverse(),
                    (0, sendMail_1.mailUser)(process.env.ADMIN_EMAIL, "Loan Request", adminHtml),
                ]);
                return { message: "loan forwarded successfully", loans };
            }
            catch (error) {
                throw error;
            }
        });
    }
    ApproveLoan(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const [user, loan] = yield Promise.all([
                    this.loanRepository.FindUserByMail(data.email),
                    this.loanRepository.GetLoan(data.email, data.id),
                ]);
                if (!loan)
                    throw new Error("loan not found");
                if (!user)
                    throw new Error("user not found");
                if (loan.status !== "pending")
                    throw new Error("loan already decided");
                const approvedDate = new Date();
                loan.status = "approved";
                loan.approvedDate = approvedDate;
                if (loan.loanType === "Proof of Funds Loan") {
                    loan.totalRepaid = Number(loan.totalInterest);
                    loan.totalUnpaid =
                        Number(loan.totalRepayment) - Number(loan.totalRepaid);
                    loan.nextPaymentDate = loan.dueDate;
                    loan.numberOfRepayments = 1;
                }
                else {
                    const nextPaymentDate = new Date(approvedDate);
                    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
                    loan.nextPaymentDate = nextPaymentDate;
                    loan.numberOfRepayments = loan.months;
                }
                yield loan.save();
                const html = `
      <div>
           <h2>Loan Request Approved</h2>
           <p>Hi ${(0, helper_1.capitalizeWords)(user.firstName + " " + user.lastName)},</p>
            <p>Great news!</p>
  
            <p>
              We have reviewed your loan request of <strong>${formatCurrency(loan.amount)}</strong> and we are happy to inform you that your application has been approved.
            </p>

            ${loan.loanType !== "Proof of Funds Loan"
                    ? `<p>Your next payment is due on <strong>${(_a = loan.nextPaymentDate) === null || _a === void 0 ? void 0 : _a.toDateString()}</strong>.</p>`
                    : ""}
            <p>Thank you for choosing GAAT Investment. We are excited to support your financial journey.</p>
           <div class="footer">
           <p>&copy; 2025 GAAT Investment | All Rights Reserved</p>
           </div>
      </div>
   `;
                const [loans] = yield Promise.all([
                    (yield this.loanRepository.GetLoans()).reverse(),
                    (0, sendMail_1.mailUser)(user.email, "Loan Approval", html),
                ]);
                return { message: "loan approval successful", loans };
            }
            catch (error) {
                throw error;
            }
        });
    }
    RejectLoan(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [user, loan] = yield Promise.all([
                    this.loanRepository.FindUserByMail(data.email),
                    this.loanRepository.GetLoan(data.email, data.id),
                ]);
                if (!loan)
                    throw new Error("loan not found");
                if (!user)
                    throw new Error("user not found");
                if (loan.status !== "pending" && loan.status !== "received") {
                    throw new Error("loan already decided");
                }
                loan.status = "rejected";
                yield loan.save();
                const html = `
      <div>
           <h2>Loan Request Rejected</h2>
            <p>Hi ${(0, helper_1.capitalizeWords)(user.firstName + " " + user.lastName)},</p>
            <p>We have reviewed your loan request of ${formatCurrency(loan.amount)} and unfortuantely, 
            we will not be proceeding further with your request. 
            If you have any questions, please contact support.</p>
           <p>Thank You for choosing GAAT Investment</p>
           <div class="footer">
           <p>&copy; 2025 GAAT Investment | All Rights Reserved</p>
           </div>
      </div>
   `;
                const [loans] = yield Promise.all([
                    (yield this.loanRepository.GetLoans()).reverse(),
                    (0, sendMail_1.mailUser)(user.email, "Loan Rejected", html),
                ]);
                return { message: "loan rejection successful", loans };
            }
            catch (error) {
                throw error;
            }
        });
    }
    Deposit(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [user] = yield Promise.all([
                    this.loanRepository.FindUserByMail(data.email),
                ]);
                if (!user)
                    throw new Error("user not found");
                const deposit = {
                    status: "received",
                    type: data.type,
                    months: data.months,
                    receipt: data.receipt,
                    loanId: data.loanId,
                    amount: data.amount,
                    userId: user.id,
                    email: data.email,
                };
                yield Promise.all([this.loanRepository.CreateDeposit(deposit, user)]);
                const userDeposits = (yield this.loanRepository.GetUserDeposits(user.id)).reverse();
                return {
                    message: "loan deposit successful. admin will review your deposit",
                    userDeposits,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    ForwardDeposit(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deposit = yield this.loanRepository.GetDeposit({
                    email: data.email,
                    txId: data.txId,
                });
                if (!deposit)
                    throw new Error("Deposit not found");
                if (deposit.status !== "received")
                    throw new Error("Deposit already decided");
                deposit.status = "pending";
                yield deposit.save();
                const adminHtml = `
              <div>
                <h2>Pending Request</h2>
                <p>Pending Deposit Request</p>
                <a href="${process.env.ADMIN}/">Login to view pending deposit request</a>
                <div class="footer">
                  <p>&copy; 2025 GAAT Investment | All Rights Reserved</p>
                </div>
              </div>
            `;
                const [deposits] = yield Promise.all([
                    (yield this.loanRepository.GetDeposits()).reverse(),
                    (0, sendMail_1.mailUser)(process.env.ADMIN_MAIL, "Deposit Request", adminHtml),
                ]);
                return { message: "loan forwarded successfully", deposits };
            }
            catch (error) {
                throw error;
            }
        });
    }
    ApproveDeposit(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const [user, loan, deposit] = yield Promise.all([
                    this.loanRepository.FindUserByMail(data.email),
                    this.loanRepository.GetLoan(data.email, data.loanId),
                    this.loanRepository.GetDeposit({ email: data.email, txId: data.txId }),
                ]);
                if (!loan)
                    throw new Error("Loan not found");
                if (!user)
                    throw new Error("User not found");
                if (!deposit)
                    throw new Error("Deposit not found");
                if (deposit.status !== "pending") {
                    throw new Error("Deposit already decided");
                }
                if (!loan.approvedDate || isNaN(new Date(loan.approvedDate).getTime())) {
                    throw new Error("Invalid loan approval date");
                }
                loan.totalRepaid = Number(loan.totalRepaid) + data.amount;
                loan.totalUnpaid = Number(loan.totalRepayment) - Number(loan.totalRepaid);
                deposit.status = "approved";
                if (loan.loanType === "Proof of Funds Loan") {
                    loan.numberOfRepayments = 0;
                    loan.status = "paid";
                }
                else {
                    const currentNextPaymentDate = new Date((_a = loan.nextPaymentDate) !== null && _a !== void 0 ? _a : loan.approvedDate);
                    if (deposit.type === "Monthly Interest") {
                        loan.numberOfRepayments += 1;
                        currentNextPaymentDate.setMonth(currentNextPaymentDate.getMonth() + 1);
                        loan.nextPaymentDate = currentNextPaymentDate;
                    }
                    else if (deposit.type === "Monthly Payment") {
                        loan.numberOfRepayments -= deposit.months;
                        currentNextPaymentDate.setMonth(currentNextPaymentDate.getMonth() + deposit.months);
                        loan.nextPaymentDate = currentNextPaymentDate;
                    }
                    if (loan.totalUnpaid <= 0 || loan.numberOfRepayments <= 0) {
                        loan.status = "paid";
                    }
                }
                yield Promise.all([loan.save(), deposit.save()]);
                const html = `
      <div>
        <h2>Deposit Approved</h2>
        <p>Hi ${(0, helper_1.capitalizeWords)(user.firstName + " " + user.lastName)},</p>
        <p>Great news!</p>
        <p>
          We have reviewed your deposit of <strong>${formatCurrency(data.amount)}</strong> and we are happy to inform you that your deposit has been approved.
        </p>
        <p>Thank you for choosing GAAT Investment.</p>
        <div class="footer">
          <p>&copy; 2025 GAAT Investment | All Rights Reserved</p>
        </div>
      </div>`;
                const [deposits] = yield Promise.all([
                    (yield this.loanRepository.GetDeposits()).reverse(),
                    (0, sendMail_1.mailUser)(user.email, "Deposit Approval", html),
                ]);
                return { message: "Deposit approval successful", deposits };
            }
            catch (error) {
                console.error("ApproveDeposit error:", error);
                throw error;
            }
        });
    }
    RejectDeposit(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [user, deposit] = yield Promise.all([
                    this.loanRepository.FindUserByMail(data.email),
                    this.loanRepository.GetDeposit({ email: data.email, txId: data.txId }),
                ]);
                if (!user)
                    throw new Error("User not found");
                if (!deposit)
                    throw new Error("Deposit not found");
                if (deposit.status !== "pending" && deposit.status !== "received")
                    throw new Error("Deposit already decided");
                deposit.status = "rejected";
                yield deposit.save();
                const html = `
      <div>
           <h2>Deposit Rejected</h2>
            <p>Hi ${(0, helper_1.capitalizeWords)(user.firstName + " " + user.lastName)},</p>
            <p>We have reviewed your deposit request of ${formatCurrency(data.amount)} and unfortuantely, 
            we will not be proceeding further with your request. 
            If you have any questions, please contact support.</p>
           <p>Thank You for choosing GAAT Investment</p>
           <div class="footer">
           <p>&copy; 2025 GAAT Investment | All Rights Reserved</p>
           </div>
      </div>
   `;
                const [deposits] = yield Promise.all([
                    (yield this.loanRepository.GetDeposits()).reverse(),
                    (0, sendMail_1.mailUser)(user.email, "Deposit Rejected", html),
                ]);
                return { message: "deposit rejection successful", deposits };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.LoanService = LoanService;
