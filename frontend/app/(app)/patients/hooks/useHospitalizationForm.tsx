import {
  DischargePatientFormValues,
  dischargePatientSchema,
} from "@/schemas/hospitalization-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function useHospitalizationForm() {
  const dischargeForm = useForm<DischargePatientFormValues>({
    resolver: zodResolver(dischargePatientSchema),
    defaultValues: {
      dischargeReason: "",
      actualDischargeDateTime: undefined,
    },
  });

  const resetForm = () => {
    dischargeForm.reset();
  };

  return {
    dischargeForm,
    resetForm,
  };
}
