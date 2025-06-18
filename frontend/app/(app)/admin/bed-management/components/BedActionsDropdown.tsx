import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BedResponse } from "@/types/dtos";
import { BedStatus } from "@/types/enums";
import { MoreHorizontal, Edit, UserPlus, LogOut, Trash2 } from "lucide-react";

interface BedActionsDropdownProps {
  bed: BedResponse;
  onEdit: (bed: BedResponse) => void;
  onAssignPatient: (bed: BedResponse) => void;
  onDischargePatient: (bed: BedResponse) => void;
  onDelete: (bed: BedResponse) => void;
}

export const BedActionsDropdown: React.FC<BedActionsDropdownProps> = ({
  bed,
  onEdit,
  onAssignPatient,
  onDischargePatient,
  onDelete,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Відкрити меню</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => onEdit(bed)}>
        <Edit className="mr-2 h-4 w-4" />
        Редагувати
      </DropdownMenuItem>
      {bed.status === BedStatus.Available && (
        <DropdownMenuItem onClick={() => onAssignPatient(bed)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Призначити пацієнта
        </DropdownMenuItem>
      )}
      {bed.status === BedStatus.Occupied && bed.patientName && (
        <DropdownMenuItem onClick={() => onDischargePatient(bed)}>
          <LogOut className="mr-2 h-4 w-4" />
          Виписати пацієнта
        </DropdownMenuItem>
      )}

      {bed.status === BedStatus.Available && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(bed)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Видалити
          </DropdownMenuItem>
        </>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);
