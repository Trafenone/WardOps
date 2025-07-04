"use client";

import { getStatusBadge } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import { HospitalizationStatus } from "@/types/enums";
import { Hospitalization } from "@/types/models";

export interface DischaregeListProps {
  hospitalizations: Hospitalization[];
}

export default function DischargeList({
  hospitalizations,
}: DischaregeListProps) {
  const dischargedHospitalizations = hospitalizations.filter(
    (h) => h.status === HospitalizationStatus.Discharged,
  );

  const calculateTreatmentDuration = (hospitalizations: Hospitalization) => {
    const admissionDate = new Date(hospitalizations.admissionDateTime);
    const dischargeDate = new Date(hospitalizations.actualDischargeDateTime!);
    const duration = Math.ceil(
      (dischargeDate.getTime() - admissionDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    return duration > 0 ? `${duration} днів` : "0 днів";
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Історія виписок</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Пацієнт</TableHead>
                <TableHead>Дата виписки</TableHead>
                <TableHead>Тривалість лікування</TableHead>
                <TableHead>Причина виписки</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dischargedHospitalizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Виписки відсутні
                  </TableCell>
                </TableRow>
              ) : (
                dischargedHospitalizations.map((hospitalization) => (
                  <TableRow key={hospitalization.id}>
                    <TableCell className="font-medium">
                      {hospitalization.patientFullName}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(hospitalization.actualDischargeDateTime!)}
                    </TableCell>
                    <TableCell>
                      {calculateTreatmentDuration(hospitalization)}
                    </TableCell>
                    <TableCell>{hospitalization.dischargeReason}</TableCell>
                    <TableCell>
                      {getStatusBadge(hospitalization.status)}
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
