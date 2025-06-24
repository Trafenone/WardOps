import { z } from "zod";

export const departmentSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Назва повинна містити мінімум 2 символи" })
    .max(100, { message: "Назва не може бути довшою за 100 символів" }),
  building: z
    .string()
    .max(50, { message: "Корпус не може бути довшим за 50 символів" })
    .optional()
    .nullable(),
  floorNumber: z
    .number()
    .int()
    .min(0, { message: "Поверх не може бути від'ємним" })
    .max(100, { message: "Поверх не може бути більшим за 100" })
    .optional()
    .nullable()
    .or(z.literal("")),
  description: z
    .string()
    .max(500, { message: "Опис не може бути довшим за 500 символів" })
    .optional()
    .nullable(),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;
