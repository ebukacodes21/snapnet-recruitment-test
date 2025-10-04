"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const loan_controller_1 = require("../controllers/loan.controller");
const loan_service_1 = require("../services/loan.service");
const loan_repository_1 = require("../repository/loan.repository");
const guard_1 = require("../../../middleware/guard");
const fs_1 = __importDefault(require("fs"));
const validateInput_1 = require("../../../middleware/validateInput");
const loan_schema_1 = require("../../../schema/loan.schema");
const repository = new loan_repository_1.LoanRepository();
const service = new loan_service_1.LoanService(repository);
const controller = new loan_controller_1.LoanController(service);
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "uploads/";
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    },
});
exports.default = express_1.default.Router()
    //@ts-ignore
    .post("/upload-file", guard_1.isAuth, upload.single('file'), (req, res) => controller.CreateFile(req, res))
    .get("/get-loan-types", (req, res) => controller.GetLoanTypes(req, res))
    //@ts-ignore
    .post("/request-loan", guard_1.isAuth, (0, validateInput_1.validateInput)(loan_schema_1.loanSchema), (req, res) => controller.RequestLoan(req, res))
    //@ts-ignore
    .get("/get-user-loan", guard_1.isAuth, (req, res) => controller.GetUserLoan(req, res))
    //@ts-ignore
    .get("/get-user-loans", guard_1.isAuth, (req, res) => controller.GetUserLoans(req, res))
    //@ts-ignore
    .get("/get-loans", guard_1.isAdmin, (req, res) => controller.GetLoans(req, res))
    //@ts-ignore
    .post("/message", guard_1.isAdmin, (0, validateInput_1.validateInput)(loan_schema_1.messageSchema), (req, res) => controller.Message(req, res))
    //@ts-ignore
    .post("/forward-loan", guard_1.isAdmin, (0, validateInput_1.validateInput)(loan_schema_1.manageLoanSchema), (req, res) => controller.ForwardLoan(req, res))
    //@ts-ignore
    .post("/approve-loan", guard_1.isManagement, (0, validateInput_1.validateInput)(loan_schema_1.manageLoanSchema), (req, res) => controller.ApproveLoan(req, res))
    //@ts-ignore
    .post("/reject-loan", guard_1.isAdmin, (0, validateInput_1.validateInput)(loan_schema_1.manageLoanSchema), (req, res) => controller.RejectLoan(req, res))
    //@ts-ignore
    .post("/deposit", guard_1.isAuth, (0, validateInput_1.validateInput)(loan_schema_1.createDepositSchema), (req, res) => controller.Deposit(req, res))
    //@ts-ignore
    .post("/forward-deposit", guard_1.isAdmin, (0, validateInput_1.validateInput)(loan_schema_1.depositSchema), (req, res) => controller.ForwardDeposit(req, res))
    //@ts-ignore
    .post("/approve-deposit", guard_1.isManagement, (0, validateInput_1.validateInput)(loan_schema_1.depositSchema), (req, res) => controller.ApproveDeposit(req, res))
    //@ts-ignore
    .post("/reject-deposit", guard_1.isAdmin, (0, validateInput_1.validateInput)(loan_schema_1.depositSchema), (req, res) => controller.RejectDeposit(req, res));
