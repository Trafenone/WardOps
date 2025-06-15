import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DepartmentsService,
  HospitalStructureService,
  WardsService,
  WardTypesService,
} from "@/services";
import {
  departmentSchema,
  DepartmentFormValues,
} from "@/schemas/department-schema";
import { wardSchema, WardFormValues } from "@/schemas/ward-schema";
import { WardGenderPolicy } from "@/types/enums";
import { toast } from "sonner";
import { DepartmentWithWards } from "@/types/dtos";
import { WardType } from "@/types/models";

export const useDepartmentStructure = () => {
  const [wardTypes, setWardTypes] = useState<WardType[]>([]);
  const [departments, setDepartments] = useState<DepartmentWithWards[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogState, setDialogState] = useState({
    isAddDepartmentOpen: false,
    isEditDepartmentOpen: false,
    isAddWardOpen: false,
    isEditWardOpen: false,
    isConfirmDeleteOpen: false,
    selectedDepartment: "",
    selectedWard: "",
    deleteType: "department" as "department" | "ward",
    deleteItemId: "",
  });

  const departmentForm = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      building: "",
      floorNumber: undefined,
      description: "",
    },
  });

  const wardForm = useForm<WardFormValues>({
    resolver: zodResolver(wardSchema),
    defaultValues: {
      departmentId: "",
      wardNumber: "",
      wardTypeId: "",
      genderPolicy: WardGenderPolicy.Mixed,
      maxCapacity: 4,
      notes: "",
    },
  });

  const fetchData = async () => {
    try {
      const [wardTypesResponse, departmentsResponse] = await Promise.all([
        WardTypesService.getAllWardTypes(),
        HospitalStructureService.getHospitalStructure(),
      ]);
      setWardTypes(wardTypesResponse);
      setDepartments(departmentsResponse);
    } catch (e) {
      console.error("Failed to fetch data:", e);
      toast.error("Помилка: Не вдалося завантажити дані.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddDepartment = async (data: DepartmentFormValues) => {
    setIsLoading(true);
    try {
      await DepartmentsService.createDepartment({
        name: data.name,
        building: data.building || undefined,
        floorNumber: data.floorNumber ? Number(data.floorNumber) : undefined,
        description: data.description || undefined,
      });
      toast.success("Відділення створено");
      setDialogState((s) => ({ ...s, isAddDepartmentOpen: false }));
      departmentForm.reset();
      fetchData();
    } catch (e) {
      console.error("Failed to create department:", e);
      toast.error("Помилка створення відділення");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDepartment = async (data: DepartmentFormValues) => {
    setIsLoading(true);
    try {
      await DepartmentsService.updateDepartment(
        dialogState.selectedDepartment,
        {
          name: data.name,
          building: data.building || undefined,
          floorNumber: data.floorNumber ? Number(data.floorNumber) : undefined,
          description: data.description || undefined,
        },
      );
      toast.success("Відділення оновлено");
      setDialogState((s) => ({ ...s, isEditDepartmentOpen: false }));
      departmentForm.reset();
      fetchData();
    } catch (e) {
      console.error("Failed to update department:", e);
      toast.error("Помилка оновлення відділення");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    setIsLoading(true);
    try {
      await DepartmentsService.deleteDepartment(id);
      toast.success("Відділення видалено");
      setDialogState((s) => ({ ...s, isConfirmDeleteOpen: false }));
      fetchData();
    } catch (e) {
      console.error("Failed to delete department:", e);
      toast.error("Помилка видалення відділення");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWard = async (data: WardFormValues) => {
    setIsLoading(true);
    try {
      await WardsService.createWard({
        departmentId: data.departmentId,
        wardNumber: data.wardNumber,
        wardTypeId: data.wardTypeId,
        genderPolicy: data.genderPolicy,
        maxCapacity: Number(data.maxCapacity),
        notes: data.notes || undefined,
      });
      toast.success("Палата створена");
      setDialogState((s) => ({ ...s, isAddWardOpen: false }));
      wardForm.reset();
      fetchData();
    } catch (e) {
      console.error("Failed to create ward:", e);
      toast.error("Помилка створення палати");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditWard = async (data: WardFormValues) => {
    setIsLoading(true);
    try {
      await WardsService.updateWard(dialogState.selectedWard, {
        departmentId: data.departmentId,
        wardNumber: data.wardNumber,
        wardTypeId: data.wardTypeId,
        genderPolicy: data.genderPolicy,
        maxCapacity: Number(data.maxCapacity),
        notes: data.notes || undefined,
      });
      toast.success("Палата оновлена");
      setDialogState((s) => ({ ...s, isEditWardOpen: false }));
      wardForm.reset();
      fetchData();
    } catch (e) {
      console.error("Failed to update ward:", e);
      toast.error("Помилка оновлення палати");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWard = async (id: string) => {
    setIsLoading(true);
    try {
      await WardsService.deleteWard(id);
      toast.success("Палата видалена");
      setDialogState((s) => ({ ...s, isConfirmDeleteOpen: false }));
      fetchData();
    } catch (e) {
      console.error("Failed to delete ward:", e);
      toast.error("Помилка видалення палати");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    wardTypes,
    departments,
    isLoading,
    dialogState,
    setDialogState,
    departmentForm,
    wardForm,
    handlers: {
      handleAddDepartment,
      handleEditDepartment,
      handleDeleteDepartment,
      handleAddWard,
      handleEditWard,
      handleDeleteWard,
    },
  };
};
