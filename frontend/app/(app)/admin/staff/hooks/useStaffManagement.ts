import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

import { StaffService } from "@/services";
import { createStaffSchema, updateStaffSchema } from "@/schemas/staff-schema";
import { User } from "@/types/models";
import { CreateStaffRequest, UpdateStaffRequest } from "@/types/dtos";

interface DialogState {
  isAddStaffOpen: boolean;
  isEditStaffOpen: boolean;
  selectedStaff: string;
}

export function useStaffManagement() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [staffMembers, setStaffMembers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [dialogState, setDialogState] = useState<DialogState>({
    isAddStaffOpen: false,
    isEditStaffOpen: false,
    selectedStaff: "",
  });

  const createForm = useForm<z.infer<typeof createStaffSchema>>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      position: undefined,
      departmentId: undefined,
      password: "",
      confirmPassword: "",
      isActive: true,
    },
  });

  const updateForm = useForm<z.infer<typeof updateStaffSchema>>({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      position: undefined,
      departmentId: undefined,
      isActive: true,
    },
  });

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const staff = await StaffService.getAllStaff();
      setStaffMembers(staff);
      console.log("Staff members fetched successfully:", staffMembers);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      toast.error("Помилка при завантаженні персоналу");
      setStaffMembers([]);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddStaff = async (data: z.infer<typeof createStaffSchema>) => {
    setIsLoading(true);
    try {
      const request: CreateStaffRequest = {
        ...data,
      };

      await StaffService.createStaff(request);
      setDialogState((prev) => ({ ...prev, isAddStaffOpen: false }));
      toast.success("Співробітник успішно доданий");
      await fetchStaff();
    } catch (error) {
      console.error("Failed to add staff member:", error);
      toast.error("Помилка при додаванні співробітника");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStaff = async (data: z.infer<typeof updateStaffSchema>) => {
    if (!dialogState.selectedStaff) return;

    setIsLoading(true);
    try {
      const request: UpdateStaffRequest = {
        ...data,
      };

      await StaffService.updateStaff(dialogState.selectedStaff, request);
      setDialogState((prev) => ({ ...prev, isEditStaffOpen: false }));
      toast.success("Інформація про співробітника оновлена");
      await fetchStaff();
    } catch (error) {
      console.error("Failed to update staff member:", error);
      toast.error("Помилка при оновленні інформації про співробітника");
    } finally {
      setIsLoading(false);
    }
  };

  const filterStaff = () => {
    if (!staffMembers) {
      return [];
    }

    return staffMembers.filter((member) => {
      const searchMatch =
        member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.position &&
          member.position.toLowerCase().includes(searchTerm.toLowerCase()));

      const departmentMatch =
        selectedDepartment === "all" ||
        member.departmentId === selectedDepartment;

      return searchMatch && departmentMatch;
    });
  };

  return {
    staffMembers,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedDepartment,
    setSelectedDepartment,
    dialogState,
    setDialogState,
    createForm,
    updateForm,
    fetchStaff,
    filterStaff,
    handlers: {
      handleAddStaff,
      handleEditStaff,
    },
  };
}
