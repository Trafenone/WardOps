"use client";

import { getPatientStatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PatientStatus } from "@/types/enums";
import { Patient } from "@/types/models";
import {
  AlertTriangle,
  BookOpen,
  Edit,
  MoreHorizontal,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";

interface PatientListProps {
  patients: Patient[];
  searchTerm: string;
  onViewPatient: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (patient: Patient) => void;
}

export default function PatientList({
  patients,
  searchTerm,
  onViewPatient,
  onEditPatient,
}: PatientListProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredPatients = patients.filter((patient) => {
    const searchMatch =
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.medicalCardNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const statusMatch =
      patient.status === selectedStatus || selectedStatus === "all";

    return searchMatch && statusMatch;
  });

  const getGenderLabel = (gender: string) =>
    gender === "Male" ? "Чоловік" : "Жінка";

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <>
      <div className="flex flex-wrap">
        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Статус Пацієнта" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі статуси</SelectItem>
            <SelectItem value={PatientStatus.Registered}>
              Зареєстрований
            </SelectItem>
            <SelectItem value={PatientStatus.Hospitalized}>
              Госпіталізовиний
            </SelectItem>
            <SelectItem value={PatientStatus.Discharged}>Виписаний</SelectItem>
            <SelectItem value={PatientStatus.Inactive}>Неактивний</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Список пацієнтів</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ПІБ</TableHead>
                <TableHead>Вік</TableHead>
                <TableHead>Стать</TableHead>
                <TableHead>Медкарта</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Діагноз</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length == 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Пацієнтів не знайдено
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {patient.firstName} {patient.lastName}
                        {patient.requiresIsolation && (
                          <span title="Потребує ізоляції">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {calculateAge(patient.dateOfBirth)} років
                    </TableCell>
                    <TableCell>{getGenderLabel(patient.gender)}</TableCell>
                    <TableCell>{patient.medicalCardNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {patient.phoneNumber}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {patient.admissionDiagnosis}
                    </TableCell>
                    <TableCell>
                      {getPatientStatusBadge(patient.status)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Відкрити меню</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onViewPatient(patient)}
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Переглянути
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEditPatient(patient)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Редагувати
                          </DropdownMenuItem>
                          {/* {patient.status === PatientStatus.Inactive && (
                            <DropdownMenuItem
                              onClick={() => onDeletePatient(patient)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Видалити
                            </DropdownMenuItem>
                          )} */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
