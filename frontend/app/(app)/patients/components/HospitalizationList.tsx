"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Bed, Calendar, Clock } from "lucide-react";
import { Hospitalization } from "@/types/models";
import { HospitalizationStatus } from "@/types/enums";
import { formatDateTime } from "@/lib/utils";
import { getStatusBadge } from "@/components/common";

interface HospitalizationListProps {
  hospitalizations: Hospitalization[];
  onViewHospitalization: (hospitalization: Hospitalization) => void;
  onDischargePatient: (hospitalizationId: Hospitalization) => void;
}

export function HospitalizationList({
  hospitalizations,
  onViewHospitalization,
  onDischargePatient,
}: HospitalizationListProps) {
  const activeHospitalizations = hospitalizations.filter(
    (h) => h.status === HospitalizationStatus.Active,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Активні госпіталізації</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Пацієнт</TableHead>
              <TableHead>Ліжко</TableHead>
              <TableHead>Дата госпіталізації</TableHead>
              <TableHead>Планова виписка</TableHead>
              <TableHead>Причина госпіталізації</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeHospitalizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Госпіталізації відсутні
                </TableCell>
              </TableRow>
            ) : (
              activeHospitalizations.map((hospitalization) => (
                <TableRow key={hospitalization.id}>
                  <TableCell className="font-medium">
                    {hospitalization.patientFullName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      Ліжко {hospitalization.bedNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDateTime(hospitalization.admissionDateTime)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {hospitalization.plannedDischargeDateTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(
                          hospitalization.plannedDischargeDateTime,
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {hospitalization.admissionReason}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(hospitalization.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewHospitalization(hospitalization)}
                      >
                        Переглянути
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDischargePatient(hospitalization)}
                      >
                        Виписати
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
