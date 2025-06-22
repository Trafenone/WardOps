import { Badge } from "@/components/ui/badge";
import { BedStatus } from "@/types/enums";
import {
  AlertTriangle,
  BedIcon,
  Calendar,
  CheckCircle,
  Clock,
  Settings,
  User,
} from "lucide-react";

export const getStatusBadge = (status: BedStatus) => {
  switch (status) {
    case BedStatus.Available:
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Вільно
        </Badge>
      );
    case BedStatus.Occupied:
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          Зайнято
        </Badge>
      );
    case BedStatus.Cleaning:
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Прибирання
        </Badge>
      );
    case BedStatus.Maintenance:
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          Ремонт
        </Badge>
      );
    case BedStatus.Reserved:
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Зарезервовано
        </Badge>
      );
    case BedStatus.Unavailable:
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          Недоступно
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getStatusIcon = (status: BedStatus) => {
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
      return <BedIcon className="h-4 w-4" />;
  }
};

export const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return (
        <Badge variant="destructive" className="text-xs">
          Високий
        </Badge>
      );
    case "medium":
      return (
        <Badge variant="default" className="text-xs">
          Середній
        </Badge>
      );
    case "low":
      return (
        <Badge variant="secondary" className="text-xs">
          Низький
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-xs">
          Звичайний
        </Badge>
      );
  }
};
