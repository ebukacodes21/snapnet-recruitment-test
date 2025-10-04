import * as z from 'zod';

export const departmentSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'department name is required' }),
  }),
});

export const getEmployeeInDeptSchema = z.object({
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

export type DepartmentInput = z.TypeOf<typeof departmentSchema>['body'];
export type GetEmployeeIndeptInput = z.TypeOf<typeof getEmployeeInDeptSchema>;
