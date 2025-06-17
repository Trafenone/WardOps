import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { translateBedStatus } from "@/lib/utils";
import { BedFormValues } from "@/schemas/bed-schema";
import { DepartmentWithWards, WardWithBeds } from "@/types/dtos";
import { BedStatus } from "@/types/enums";
import { UseFormReturn } from "react-hook-form";

interface BedFormProps {
  form: UseFormReturn<BedFormValues>;
  onSubmit: (data: BedFormValues) => void;
  onCancel: () => void;
  departments: DepartmentWithWards[];
  wards: WardWithBeds[];
  isEditMode: boolean;
  initialBedNumber?: string;
}

export const BedForm: React.FC<BedFormProps> = ({
  form,
  onSubmit,
  onCancel,
  departments,
  wards,
  isEditMode,
  initialBedNumber,
}) => {
  const selectedDepartmentId = form.watch("departmentId");

  const filteredWards = selectedDepartmentId
    ? wards.filter((ward) => ward.departmentId === selectedDepartmentId)
    : [];

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {isEditMode ? "Редагування ліжка" : "Додавання нового ліжка"}
        </DialogTitle>
        {isEditMode && initialBedNumber && (
          <DialogDescription>
            Змініть дані ліжка {initialBedNumber}
          </DialogDescription>
        )}
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 py-4">
            <FormField
              control={form.control}
              name="bedNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер ліжка</FormLabel>
                  <FormControl>
                    <Input placeholder="Наприклад, 101-A" {...field} />
                  </FormControl>
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
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("wardId", ""); // Reset ward when department changes
                    }}
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
            <FormField
              control={form.control}
              name="wardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Палата</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={
                      !selectedDepartmentId || filteredWards.length === 0
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть палату" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredWards.map((ward) => (
                        <SelectItem key={ward.id} value={ward.id}>
                          {ward.wardNumber} ({ward.wardTypeName})
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть статус" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(BedStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {translateBedStatus(status)}
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
              name="notes"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Примітки</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Додаткова інформація..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Скасувати
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Збереження..."
                : isEditMode
                  ? "Зберегти зміни"
                  : "Додати ліжко"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
