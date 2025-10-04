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
exports.mailUser = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const template_1 = require("../mail/template");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transport = nodemailer_1.default.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    },
});
function sendMail(receiver, subject, html) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailOptions = {
            from: {
                name: process.env.EMAIL_SENDER,
                address: process.env.EMAIL_ADDRESS,
            },
            to: receiver,
            subject: subject,
            html: html,
        };
        try {
            const info = yield transport.sendMail(mailOptions);
            console.log('Email sent successfully:');
            return info;
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    });
}
const mailUser = (email, subject, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const html = (0, template_1.mailUserTemplate)(message);
        yield sendMail(email, subject, html);
    }
    catch (error) {
        console.error("Error generating email template:", error);
        throw error;
    }
});
exports.mailUser = mailUser;
