"use client";

import { useBedManagement } from "./hooks/useBedManagement";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BedResponse } from "@/types/dtos";
import { BedStatus } from "@/types/enums";
import { Bed, Building2, MapPin, Plus, Search, User } from "lucide-react";
import { BedStatusBadge } from "./components/BedStatusBadge";
import { BedStatusIcon } from "./components/BedStatusIcon";
import { BedStatsCards } from "./components/BedStatsCards";
import { BedFilters } from "./components/BedFilters";
import { BedForm } from "./components/BedForm";
import { AssignPatientForm } from "./components/AssignPatientForm";
import { DischargePatientForm } from "./components/DischargePatientForm";
import { BedActionsDropdown } from "./components/BedActionsDropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function BedManagement() {
  const {
    departments,
    wards,
    beds,
    // patients, // Assuming patients are fetched or available in the hook
    isLoading,
    dialogState,
    setDialogState,
    bedForm,
    createHospitalizationForm,
    dischargePatientForm,
    searchTerm,
    setSearchTerm,
    selectedDepartment,
    setSelectedDepartment,
    selectedStatus,
    setSelectedStatus,
    handleAddBed,
    handleEditBed,
    handleDeleteBed,
    handleAssignPatient,
    handleDischargePatient,
  } = useBedManagement();

  const staticPatients = [
    { id: "p1", name: "Іванов І.І." },
    { id: "p2", name: "Петров П.П." },
    { id: "p3", name: "Сидоров С.С." },
    { id: "p4", name: "Коваленко К.К." },
  ];

  const openAddBedDialog = () => {
    bedForm.reset({
      bedNumber: "",
      departmentId: "",
      wardId: "",
      status: BedStatus.Available,
      notes: "",
    });
    setDialogState((prev) => ({
      ...prev,
      isAddBedOpen: true,
      selectedBed: null,
    }));
  };

  const openEditBedDialog = (bed: BedResponse) => {
    bedForm.reset({
      bedNumber: bed.bedNumber,
      departmentId: bed.departmentId,
      wardId: bed.wardId,
      status: bed.status,
      notes: bed.notes || "",
    });
    setDialogState((prev) => ({
      ...prev,
      isEditBedOpen: true,
      selectedBed: bed,
    }));
  };

  const openAssignPatientDialog = (bed: BedResponse) => {
    createHospitalizationForm.reset({
      patientId: "",
      bedId: bed.id,
      admissionDateTime: new Date(),
      plannedDischargeDateTime: undefined,
      admissionReason: "",
    });
    setDialogState((prev) => ({
      ...prev,
      isAssignPatientOpen: true,
      selectedBed: bed,
    }));
  };

  const openDischargePatientDialog = (bed: BedResponse) => {
    dischargePatientForm.reset({
      dischargeReason: "",
      actualDischargeDateTime: new Date(),
    });
    setDialogState((prev) => ({
      ...prev,
      isDischargePatientOpen: true,
      selectedBed: bed,
    }));
  };

  useEffect(() => {
    if (dialogState.selectedBed && dialogState.isEditBedOpen) {
      bedForm.reset({
        bedNumber: dialogState.selectedBed.bedNumber,
        departmentId: dialogState.selectedBed.departmentId,
        wardId: dialogState.selectedBed.wardId,
        status: dialogState.selectedBed.status,
        notes: dialogState.selectedBed.notes || "",
      });
    }
  }, [
    dialogState.selectedBed,
    dialogState.isEditBedOpen,
    bedForm.reset,
    bedForm,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Управління ліжками</h2>
          <p className="text-gray-600">
            Додавання, редагування та контроль статусів ліжок
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Пошук ліжок..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Dialog
            open={dialogState.isAddBedOpen}
            onOpenChange={(isOpen) =>
              setDialogState((prev) => ({ ...prev, isAddBedOpen: isOpen }))
            }
          >
            <DialogTrigger asChild>
              <Button onClick={openAddBedDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Додати ліжко
              </Button>
            </DialogTrigger>
            <BedForm
              form={bedForm}
              onSubmit={handleAddBed}
              onCancel={() =>
                setDialogState((prev) => ({ ...prev, isAddBedOpen: false }))
              }
              departments={departments}
              wards={wards}
              isEditMode={false}
            />
          </Dialog>
        </div>
      </div>

      <BedStatsCards beds={beds} />
      <BedFilters
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        departments={departments}
      />

      <Card>
        <CardHeader>
          <CardTitle>
            Список ліжок ({beds.length})
            {isLoading && (
              <span className="ml-2 text-gray-400">(Завантаження...)</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер</TableHead>
                <TableHead>Відділення</TableHead>
                <TableHead>Палата</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Пацієнт</TableHead>
                <TableHead>Примітки</TableHead>
                <TableHead className="text-right">Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Завантаження...
                  </TableCell>
                </TableRow>
              ) : beds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Ліжок не знайдено.
                  </TableCell>
                </TableRow>
              ) : (
                beds.map((bed) => (
                  <TableRow key={bed.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4" />
                        <span className="ml-2">{bed.bedNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {bed.departmentName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Палата {bed.wardNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BedStatusIcon status={bed.status} />
                        <BedStatusBadge status={bed.status} />
                      </div>
                    </TableCell>
                    <TableCell>
                      {bed.patientName ? (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {bed.patientName}
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>{bed.notes || "-"}</TableCell>
                    <TableCell className="text-right">
                      <BedActionsDropdown
                        bed={bed}
                        onEdit={openEditBedDialog}
                        onAssignPatient={openAssignPatientDialog}
                        onDischargePatient={openDischargePatientDialog}
                        onDelete={handleDeleteBed}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={dialogState.isEditBedOpen}
        onOpenChange={(isOpen) =>
          setDialogState((prev) => ({ ...prev, isEditBedOpen: isOpen }))
        }
      >
        {dialogState.selectedBed && (
          <BedForm
            form={bedForm}
            onSubmit={handleEditBed}
            onCancel={() =>
              setDialogState((prev) => ({ ...prev, isEditBedOpen: false }))
            }
            departments={departments}
            wards={wards}
            isEditMode={true}
            initialBedNumber={dialogState.selectedBed.bedNumber}
          />
        )}
      </Dialog>

      <Dialog
        open={dialogState.isAssignPatientOpen}
        onOpenChange={(isOpen) =>
          setDialogState((prev) => ({ ...prev, isAssignPatientOpen: isOpen }))
        }
      >
        <AssignPatientForm
          form={createHospitalizationForm}
          onSubmit={handleAssignPatient}
          onCancel={() =>
            setDialogState((prev) => ({ ...prev, isAssignPatientOpen: false }))
          }
          selectedBed={dialogState.selectedBed}
          patients={staticPatients}
        />
      </Dialog>

      <Dialog
        open={dialogState.isDischargePatientOpen}
        onOpenChange={(isOpen) =>
          setDialogState((prev) => ({
            ...prev,
            isDischargePatientOpen: isOpen,
          }))
        }
      >
        <DischargePatientForm
          form={dischargePatientForm}
          onSubmit={handleDischargePatient}
          onCancel={() =>
            setDialogState((prev) => ({
              ...prev,
              isDischargePatientOpen: false,
            }))
          }
          selectedBed={dialogState.selectedBed}
        />
      </Dialog>

      {/* {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white" />
        </div>
      )} */}
    </div>
  );
}
