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
exports.LoanController = void 0;
const constant_1 = require("../../../constant");
class LoanController {
    constructor(loanService) {
        this.loanService = loanService;
    }
    GetLoanTypes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).json(constant_1.loanTypes);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    CreateFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email } = req.body;
                if (!name || !email) {
                    return res
                        .status(401)
                        .json({ message: "name/email of uploader is required" });
                }
                const { path } = req.file;
                const result = yield this.loanService.CreateFile({ path, name, email });
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
            }
        });
    }
    RequestLoan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = res.locals;
                const result = yield this.loanService.RequestLoan(user, req.body);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    GetUserLoan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = res.locals;
                const result = yield this.loanService.GetUserLoan(user.id);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    GetUserLoans(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = res.locals;
                const result = yield this.loanService.GetUserLoans(user.id);
                res.status(201).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(400).json({ message: error.message });
            }
        });
    }
    GetLoans(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.loanService.GetLoans();
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    Message(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.loanService.Message(req.body);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    ForwardLoan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.loanService.ForwardLoan(req.body);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    ApproveLoan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.loanService.ApproveLoan(req.body);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    RejectLoan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.loanService.RejectLoan(req.body);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    Deposit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.loanService.Deposit(req.body);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    ForwardDeposit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.loanService.ForwardDeposit(req.body);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    ApproveDeposit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.loanService.ApproveDeposit(req.body);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    RejectDeposit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.loanService.RejectDeposit(req.body);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.LoanController = LoanController;
