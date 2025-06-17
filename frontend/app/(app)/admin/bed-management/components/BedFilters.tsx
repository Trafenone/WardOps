import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DepartmentWithWards } from "@/types/dtos";
import { BedStatus } from "@/types/enums";

interface BedFiltersProps {
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  departments: DepartmentWithWards[];
}

export const BedFilters: React.FC<BedFiltersProps> = ({
  selectedDepartment,
  onDepartmentChange,
  selectedStatus,
  onStatusChange,
  departments,
}) => (
  <div className="flex flex-wrap gap-4">
    <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
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

    <Select value={selectedStatus} onValueChange={onStatusChange}>
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
