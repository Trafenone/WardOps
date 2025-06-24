"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GenderType, PatientStatus } from "@/types/enums";
import { PatientFormValues } from "@/schemas/patient-schema";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface PatientFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patientData: PatientFormValues) => void;
  form: UseFormReturn<PatientFormValues>;
  isLoading: boolean;
  mode: "add" | "edit";
}

export function PatientFormDialog({
  isOpen,
  onClose,
  onSubmit,
  form,
  isLoading,
  mode,
}: PatientFormDialogProps) {
  const isEditMode = mode === "edit";

  const handleSubmit = (values: PatientFormValues) => {
    onSubmit(values);
  };

  const getTitle = () =>
    isEditMode ? "Редагування пацієнта" : "Реєстрація нового пацієнта";

  const getDescription = () =>
    isEditMode
      ? "Оновіть дані пацієнта"
      : "Введіть дані пацієнта для реєстрації в системі";

  const getSubmitButtonText = () => {
    if (isLoading) {
      return isEditMode ? "Оновлення..." : "Реєстрація...";
    }
    return isEditMode ? "Оновити" : "Зареєструвати";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4 py-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ім&apos;я</FormLabel>
                    <FormControl>
                      <Input placeholder="Введіть ім'я" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Прізвище</FormLabel>
                    <FormControl>
                      <Input placeholder="Введіть прізвище" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дата народження</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value
                            ? typeof field.value === "string"
                              ? field.value
                              : field.value instanceof Date
                                ? field.value.toISOString().slice(0, 10)
                                : ""
                            : ""
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Стать</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть стать" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={GenderType.Male}>Чоловік</SelectItem>
                        <SelectItem value={GenderType.Female}>Жінка</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+380..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medicalCardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Номер медкарти</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MC..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="admissionDiagnosis"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Діагноз при госпіталізації</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Введіть діагноз"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Статус</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={
                        !isEditMode ||
                        field.value === PatientStatus.Hospitalized
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть статус" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PatientStatus.Registered}>
                          Зареєстрований
                        </SelectItem>
                        <SelectItem
                          value={PatientStatus.Hospitalized}
                          disabled={field.value !== PatientStatus.Hospitalized}
                        >
                          Госпіталізований
                        </SelectItem>
                        <SelectItem
                          value={PatientStatus.Discharged}
                          disabled={field.value !== PatientStatus.Discharged}
                        >
                          Виписаний
                        </SelectItem>
                        <SelectItem value={PatientStatus.Inactive}>
                          Неактивний
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requiresIsolation"
                render={({ field }) => (
                  <FormItem className="col-span-2 flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Потребує ізоляції</FormLabel>
                      <FormDescription>
                        Позначте, якщо пацієнт потребує ізольованого розміщення
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Примітки</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Додаткова інформація..."
                        className="min-h-[100px]"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                disabled={isLoading}
              >
                Скасувати
              </Button>
              <Button type="submit" disabled={isLoading}>
                {getSubmitButtonText()}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
