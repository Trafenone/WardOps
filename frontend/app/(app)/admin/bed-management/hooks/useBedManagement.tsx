import { useEffect, useState } from "react";
import {
  BedResponse,
  DepartmentWithWards,
  UpdateBedRequest,
  WardWithBeds,
} from "@/types/dtos";
import { BedFormValues, bedSchema } from "@/schemas/bed-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BedStatus } from "@/types/enums";
import { toast } from "sonner";
import { HospitalStructureService } from "@/services";
import { BedService } from "@/services/bedService";
import { HospitalizationService } from "@/services/hospitalizationService";
import {
  CreateHospitalizationFormValues,
  createHospitalizationSchema,
  DischargePatientFormValues,
  dischargePatientSchema,
} from "@/schemas/hospitalization-schema";

interface DialogState {
  isAddBedOpen: boolean;
  isEditBedOpen: boolean;
  isAssignPatientOpen: boolean;
  isDischargePatientOpen: boolean;
  isConfirmDeleteOpen: boolean;
  selectedBed: BedResponse | null;
}

export const useBedManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [departments, setDepartments] = useState<DepartmentWithWards[]>([]);
  const [wards, setWards] = useState<WardWithBeds[]>([]);
  const [beds, setBeds] = useState<BedResponse[]>([]);
  const [patients, setPatients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [dialogState, setDialogState] = useState<DialogState>({
    isAddBedOpen: false,
    isEditBedOpen: false,
    isAssignPatientOpen: false,
    isDischargePatientOpen: false,
    isConfirmDeleteOpen: false,
    selectedBed: null,
  });

  const bedForm = useForm<BedFormValues>({
    resolver: zodResolver(bedSchema),
    defaultValues: {
      bedNumber: "",
      departmentId: "",
      wardId: "",
      status: BedStatus.Available,
      notes: "",
    },
  });

  const createHospitalizationForm = useForm<CreateHospitalizationFormValues>({
    resolver: zodResolver(createHospitalizationSchema),
    defaultValues: {
      patientId: "",
      bedId: "",
      admissionDateTime: new Date(),
      plannedDischargeDateTime: undefined,
      admissionReason: "",
    },
  });

  const dischargePatientForm = useForm<DischargePatientFormValues>({
    resolver: zodResolver(dischargePatientSchema),
    defaultValues: {
      dischargeReason: "",
      actualDischargeDateTime: new Date(),
    },
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const departmentsData =
        await HospitalStructureService.getHospitalStructure();

      setDepartments(departmentsData);

      const allWards: WardWithBeds[] = [];
      const allBeds: BedResponse[] = [];

      departmentsData.forEach((department) => {
        department.wards.forEach((ward) => {
          allWards.push(ward);
          ward.beds.forEach((bed) => {
            allBeds.push(bed);
          });
        });
      });

      setWards(allWards);
      setBeds(allBeds);
    } catch (e) {
      console.error("Failed to fetch data:", e);
      toast.error("Помилка: Не вдалося завантажити дані.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBed = async (data: BedFormValues) => {
    setIsLoading(true);
    try {
      await BedService.createBed({
        bedNumber: data.bedNumber,
        departmentId: data.departmentId,
        wardId: data.wardId,
        status: data.status,
        notes: data.notes || undefined,
      });
      toast.success("Ліжко успішно додано");
      setDialogState((s) => ({ ...s, isAddBedOpen: false }));
      bedForm.reset();
      fetchData();
    } catch (e) {
      console.error("Failed to create department:", e);
      toast.error("Помилка створення ліжка");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBed = async (data: BedFormValues) => {
    if (!dialogState.selectedBed) return;

    setIsLoading(true);
    try {
      const request: UpdateBedRequest = {
        bedNumber: data.bedNumber,
        departmentId: data.departmentId,
        wardId: data.wardId,
        status: data.status,
        notes: data.notes || undefined,
      };

      await BedService.updateBed(dialogState.selectedBed.id, request);
      setDialogState((prev) => ({ ...prev, isEditBedOpen: false }));
      toast.success("Інформація про ліжко оновлено");
      await fetchData();
    } catch (e) {
      console.error("Failed to update staff member:", e);
      toast.error("Помилка при оновленні інформації про ліжко");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBed = async (id: string) => {
    setIsLoading(true);
    try {
      await BedService.deleteBed(id);
      toast.success("Ліжко видалене");
      setDialogState((s) => ({ ...s, isConfirmDeleteOpen: false }));
      fetchData();
    } catch (e) {
      console.error("Failed to delete ward:", e);
      toast.error("Помилка видалення ліжка");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignPatient = async (data: CreateHospitalizationFormValues) => {
    if (!dialogState.selectedBed) return;

    setIsLoading(true);
    try {
      await HospitalizationService.createHospitalization({
        patientId: data.patientId,
        bedId: dialogState.selectedBed.id,
        admissionDateTime: data.admissionDateTime,
        admissionReason: data.admissionReason,
        plannedDischargeDateTime: data.plannedDischargeDateTime,
      });
      setDialogState((prev) => ({ ...prev, isAssignPatientOpen: false }));
      toast.success("Пацієнт успішно призначений на ліжко");
      await fetchData();
    } catch (e) {
      console.error("Failed to assign patient to bed:", e);
      toast.error("Помилка при призначенні пацієнта на ліжко");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDischargePatient = async (data: DischargePatientFormValues) => {
    if (!dialogState.selectedBed) return;

    setIsLoading(true);
    try {
      await HospitalizationService.dischargePatientByPatientId(
        dialogState.selectedBed.id,
        {
          dischargeReason: data.dischargeReason,
          actualDischargeDateTime: data.actualDischargeDateTime,
        },
      );
      setDialogState((prev) => ({ ...prev, isAssignPatientOpen: false }));
      toast.success("Пацієнт успішно виписаний");
      await fetchData();
    } catch (e) {
      console.error("Failed to assign patient to bed:", e);
      toast.error("Помилка при виписці пацієнта");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBeds = beds.filter((bed) => {
    const searchMatch =
      bed.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bed.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bed.patientName &&
        bed.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (bed.notes && bed.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const departmentMatch =
      selectedDepartment === "all" || bed.departmentId === selectedDepartment;
    const statusMatch =
      selectedStatus === "all" || bed.status === selectedStatus;

    return searchMatch && departmentMatch && statusMatch;
  });

  return {
    departments,
    wards,
    beds: filteredBeds,
    patients,
    isLoading,
    dialogState,
    setDialogState,
    bedForm,
    createHospitalizationForm,
    dischargePatientForm,
    searchTerm,
    setSearchTerm,
    selectedDepartment,
    setSelectedDepartment,
    selectedStatus,
    setSelectedStatus,
    fetchData,
    handleAddBed,
    handleEditBed,
    handleDeleteBed,
    handleAssignPatient,
    handleDischargePatient,
  };
};
