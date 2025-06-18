import { PositionType } from "@/types/enums";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns/format";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(dateTime: Date) {
  return new Date(dateTime).toLocaleString("uk-UA");
}

export function formatDateWithTime(dateTime: Date) {
  return format(new Date(dateTime), "dd.MM.yyyy HH:mm");
}

export function translatePositionType(positionType: PositionType): string {
  switch (positionType) {
    case PositionType.Doctor:
      return "Лікар";
    case PositionType.Nurse:
      return "Медсестра";
    case PositionType.HeadNurse:
      return "Старша медсестра";
    case PositionType.WardManager:
      return "Завідувач палати";
    case PositionType.Administrator:
      return "Адміністратор";
    case PositionType.Receptionist:
      return "Реєстратор";
    case PositionType.CleaningStaff:
      return "Прибиральник";
    case PositionType.MaintenanceStaff:
      return "Технічний персонал";
    case PositionType.PatientCoordinator:
      return "Координатор пацієнтів";
    case PositionType.DepartmentHead:
      return "Завідувач відділення";
    default:
      return "Невідома посада";
  }
}

export function translateBedStatus(status: string): string {
  switch (status) {
    case "Available":
      return "Вільно";
    case "Occupied":
      return "Зайнято";
    case "Cleaning":
      return "Прибирання";
    case "Maintenance":
      return "Ремонт";
    case "Reserved":
      return "Зарезервовано";
    case "Unavailable":
      return "Недоступно";
    default:
      return status;
  }
}
