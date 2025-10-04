"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositSchema = exports.createDepositSchema = exports.manageLoanSchema = exports.messageSchema = exports.loanSchema = void 0;
const z = __importStar(require("zod"));
exports.loanSchema = z.object({
    body: z.object({
        accountNumber: z.string().nonempty("account number is required"),
        bankName: z.string().nonempty("bank name is required"),
        accountHolder: z.string().nonempty("accountHolder is required"),
        collateral: z.string().nonempty("collateral is required"),
        bvn: z.string().nonempty("bvn is required"),
        guarantorName: z.string().optional(),
        guarantorEmail: z.string().optional(),
        guarantorPhone: z.string().optional(),
        guarantorIppisNo: z.string().optional(),
        type: z.string().nonempty("loan type is required"),
        amount: z.number({ message: "loan amount is required" }),
        term: z.number({ message: "term is required" }),
        statement: z.string().nonempty("uploaded statement of acount file link is required"),
        adminFeeReceipt: z.string().nonempty("uploaded admin fee receipt file link is required"),
        collateralDocument: z.string().nonempty("uploaded collateral document file link is required"),
        loanInterest: z.string().optional(),
        occupation: z.string().nonempty("occupation is required"),
        employerAddress: z.string().optional(),
        employerName: z.string().optional(),
        employerPhone: z.string().optional(),
        yourIppisNo: z.string().optional(),
    })
});
exports.messageSchema = z.object({
    body: z.object({
        email: z.string().email("invalid email address"),
        message: z.string().nonempty("message is required"),
    })
});
exports.manageLoanSchema = z.object({
    body: z.object({
        email: z.string().email("invalid email address"),
        id: z.number({ message: "loan id is required" }),
    })
});
exports.createDepositSchema = z.object({
    body: z.object({
        type: z.string().nonempty("deposit type is required"),
        email: z.string().email("invalid email address"),
        loanId: z.number({ message: "loan id is required" }),
        months: z.number({ message: "number of months is required " }),
        receipt: z.string().nonempty("receipt is required"),
        amount: z.number({ message: "amount is required " }),
    })
});
exports.depositSchema = z.object({
    body: z.object({
        txId: z.string().nonempty("txId is required"),
        email: z.string().email("invalid email address"),
        loanId: z.number({ message: "loan id is required" }),
        months: z.number({ message: "number of months is required " }),
        receipt: z.string().nonempty("receipt is required"),
        amount: z.number({ message: "amount is required " }),
    })
});
