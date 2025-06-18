import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Patient } from "@/types/models";
import {
  User,
  Calendar,
  Phone,
  FileText,
  Stethoscope,
  AlertTriangle,
  Info,
  HeartPulse,
  VenusAndMars,
} from "lucide-react";
import { getPatientStatusBadge } from "@/components/common";
import { format } from "date-fns";

interface PatientViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="grid grid-cols-[24px_1fr_auto] items-start gap-4">
    <div className="text-muted-foreground mt-1">{icon}</div>
    <span className="font-medium text-muted-foreground">{label}</span>
    <div className="text-right">{value}</div>
  </div>
);

export default function PatientViewDialog({
  isOpen,
  onClose,
  patient,
}: PatientViewDialogProps) {
  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User /> {patient.fullName}
          </DialogTitle>
          <DialogDescription>
            Детальна інформація про пацієнта
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <DetailRow
            icon={<HeartPulse />}
            label="Статус"
            value={getPatientStatusBadge(patient.status)}
          />
          <DetailRow
            icon={<Calendar />}
            label="Дата народження"
            value={format(new Date(patient.dateOfBirth), "dd.MM.yyyy")}
          />
          <DetailRow
            icon={<VenusAndMars />}
            label="Стать"
            value={patient.gender === "Male" ? "Чоловіча" : "Жіноча"}
          />
          <DetailRow
            icon={<Phone />}
            label="Телефон"
            value={patient.phoneNumber}
          />
          <DetailRow
            icon={<FileText />}
            label="Мед. картка №"
            value={patient.medicalCardNumber}
          />
          <DetailRow
            icon={<Stethoscope />}
            label="Діагноз"
            value={patient.admissionDiagnosis}
          />
          <DetailRow
            icon={<AlertTriangle />}
            label="Потребує ізоляції"
            value={
              <Badge
                variant={
                  patient.requiresIsolation ? "destructive" : "secondary"
                }
              >
                {patient.requiresIsolation ? "Так" : "Ні"}
              </Badge>
            }
          />
          <DetailRow
            icon={<Info />}
            label="Примітки"
            value={patient.notes || "Немає"}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Закрити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
