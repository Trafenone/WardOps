import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PositionType } from "@/types/enums";
import { translatePositionType } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { updateStaffSchema } from "@/schemas/staff-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Department } from "@/types/models";

interface EditStaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<z.infer<typeof updateStaffSchema>>;
  departments: Department[];
  onSubmit: (values: z.infer<typeof updateStaffSchema>) => Promise<void>;
  isLoading: boolean;
}

export function EditStaffDialog({
  isOpen,
  onClose,
  form,
  departments,
  onSubmit,
  isLoading,
}: EditStaffDialogProps) {
  const positions = [
    PositionType.Doctor,
    PositionType.Nurse,
    PositionType.HeadNurse,
    PositionType.WardManager,
    PositionType.Administrator,
    PositionType.Receptionist,
    PositionType.CleaningStaff,
    PositionType.MaintenanceStaff,
    PositionType.PatientCoordinator,
    PositionType.DepartmentHead,
  ];

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Редагування співробітника</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            <div className="grid grid-cols-2 gap-4">
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
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Посада</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть посаду" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {positions.map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {translatePositionType(pos)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Відділення</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть відділення" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Статус активності
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          {field.value
                            ? "Співробітник є активним користувачем системи"
                            : "Співробітник не має доступу до системи"}
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={handleClose}
                disabled={isLoading}
              >
                Скасувати
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Зберігаю..." : "Зберегти зміни"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
