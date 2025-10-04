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
exports.updatePasswordSchema = exports.updateUserSchema = exports.manageSchema = exports.getUserSchema = exports.resetSchema = exports.forgotSchema = exports.loginSchema = exports.verifySchema = exports.registerSchema = void 0;
const z = __importStar(require("zod"));
exports.registerSchema = z.object({
    body: z.object({
        email: z.string().email("invalid email address"),
        password: z.string().min(6, "password must be at least 6 characters long"),
        termsAccepted: z.boolean().refine((val) => val === true, {
            message: "you must accept the terms and conditions",
        }),
        firstName: z.string().nonempty("first name is required"),
        lastName: z.string().nonempty("last name is required"),
        address: z.string().nonempty("address is required"),
        city: z.string().nonempty("city is required"),
        zipCode: z.string().nonempty("zip code is required"),
        state: z.string().nonempty("state is required"),
        gender: z.string().nonempty("gender is required"),
        maritalStatus: z.string().nonempty("marital status is required"),
        aboutUs: z.string().nonempty("how you heard about us is required"),
        phone1: z.string().nonempty("primary phone number is required"),
        phone2: z.string().nonempty("secondary phone number is required"),
        occupation: z.string().nonempty("occupation is required"),
    }),
});
exports.verifySchema = z.object({
    query: z.object({
        id: z.string().min(1, "user id is required"),
        code: z.string().min(1, "verification code is required"),
    }),
});
exports.loginSchema = z.object({
    body: z.object({
        email: z.string().email("invalid email address"),
        password: z.string().min(6, "password must be at least 6 characters long"),
    }),
});
exports.forgotSchema = z.object({
    body: z.object({
        email: z.string().email("invalid email address"),
    }),
});
exports.resetSchema = z.object({
    body: z
        .object({
        token: z.string().min(1, "token is required"),
        password: z
            .string()
            .min(6, "password must be at least 6 characters long"),
        confirmPassword: z
            .string()
            .min(6, "password must be at least 6 characters long"),
    })
        .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match!",
        path: ["confirmPassword"],
    }),
});
exports.getUserSchema = z.object({
    query: z.object({
        id: z.string().min(1, "user id is required"),
    }),
});
exports.manageSchema = z.object({
    query: z.object({
        id: z.string().min(1, "user id is required"),
        action: z.string().nonempty("action is required"),
    }),
});
exports.updateUserSchema = z.object({
    body: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
        phone1: z.string().optional(),
        phone2: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        zipCode: z.string().optional(),
        state: z.string().optional(),
        gender: z.string().optional(),
        maritalStatus: z.string().optional(),
        occupation: z.string().optional(),
        imgUrl: z.string().optional(),
    }),
});
exports.updatePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().min(6, {
            message: "Minimum 6 characters required"
        }),
        newPassword: z.string().min(6, {
            message: "Minimum 6 characters required"
        }),
        confirmNewPassword: z.string().min(6, {
            message: "Minimum 6 characters required"
        }),
    }).refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "passwords do not match!",
        path: ["confirmNewPassword"],
    })
});
