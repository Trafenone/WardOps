"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { BedResponse } from "@/types/dtos";
import { ChangeBedStatusFormDialog } from "./components/ChangeBedStatusFormDialog";
import { useForm } from "react-hook-form";
import {
  ChangeBedStatusFormValues,
  changeBedStatusSchema,
} from "@/schemas/bed-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDepartment } from "./hooks/useDepartment";
import { useBed } from "./hooks/useBed";
import { BedStatusStats } from "./components/BedStatusStats";
import { BedStatusFilters } from "./components/BedStatusFilters";
import { toast } from "sonner";
import { BedStatusList } from "./components/BedStatusList";

const userRole = "Staff";

export default function BedStatusManagement() {
  const { beds, isLoading, changeBedStatus } = useBed();
  const { departments } = useDepartment();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<BedResponse | null>(null);

  const form = useForm<ChangeBedStatusFormValues>({
    resolver: zodResolver(changeBedStatusSchema),
    defaultValues: {
      status: undefined,
      notes: "",
    },
  });

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

  const handleChangeStatus = (bed: BedResponse) => {
    setSelectedBed(bed);
    form.reset({
      status: bed.status,
      notes: bed.notes || "",
    });
    setIsChangeStatusOpen(true);
  };

  const handleStatusChange = async (data: ChangeBedStatusFormValues) => {
    try {
      await changeBedStatus(selectedBed!.id, data);
      setIsChangeStatusOpen(false);
      setSelectedBed(null);
      form.reset();
      toast.success("Статус ліжка успішно змінено");
    } catch (error) {
      console.error("Error changing bed status:", error);
      toast.error("Не вдалося змінити статус ліжка");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Управління статусами ліжок</h2>
          <p className="text-gray-600">
            Швидка зміна статусів ліжок для медичного персоналу
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Пошук ліжок..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <BedStatusStats filteredBeds={filteredBeds} />

      <BedStatusFilters
        departments={departments ?? []}
        userRole={userRole}
        setSelectedDepartment={setSelectedDepartment}
        selectedDepartment={selectedDepartment}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <BedStatusList
        filteredBeds={filteredBeds}
        handleChangeStatus={handleChangeStatus}
      />

      <ChangeBedStatusFormDialog
        isOpen={isChangeStatusOpen}
        onClose={() => {
          setIsChangeStatusOpen(false);
          setSelectedBed(null);
          form.reset();
        }}
        onSubmit={handleStatusChange}
        form={form}
        userRole={userRole}
        selectedBed={selectedBed}
        isLoading={isLoading}
      />
    </div>
  );
}
