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
import { CreateHospitalizationFormValues } from "@/schemas/hospitalization-schema";
import { BedResponse } from "@/types/dtos";
import { Patient } from "@/types/models";
import { UseFormReturn } from "react-hook-form";

interface AssignPatientFormProps {
  form: UseFormReturn<CreateHospitalizationFormValues>;
  onSubmit: (data: CreateHospitalizationFormValues) => void;
  onCancel: () => void;
  selectedBed: BedResponse | null;
  patients: Patient[];
}

export const AssignPatientForm: React.FC<AssignPatientFormProps> = ({
  form,
  onSubmit,
  onCancel,
  selectedBed,
  patients,
}) => {
  const filteredPatients = patients.filter((p) => p.status === "Registered");

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Призначення пацієнта</DialogTitle>
        <DialogDescription>
          Призначте пацієнта на ліжко {selectedBed?.bedNumber}
        </DialogDescription>
      </DialogHeader>
      {selectedBed && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пацієнт</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть пацієнта" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredPatients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.firstName + " " + patient.lastName}
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
              name="admissionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Причина госпіталізації</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Вкажіть причину госпіталізації..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="admissionDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата та час госпіталізації</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().substring(0, 16)
                          : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plannedDischargeDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Планова дата виписки (необов&apos;язково)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().substring(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Скасувати
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Призначення..."
                  : "Призначити пацієнта"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      )}
    </DialogContent>
  );
};
