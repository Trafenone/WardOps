import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Edit2, Trash2, Users } from "lucide-react";
import { Ward } from "@/types/models";
import { BedStatus, WardGenderPolicy } from "@/types/enums";
import { WardType } from "@/types/models";

interface WardCardProps {
  ward: Ward;
  wardType?: WardType;
  onEdit: (wardId: string) => void;
  onDelete: (wardId: string) => void;
}

export const WardCard: React.FC<WardCardProps> = ({
  ward,
  wardType,
  onEdit,
  onDelete,
}) => {
  const getGenderPolicyLabel = (policy: WardGenderPolicy) => {
    switch (policy) {
      case WardGenderPolicy.MaleOnly:
        return "Чоловіча";
      case WardGenderPolicy.FemaleOnly:
        return "Жіноча";
      case WardGenderPolicy.Mixed:
        return "Змішана";
      case WardGenderPolicy.Child:
        return "Дитяча";
      default:
        return policy;
    }
  };

  const getGenderPolicyBadge = (policy: WardGenderPolicy) => {
    const label = getGenderPolicyLabel(policy);
    switch (policy) {
      case WardGenderPolicy.MaleOnly:
        return <Badge className="bg-blue-100 text-blue-800">{label}</Badge>;
      case WardGenderPolicy.FemaleOnly:
        return <Badge className="bg-pink-100 text-pink-800">{label}</Badge>;
      case WardGenderPolicy.Mixed:
        return <Badge className="bg-green-100 text-green-800">{label}</Badge>;
      case WardGenderPolicy.Child:
        return <Badge className="bg-yellow-100 text-yellow-800">{label}</Badge>;
      default:
        return <Badge variant="outline">{label}</Badge>;
    }
  };

  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Палата {ward.wardNumber}</span>
          {getGenderPolicyBadge(ward.genderPolicy)}
          <Badge variant="outline">
            {wardType?.name || "Тип не визначено"}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="h-3 w-3" />
            Ємність: {ward.maxCapacity}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Зайнято:{" "}
            {ward.beds.filter((b) => b.status === BedStatus.Occupied).length}/
            {ward.maxCapacity}
          </div>
        </div>
        {ward.notes && (
          <p className="text-xs text-gray-500 mt-1">{ward.notes}</p>
        )}
      </div>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(ward.id)}
          title="Редагувати палату"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDelete(ward.id)}
          title="Видалити палату"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
