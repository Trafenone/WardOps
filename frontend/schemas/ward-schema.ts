import { WardGenderPolicy } from "@/types/enums";
import { z } from "zod";

export const wardSchema = z.object({
  departmentId: z.string().min(1, { message: "Відділення обов'язкове" }),
  wardNumber: z
    .string()
    .min(1, { message: "Номер палати обов'язковий" })
    .max(20, { message: "Номер палати не може бути довшим за 20 символів" }),
  wardTypeId: z.string().min(1, { message: "Тип палати обов'язковий" }),
  genderPolicy: z.nativeEnum(WardGenderPolicy, {
    errorMap: () => ({ message: "Гендерна політика обов'язкова" }),
  }),
  maxCapacity: z
    .number()
    .int()
    .min(1, { message: "Місткість повинна бути мінімум 1" })
    .max(20, { message: "Місткість не може бути більшою за 20" }),
  notes: z
    .string()
    .max(500, { message: "Примітки не можуть бути довшими за 500 символів" })
    .optional()
    .nullable(),
});

export type WardFormValues = z.infer<typeof wardSchema>;
