import z from "zod";

export const createHospitalizationSchema = z.object({
  patientId: z.string().min(1, "Пацієнт є обов'язковим полем"),
  bedId: z.string().min(1, "Ліжко є обов'язковим полем"),
  admissionDateTime: z.date(),
  plannedDischargeDateTime: z.date().optional(),
  admissionReason: z.string().optional(),
});

export const dischargePatientSchema = z.object({
  dischargeReason: z.string().optional(),
  actualDischargeDateTime: z.date(),
});

export type CreateHospitalizationFormValues = z.infer<
  typeof createHospitalizationSchema
>;
export type DischargePatientFormValues = z.infer<typeof dischargePatientSchema>;
