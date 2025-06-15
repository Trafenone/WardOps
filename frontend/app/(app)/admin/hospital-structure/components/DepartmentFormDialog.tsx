import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { DepartmentFormValues } from "@/schemas/department-schema";
import React from "react";

interface Props {
  isOpen: boolean;
  isEdit: boolean;
  onClose: () => void;
  form: UseFormReturn<DepartmentFormValues>;
  onSubmit: (data: DepartmentFormValues) => void;
  isLoading: boolean;
}

export const DepartmentFormDialog: React.FC<Props> = ({
  isOpen,
  isEdit,
  onClose,
  form,
  onSubmit,
  isLoading,
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Редагування відділення" : "Створення нового відділення"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Змініть дані відділення"
            : "Введіть дані для нового відділення"}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Назва відділення</Label>
            <Input
              id="name"
              placeholder="Кардіологія"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="building">Корпус</Label>
              <Input
                id="building"
                placeholder="A"
                {...form.register("building")}
              />
              {form.formState.errors.building && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.building.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="floorNumber">Поверх</Label>
              <Input
                id="floorNumber"
                type="number"
                placeholder="1"
                {...form.register("floorNumber", { valueAsNumber: true })}
              />
              {form.formState.errors.floorNumber && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.floorNumber.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Опис</Label>
            <Textarea
              id="description"
              placeholder="Опис відділення..."
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Скасувати
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? isEdit
                ? "Збереження..."
                : "Створення..."
              : isEdit
                ? "Зберегти"
                : "Створити"}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);
