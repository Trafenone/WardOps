import { PatientFormValues } from "@/schemas/patient-schema";
import { PatientService } from "@/services/patientService";
import { PatientStatus } from "@/types/enums";
import { Patient } from "@/types/models";
import { useEffect, useState } from "react";

export const usePatient = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const patientsData = await PatientService.getAllPatients();
      setPatients(patientsData);
    } catch (error) {
      // const errorMessage =
      //   err instanceof Error
      //     ? err.message
      //     : "Помилка при завантаженні пацієнтів";
      // setError(errorMessage);
      console.error("Error getting patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPatient = async (data: PatientFormValues) => {
    setIsLoading(true);
    try {
      const newPatient = await PatientService.createPatient({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        phoneNumber: data.phoneNumber ?? "",
        medicalCardNumber: data.medicalCardNumber ?? "",
        admissionDiagnosis: data.admissionDiagnosis ?? "",
        requiresIsolation: data.requiresIsolation,
        status: PatientStatus.Registered,
        notes: data.notes ?? "",
      });
      setPatients((prev) => [...prev, newPatient]);
      // or fetch updated patients list
    } catch (error) {
      console.error("Error adding patient:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePatient = async (patientId: string, data: PatientFormValues) => {
    setIsLoading(true);
    try {
      const updatedPatient = await PatientService.updatePatient(patientId, {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        phoneNumber: data.phoneNumber ?? "",
        medicalCardNumber: data.medicalCardNumber ?? "",
        admissionDiagnosis: data.admissionDiagnosis ?? "",
        requiresIsolation: data.requiresIsolation,
        status: data.status,
        notes: data.notes ?? "",
      });
      setPatients((prev) =>
        prev.map((patient) =>
          patient.id === patientId ? updatedPatient : patient,
        ),
      );
    } catch (error) {
      console.error("Error updating patient:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePatient = async (patientId: string) => {
    setIsLoading(true);
    try {
      await PatientService.deletePatient(patientId);
      setPatients((prev) => prev.filter((patient) => patient.id !== patientId));
    } catch (error) {
      console.error("Error deleting patient:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    isLoading,
    error,
    refetch: fetchPatients,
    addPatient,
    updatePatient,
    deletePatient,
  };
};
