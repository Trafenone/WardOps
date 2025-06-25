"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Search } from "lucide-react";
import { Patient, Hospitalization } from "@/types/models";
import { usePatient } from "./hooks/usePatient";
import PatientList from "./components/PatientList";
import { HospitalizationList } from "./components/HospitalizationList";
import { usePatientForm } from "./hooks/usePatientForm";
import { PatientFormDialog } from "./components/PatientFormDialog";
import { PatientFormValues } from "@/schemas/patient-schema";
import { toast } from "sonner";
import DischargeList from "./components/DischargeList";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { useHospitalization } from "./hooks/useHospitalization";
import PatientViewDialog from "./components/PatientViewDialog";
import HospitalizationViewDialog from "./components/HospitalizationViewDialog";
import DischargePatientFormDialog from "./components/DischargePatientFormDialog";
import { DischargePatientFormValues } from "@/schemas/hospitalization-schema";
import { useHospitalizationForm } from "./hooks/useHospitalizationForm";
import { useAuth } from "@/providers/authContext";

interface DialogState {
  isAddPatientOpen: boolean;
  isEditPatientOpen: boolean;
  isViewPatientOpen: boolean;
  isConfirmDeleteOpen: boolean;
  isAssignHospitalizationOpen: boolean;
  isViewHospitalizationOpen: boolean;
  isDischargePatientOpen: boolean;
  selectedPatient: Patient | null;
  selectedHospitalization: Hospitalization | null;
}

export default function PatientManagement() {
  const {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    refetch,
    isLoading,
  } = usePatient();
  const { user } = useAuth();

  const {
    hospitalizations,
    dischargePatient,
    refetch: refetchHospitalizations,
  } = useHospitalization();

  const { form, setPatientData, resetForm } = usePatientForm();
  const { dischargeForm, resetForm: resetDischargeForm } =
    useHospitalizationForm();

  const [patientFormDialogMode, setPatientFormDialogMode] = useState<
    "add" | "edit"
  >("add");

  const [activeTab, setActiveTab] = useState("patients");
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogState, setDialogState] = useState<DialogState>({
    isAddPatientOpen: false,
    isEditPatientOpen: false,
    isViewPatientOpen: false,
    isConfirmDeleteOpen: false,
    isAssignHospitalizationOpen: false,
    isViewHospitalizationOpen: false,
    isDischargePatientOpen: false,
    selectedPatient: null,
    selectedHospitalization: null,
  });

  const onAddPatient = () => {
    resetForm();
    setPatientFormDialogMode("add");
    setDialogState((prev) => ({ ...prev, isAddPatientOpen: true }));
  };

  const onViewPatient = (patient: Patient) => {
    setDialogState((prev) => ({
      ...prev,
      selectedPatient: patient,
      isViewPatientOpen: true,
    }));
  };

  const onEditPatient = (patient: Patient) => {
    setPatientFormDialogMode("edit");
    setPatientData(patient);
    setDialogState((prev) => ({
      ...prev,
      selectedPatient: patient,
      isEditPatientOpen: true,
    }));
  };

  const onDeletePatient = (patient: Patient) => {
    setDialogState((prev) => ({
      ...prev,
      selectedPatient: patient,
      isConfirmDeleteOpen: true,
    }));
  };

  const onViewHospitalization = (hospitalization: Hospitalization) => {
    setDialogState((prev) => ({
      ...prev,
      selectedHospitalization: hospitalization,
      isViewHospitalizationOpen: true,
    }));
  };

  const onDischargePatient = (hospitalization: Hospitalization) => {
    resetDischargeForm();
    setDialogState((prev) => ({
      ...prev,
      selectedHospitalization: hospitalization,
      isDischargePatientOpen: true,
    }));
  };

  const handleClosePatientFormDialog = () => {
    setDialogState((prev) => ({
      ...prev,
      isAddPatientOpen: false,
      isEditPatientOpen: false,
      selectedPatient: null,
    }));
    resetForm();
  };

  const handleAddPatient = async (patientData: PatientFormValues) => {
    try {
      await addPatient(patientData);
      setDialogState((prev) => ({ ...prev, isAddPatientOpen: false }));
      resetForm();
      toast.success("Пацієнт успішно доданий");
    } catch (error) {
      console.error("Failed to add patient:", error);
      toast.error("Помилка при додаванні пацієнта");
    }
  };

  const handleEditPatient = async (patientData: PatientFormValues) => {
    if (!dialogState.selectedPatient) return;

    try {
      await updatePatient(dialogState.selectedPatient.id, patientData);
      setDialogState((prev) => ({
        ...prev,
        isEditPatientOpen: false,
        selectedPatient: null,
      }));
      resetForm();
      toast.success("Пацієнт успішно оновлений");
    } catch (error) {
      console.error("Failed to update patient:", error);
      toast.error("Помилка при оновленні пацієнта");
    }
  };

  const handleDeletePatient = async () => {
    if (!dialogState.selectedPatient) return;

    try {
      await deletePatient(dialogState.selectedPatient.id);
      setDialogState((prev) => ({
        ...prev,
        isConfirmDeleteOpen: false,
        selectedPatient: null,
      }));
    } catch (error) {
      console.error("Failed to delete patient:", error);
      toast.error("Помилка при видаленні пацієнта");
    }
  };

  const handleDischargePatient = async (
    dischargeData: DischargePatientFormValues,
  ) => {
    try {
      await dischargePatient(
        dialogState.selectedHospitalization!.patientId!,
        dischargeData,
      );
      await refetch();
      await refetchHospitalizations();
      setDialogState((prev) => ({
        ...prev,
        isDischargePatientOpen: false,
        selectedHospitalization: null,
      }));
      resetDischargeForm();
      toast.success("Пацієнт успішно виписаний");
    } catch (error) {
      console.error("Failed to discharge patient:", error);
      toast.error("Помилка при виписці пацієнта");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Управління пацієнтами</h2>
          <p className="text-gray-600">
            Реєстрація, госпіталізація та ведення пацієнтів
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Пошук пацієнтів..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button onClick={onAddPatient} variant="default">
            <UserPlus className="h-4 w-4 mr-2" />
            Додати пацієнта
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="patients">Пацієнти</TabsTrigger>
          <TabsTrigger value="hospitalizations">Госпіталізації</TabsTrigger>
          <TabsTrigger value="discharges">Виписки</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-4">
          <PatientList
            patients={patients}
            searchTerm={searchTerm}
            onViewPatient={onViewPatient}
            onEditPatient={onEditPatient}
            onDeletePatient={onDeletePatient}
          />
        </TabsContent>

        <TabsContent value="hospitalizations" className="space-y-4">
          <HospitalizationList
            hospitalizations={hospitalizations}
            currentUser={user}
            onViewHospitalization={onViewHospitalization}
            onDischargePatient={onDischargePatient}
          />
        </TabsContent>

        <TabsContent value="discharges" className="space-y-4">
          <DischargeList
            hospitalizations={hospitalizations}
            currentUser={user}
          />
        </TabsContent>
      </Tabs>

      <PatientFormDialog
        isOpen={dialogState.isAddPatientOpen || dialogState.isEditPatientOpen}
        onClose={handleClosePatientFormDialog}
        onSubmit={
          patientFormDialogMode === "add" ? handleAddPatient : handleEditPatient
        }
        form={form}
        isLoading={isLoading}
        mode={patientFormDialogMode}
      />

      <ConfirmDeleteDialog
        isOpen={dialogState.isConfirmDeleteOpen}
        onClose={() =>
          setDialogState((prev) => ({
            ...prev,
            isConfirmDeleteOpen: false,
            selectedPatient: null,
          }))
        }
        onConfirm={handleDeletePatient}
        isLoading={isLoading}
        entityName={`пацієнта "${dialogState.selectedPatient?.firstName} ${dialogState.selectedPatient?.lastName}"`}
      />

      <PatientViewDialog
        isOpen={dialogState.isViewPatientOpen}
        onClose={() =>
          setDialogState((prev) => ({
            ...prev,
            isViewPatientOpen: false,
            selectedPatient: null,
          }))
        }
        patient={dialogState.selectedPatient}
      />

      <DischargePatientFormDialog
        isOpen={dialogState.isDischargePatientOpen}
        onClose={() =>
          setDialogState((prev) => ({
            ...prev,
            isDischargePatientOpen: false,
            selectedHospitalization: null,
          }))
        }
        onSubmit={handleDischargePatient}
        form={dischargeForm}
        selectedHospitalization={dialogState.selectedHospitalization}
        isLoading={isLoading}
      />

      <HospitalizationViewDialog
        isOpen={dialogState.isViewHospitalizationOpen}
        onClose={() =>
          setDialogState((prev) => ({
            ...prev,
            isViewHospitalizationOpen: false,
            selectedHospitalization: null,
          }))
        }
        hospitalization={dialogState.selectedHospitalization}
      />
    </div>
  );
}
