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
exports.getEmployeeInDeptSchema = exports.departmentSchema = void 0;
const z = __importStar(require("zod"));
exports.departmentSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'department name is required' }),
    }),
});
exports.getEmployeeInDeptSchema = z.object({
    params: z.object({
        id: z
            .string()
            .min(1, "department ID is required")
            .regex(/^\d+$/, "department ID must be a number"),
    }),
    query: z.object({
        page: z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val) : 1))
            .refine((val) => !isNaN(val) && val > 0, {
            message: "page must be a positive number",
        }),
        limit: z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val) : 10))
            .refine((val) => !isNaN(val) && val > 0, {
            message: "limit must be a positive number",
        }),
    }),
});
