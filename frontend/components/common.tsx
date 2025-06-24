import { Badge } from "@/components/ui/badge";
import { HospitalizationStatus, PatientStatus } from "@/types/enums";

export const getStatusBadge = (status: HospitalizationStatus) => {
  switch (status) {
    case HospitalizationStatus.Active:
      return <Badge className="bg-green-100 text-green-800">Активна</Badge>;
    case HospitalizationStatus.Discharged:
      return <Badge variant="secondary">Виписаний</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getPatientStatusBadge = (status: string) => {
  switch (status) {
    case PatientStatus.Registered:
      return <Badge className="bg-white text-black">Зареєстрований</Badge>;
    case PatientStatus.Hospitalized:
      return (
        <Badge className="bg-green-100 text-green-800">Госпіталізований</Badge>
      );
    case PatientStatus.Discharged:
      return <Badge className="bg-gray-100 text-gray-800">Виписаний</Badge>;
    case PatientStatus.Inactive:
      return <Badge className="bg-red-100 text-red-800">Неактивний</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
