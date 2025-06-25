import { useState, useEffect } from "react";
import { Hospitalization } from "@/types/models";
import { toast } from "sonner";
import { HospitalizationService } from "@/services/hospitalizationService";
import {
  CreateHospitalizationFormValues,
  DischargePatientFormValues,
} from "@/schemas/hospitalization-schema";

export const useHospitalization = () => {
  const [hospitalizations, setHospitalizations] = useState<Hospitalization[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHospitalizations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await HospitalizationService.getAllHospitalizations();
      setHospitalizations(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Помилка при завантаженні госпіталізацій";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching hospitalizations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createHospitalization = async (
    data: CreateHospitalizationFormValues,
  ) => {
    try {
      const newHospitalization =
        await HospitalizationService.createHospitalization({
          patientId: data.patientId,
          bedId: data.bedId,
          admissionDateTime: data.admissionDateTime,
          plannedDischargeDateTime: data.plannedDischargeDateTime,
          admissionReason: data.admissionReason,
        });
      setHospitalizations((prev) => [...prev, newHospitalization]);
      toast.success("Пацієнт успішно госпіталізований");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Помилка при госпіталізації пацієнта";
      toast.error(errorMessage);
      console.error("Error adding hospitalization:", err);
    }
  };

  const dischargePatient = async (
    patientId: string,
    dischargeData: DischargePatientFormValues,
  ) => {
    setIsLoading(true);
    try {
      await HospitalizationService.dischargePatientByPatientId(patientId, {
        actualDischargeDateTime: dischargeData.actualDischargeDateTime,
        dischargeReason: dischargeData.dischargeReason,
      });

      // setHospitalizations((prev) =>
      //   prev.map((h) => (h.patientId === patientId ? response : h)),
      // );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Помилка при виписці пацієнта";
      toast.error(errorMessage);
      console.error("Error fetching hospitalizations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalizations();
  }, []);

  return {
    hospitalizations,
    isLoading,
    error,
    refetch: fetchHospitalizations,
    createHospitalization,
    dischargePatient,
  };
};
