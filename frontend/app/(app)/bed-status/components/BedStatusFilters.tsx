import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BedStatus } from "@/types/enums";
import { Department } from "@/types/models";

interface BedStatusFiltersProps {
  userRole: "Admin" | "Staff";
  departments: Department[];
  selectedDepartment: string;
  setSelectedDepartment: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
}

export function BedStatusFilters({
  userRole,
  departments,
  selectedDepartment,
  setSelectedDepartment,
  selectedStatus,
  setSelectedStatus,
}: BedStatusFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {userRole === "Admin" && (
        <Select
          value={selectedDepartment}
          onValueChange={setSelectedDepartment}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Відділення" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі відділення</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Статус" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Всі статуси</SelectItem>
          <SelectItem value={BedStatus.Available}>Вільно</SelectItem>
          <SelectItem value={BedStatus.Occupied}>Зайнято</SelectItem>
          <SelectItem value={BedStatus.Cleaning}>Прибирання</SelectItem>
          <SelectItem value={BedStatus.Maintenance}>Ремонт</SelectItem>
          <SelectItem value={BedStatus.Reserved}>Зарезервовано</SelectItem>
          <SelectItem value={BedStatus.Unavailable}>Недоступно</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
