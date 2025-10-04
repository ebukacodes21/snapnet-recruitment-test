import * as z from "zod";

export const createLeaveSchema = z.object({
  body: z.object({
    employeeId: z.number({ required_error: "employee ID is required" }),
    startDate: z
      .string({ required_error: "start date is required" })
      .refine(
        (val) => !isNaN(Date.parse(val)),
        { message: "start date must be a valid ISO date string" }
      ),
    endDate: z
      .string()
      .optional()
      .refine(
        (val) => !val || !isNaN(Date.parse(val)),
        { message: "end date must be a valid ISO date string" }
      ),
    status: z
      .enum(["pending", "approved", "rejected"])
      .optional()
      .default("pending"),
  }),
});

export type LeaveInput = z.TypeOf<typeof createLeaveSchema>["body"];
