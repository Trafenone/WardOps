import * as z from "zod";
import { PositionType } from "@/types/enums";

export const staffSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Ім'я має містити принаймні 2 символи" })
    .max(50, { message: "Ім'я не може перевищувати 50 символів" }),
  lastName: z
    .string()
    .min(2, { message: "Прізвище має містити принаймні 2 символи" })
    .max(50, { message: "Прізвище не може перевищувати 50 символів" }),
  email: z
    .string()
    .email({ message: "Введіть дійсну електронну адресу" })
    .max(100, { message: "Email не може перевищувати 100 символів" }),
  position: z.nativeEnum(PositionType, {
    required_error: "Оберіть посаду",
  }),
  departmentId: z.string().optional(),
  isActive: z.boolean(),
});

export const createStaffSchema = staffSchema
  .extend({
    password: z
      .string()
      .min(6, { message: "Пароль має містити принаймні 8 символів" })
      .max(128, { message: "Пароль не може перевищувати 128 символів" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не співпадають",
    path: ["confirmPassword"],
  });

export const updateStaffSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Ім'я має містити принаймні 2 символи" })
    .max(50, { message: "Ім'я не може перевищувати 50 символів" }),
  lastName: z
    .string()
    .min(2, { message: "Прізвище має містити принаймні 2 символи" })
    .max(50, { message: "Прізвище не може перевищувати 50 символів" }),
  position: z.nativeEnum(PositionType, {
    required_error: "Оберіть посаду",
  }),
  departmentId: z.string().optional(),
  isActive: z.boolean(),
});

export type CreateStaffFormValues = z.infer<typeof createStaffSchema>;

export type UpdateStaffFormValues = z.infer<typeof updateStaffSchema>;
