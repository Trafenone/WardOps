"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useDepartmentStructure } from "./hooks/useHospitalStructure";
import { DepartmentFormDialog } from "./components/DepartmentFormDialog";
import { WardFormDialog } from "./components/WardFormDialog";
import { ConfirmDeleteDialog } from "./components/ConfirmDeleteDialog";
import { DepartmentCard } from "./components/DepartmentCard";

export default function HospitalStructure() {
  const {
    wardTypes,
    departments,
    isLoading,
    dialogState,
    setDialogState,
    departmentForm,
    wardForm,
    handlers,
  } = useDepartmentStructure();

  const handleOpenAddDepartment = () => {
    departmentForm.reset();
    setDialogState((s) => ({ ...s, isAddDepartmentOpen: true }));
  };

  const handleOpenEditDepartment = (departmentId: string) => {
    const department = departments.find((d) => d.id === departmentId);
    if (department) {
      departmentForm.setValue("name", department.name);
      departmentForm.setValue("building", department.building || "");
      departmentForm.setValue("floorNumber", department.floorNumber);
      departmentForm.setValue("description", department.description || "");
      setDialogState((s) => ({
        ...s,
        isEditDepartmentOpen: true,
        selectedDepartment: departmentId,
      }));
    }
  };

  const handleOpenDeleteDepartment = (departmentId: string) => {
    setDialogState((s) => ({
      ...s,
      isConfirmDeleteOpen: true,
      deleteType: "department",
      deleteItemId: departmentId,
    }));
  };

  const handleOpenAddWard = (departmentId: string) => {
    wardForm.reset();
    wardForm.setValue("departmentId", departmentId);
    setDialogState((s) => ({
      ...s,
      isAddWardOpen: true,
      selectedDepartment: departmentId,
    }));
  };

  const handleOpenEditWard = (wardId: string) => {
    for (const dept of departments) {
      const ward = dept.wards.find((w) => w.id === wardId);
      if (ward) {
        wardForm.setValue("departmentId", ward.departmentId);
        wardForm.setValue("wardNumber", ward.wardNumber);
        wardForm.setValue("wardTypeId", ward.wardTypeId);
        wardForm.setValue("genderPolicy", ward.genderPolicy);
        wardForm.setValue("maxCapacity", ward.maxCapacity);
        wardForm.setValue("notes", ward.notes || "");
        setDialogState((s) => ({
          ...s,
          isEditWardOpen: true,
          selectedWard: wardId,
        }));
        break;
      }
    }
  };

  const handleOpenDeleteWard = (wardId: string) => {
    setDialogState((s) => ({
      ...s,
      isConfirmDeleteOpen: true,
      deleteType: "ward",
      deleteItemId: wardId,
    }));
  };

  const handleConfirmDelete = () => {
    if (dialogState.deleteType === "department") {
      handlers.handleDeleteDepartment(dialogState.deleteItemId);
    } else {
      handlers.handleDeleteWard(dialogState.deleteItemId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Структура лікарні</h2>
          <p className="text-gray-600">
            Управління відділеннями, палатами та ліжками
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={handleOpenAddDepartment}>
                <Plus className="h-4 w-4 mr-2" />
                Додати відділення
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {departments.map((department) => (
          <DepartmentCard
            key={department.id}
            department={department}
            wardTypes={wardTypes}
            onEditDepartment={handleOpenEditDepartment}
            onDeleteDepartment={handleOpenDeleteDepartment}
            onAddWard={handleOpenAddWard}
            onEditWard={handleOpenEditWard}
            onDeleteWard={handleOpenDeleteWard}
          />
        ))}
      </div>

      {/* Department Form Dialogs */}
      <DepartmentFormDialog
        isOpen={dialogState.isAddDepartmentOpen}
        isEdit={false}
        onClose={() =>
          setDialogState((s) => ({ ...s, isAddDepartmentOpen: false }))
        }
        form={departmentForm}
        onSubmit={handlers.handleAddDepartment}
        isLoading={isLoading}
      />

      <DepartmentFormDialog
        isOpen={dialogState.isEditDepartmentOpen}
        isEdit={true}
        onClose={() =>
          setDialogState((s) => ({ ...s, isEditDepartmentOpen: false }))
        }
        form={departmentForm}
        onSubmit={handlers.handleEditDepartment}
        isLoading={isLoading}
      />

      {/* Ward Form Dialogs */}
      <WardFormDialog
        isOpen={dialogState.isAddWardOpen}
        isEdit={false}
        onClose={() => setDialogState((s) => ({ ...s, isAddWardOpen: false }))}
        form={wardForm}
        wardTypes={wardTypes}
        onSubmit={handlers.handleAddWard}
        isLoading={isLoading}
      />

      <WardFormDialog
        isOpen={dialogState.isEditWardOpen}
        isEdit={true}
        onClose={() => setDialogState((s) => ({ ...s, isEditWardOpen: false }))}
        form={wardForm}
        wardTypes={wardTypes}
        onSubmit={handlers.handleEditWard}
        isLoading={isLoading}
      />

      {/* Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={dialogState.isConfirmDeleteOpen}
        onClose={() =>
          setDialogState((s) => ({ ...s, isConfirmDeleteOpen: false }))
        }
        onConfirm={handleConfirmDelete}
        type={dialogState.deleteType}
        isLoading={isLoading}
      />
    </div>
  );
}
