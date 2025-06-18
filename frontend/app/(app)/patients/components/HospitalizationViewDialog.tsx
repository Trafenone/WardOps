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
import { Hospitalization } from "@/types/models";
import {
  User,
  Bed,
  CalendarCheck,
  LogIn,
  LogOut,
  Activity,
  ClipboardList,
} from "lucide-react";
import { formatDateWithTime } from "@/lib/utils";

interface HospitalizationViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalization: Hospitalization | null;
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

export default function HospitalizationViewDialog({
  isOpen,
  onClose,
  hospitalization,
}: HospitalizationViewDialogProps) {
  if (!hospitalization) return null;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Discharged":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList /> Госпіталізація
          </DialogTitle>
          <DialogDescription>
            Детальна інформація про госпіталізацію
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <DetailRow
            icon={<User />}
            label="Пацієнт"
            value={hospitalization.patientFullName}
          />
          <DetailRow
            icon={<Activity />}
            label="Статус"
            value={
              <Badge variant={getStatusVariant(hospitalization.status)}>
                {hospitalization.status}
              </Badge>
            }
          />
          <DetailRow
            icon={<Bed />}
            label="Ліжко"
            value={hospitalization.bedId}
          />
          <DetailRow
            icon={<LogIn />}
            label="Дата госпіталізації"
            value={formatDateWithTime(hospitalization.admissionDateTime)}
          />
          {hospitalization.plannedDischargeDateTime && (
            <DetailRow
              icon={<CalendarCheck />}
              label="Планова дата виписки"
              value={formatDateWithTime(
                hospitalization.plannedDischargeDateTime,
              )}
            />
          )}
          {hospitalization.actualDischargeDateTime && (
            <DetailRow
              icon={<LogOut />}
              label="Фактична дата виписки"
              value={formatDateWithTime(
                hospitalization.actualDischargeDateTime,
              )}
            />
          )}
          <DetailRow
            icon={<ClipboardList />}
            label="Причина"
            value={hospitalization.admissionReason}
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
