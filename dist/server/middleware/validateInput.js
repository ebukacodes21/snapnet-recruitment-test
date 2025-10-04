"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = void 0;
const zod_1 = require("zod");
const validateInput = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const formatted = error.errors.map((err) => ({
                message: err.message,
                path: err.path.join('.'),
            }));
            return res.status(400).json({
                message: formatted.map(f => f.message),
                statusCode: 400,
                errors: formatted,
            });
        }
        return res.status(500).json({
            message: 'Internal server error during validation',
            statusCode: 500,
        });
    }
};
exports.validateInput = validateInput;
