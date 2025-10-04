import * as z from "zod";

export const createEmployeeSchema = z.object({
  body: z.object({
    email: z.string({required_error: 'email address is required'}).email("invalid email address"),
    name: z.string({ required_error: 'employee name is required' }).min(1, "name cannot be empty"),
    departmentId: z.number({ required_error: 'department id is required' }),
  }),
});

export const getEmployeeSchema = z.object({
  params: z.object({
    id: z
      .string()
      .min(1, "employeeId ID is required")
      .regex(/^\d+$/, "employeeId ID must be a number"),
  }),
});


export type CreateEmployeeInput = z.TypeOf<typeof createEmployeeSchema>["body"];
export type GetEmployeeInput = z.TypeOf<typeof getEmployeeSchema>["params"];
