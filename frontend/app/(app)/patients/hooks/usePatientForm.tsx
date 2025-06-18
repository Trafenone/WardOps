"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientFormValues, patientSchema } from "@/schemas/patient-schema";
import { GenderType, PatientStatus } from "@/types/enums";
import { Patient } from "@/types/models";

const initialFormValues: PatientFormValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: new Date(),
  gender: "" as GenderType,
  status: PatientStatus.Registered,
  phoneNumber: "",
  medicalCardNumber: "",
  admissionDiagnosis: "",
  requiresIsolation: false,
  notes: "",
};

export function usePatientForm() {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialFormValues,
  });

  const setPatientData = (patient: Patient) => {
    form.reset({
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: new Date(patient.dateOfBirth),
      gender: patient.gender,
      phoneNumber: patient.phoneNumber || "",
      medicalCardNumber: patient.medicalCardNumber || "",
      admissionDiagnosis: patient.admissionDiagnosis || "",
      requiresIsolation: patient.requiresIsolation,
      status: patient.status,
      notes: patient.notes || "",
    });
  };

  const resetForm = () => {
    form.reset(initialFormValues);
  };

  return {
    form,
    resetForm,
    setPatientData,
  };
}
