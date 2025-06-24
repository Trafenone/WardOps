import { Badge } from "@/components/ui/badge";
import { BedStatus } from "@/types/enums";

interface BedStatusBadgeProps {
  status: BedStatus;
}

export const BedStatusBadge: React.FC<BedStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case BedStatus.Available:
      return <Badge className="bg-green-100 text-green-800">Вільно</Badge>;
    case BedStatus.Occupied:
      return <Badge className="bg-red-100 text-red-800">Зайнято</Badge>;
    case BedStatus.Cleaning:
      return (
        <Badge className="bg-yellow-100 text-yellow-800">Прибирання</Badge>
      );
    case BedStatus.Maintenance:
      return <Badge className="bg-gray-100 text-gray-800">Ремонт</Badge>;
    case BedStatus.Reserved:
      return <Badge className="bg-blue-100 text-blue-800">Зарезервовано</Badge>;
    case BedStatus.Unavailable:
      return (
        <Badge className="bg-purple-100 text-purple-800">Недоступно</Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
