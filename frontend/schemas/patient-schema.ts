import { GenderType, PatientStatus } from "@/types/enums";
import z from "zod";

export const patientSchema = z.object({
  firstName: z
    .string()
    .min(1, "Ім'я пацієнта є обов'язковим")
    .max(100, "Ім'я пацієнта не може перевищувати 100 символів"),
  lastName: z
    .string()
    .min(1, "Прізвище пацієнта є обов'язковим")
    .max(100, "Прізвище пацієнта не може перевищувати 100 символів"),
  dateOfBirth: z.coerce.date(),
  gender: z.nativeEnum(GenderType, {
    required_error: "Оберіть стать пацієнта",
  }),
  phoneNumber: z
    .string()
    .max(100, "Номер телефону не може перевищувати 100 символів")
    .nullable()
    .optional(),
  medicalCardNumber: z
    .string()
    .max(100, "Номер медичної картки не може перевищувати 100 символів")
    .nullable()
    .optional(),
  admissionDiagnosis: z
    .string()
    .max(500, "Діагноз госпіталізації не може перевищувати 500 символів")
    .nullable()
    .optional(),
  requiresIsolation: z.boolean(),
  notes: z
    .string()
    .max(1000, "Нотатки не можуть перевищувати 1000 символів")
    .nullable()
    .optional(),
  status: z.nativeEnum(PatientStatus, {
    required_error: "Оберіть статус пацієнта",
  }),
});

export type PatientFormValues = z.infer<typeof patientSchema>;
