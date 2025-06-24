import { BedStatus } from "@/types/enums";
import {
  AlertTriangle,
  Bed,
  Calendar,
  CheckCircle,
  Clock,
  Settings,
  User,
} from "lucide-react";

interface BedStatusIconProps {
  status: BedStatus;
}

export const BedStatusIcon: React.FC<BedStatusIconProps> = ({ status }) => {
  switch (status) {
    case BedStatus.Available:
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case BedStatus.Occupied:
      return <User className="h-4 w-4 text-red-600" />;
    case BedStatus.Cleaning:
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case BedStatus.Maintenance:
      return <Settings className="h-4 w-4 text-gray-600" />;
    case BedStatus.Reserved:
      return <Calendar className="h-4 w-4 text-blue-600" />;
    case BedStatus.Unavailable:
      return <AlertTriangle className="h-4 w-4 text-purple-600" />;
    default:
      return <Bed className="h-4 w-4" />;
  }
};
