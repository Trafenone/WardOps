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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn, Controller } from "react-hook-form";
import { WardFormValues } from "@/schemas/ward-schema";
import { WardGenderPolicy } from "@/types/enums";
import { WardType } from "@/types/models";
import React from "react";

interface Props {
  isOpen: boolean;
  isEdit: boolean;
  onClose: () => void;
  form: UseFormReturn<WardFormValues>;
  wardTypes: WardType[];
  onSubmit: (data: WardFormValues) => void;
  isLoading: boolean;
}

export const WardFormDialog: React.FC<Props> = ({
  isOpen,
  isEdit,
  onClose,
  form,
  wardTypes,
  onSubmit,
  isLoading,
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Редагування палати" : "Створення нової палати"}
        </DialogTitle>
        <DialogDescription>
          {isEdit ? "Змініть дані палати" : "Додайте палату до відділення"}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="wardNumber">Номер палати</Label>
            <Input
              id="wardNumber"
              placeholder="201"
              {...form.register("wardNumber")}
            />
            {form.formState.errors.wardNumber && (
              <p className="text-sm text-red-500">
                {form.formState.errors.wardNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="wardTypeId">Тип палати</Label>
            <Controller
              name="wardTypeId"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть тип палати" />
                  </SelectTrigger>
                  <SelectContent>
                    {wardTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name} - {type.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.wardTypeId && (
              <p className="text-sm text-red-500">
                {form.formState.errors.wardTypeId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="genderPolicy">Гендерна політика</Label>
            <Controller
              name="genderPolicy"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть політику" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={WardGenderPolicy.Mixed}>
                      Змішана
                    </SelectItem>
                    <SelectItem value={WardGenderPolicy.MaleOnly}>
                      Чоловіча
                    </SelectItem>
                    <SelectItem value={WardGenderPolicy.FemaleOnly}>
                      Жіноча
                    </SelectItem>
                    <SelectItem value={WardGenderPolicy.Child}>
                      Дитяча
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.genderPolicy && (
              <p className="text-sm text-red-500">
                {form.formState.errors.genderPolicy.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxCapacity">Максимальна ємність</Label>
            <Input
              id="maxCapacity"
              type="number"
              placeholder="4"
              {...form.register("maxCapacity", { valueAsNumber: true })}
            />
            {form.formState.errors.maxCapacity && (
              <p className="text-sm text-red-500">
                {form.formState.errors.maxCapacity.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Примітки</Label>
            <Textarea
              id="notes"
              placeholder="Додаткова інформація..."
              {...form.register("notes")}
            />
            {form.formState.errors.notes && (
              <p className="text-sm text-red-500">
                {form.formState.errors.notes.message}
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
