import { AnyZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateInput = (schema: AnyZodObject) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
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
