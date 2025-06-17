import { BedStatus } from "@/types/enums";
import z from "zod";

export const bedSchema = z.object({
  bedNumber: z
    .string()
    .min(1, { message: "Номер ліжка не може бути порожнім" })
    .max(50, { message: "Номер ліжка не може бути довшим за 50 символів" }),
  departmentId: z.string().uuid({ message: "Некоректний ID відділення" }),
  wardId: z.string().uuid({ message: "Некоректний ID палати" }),
  status: z.nativeEnum(BedStatus, {
    errorMap: () => ({ message: "Некоректний статус ліжка" }),
  }),
  notes: z
    .string()
    .max(500, { message: "Примітки не можуть бути довшими за 500 символів" })
    .optional()
    .nullable(),
});

export type BedFormValues = z.infer<typeof bedSchema>;
