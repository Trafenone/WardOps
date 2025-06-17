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
import { Textarea } from "@/components/ui/textarea";
import { DischargePatientFormValues } from "@/schemas/hospitalization-schema";
import { BedResponse } from "@/types/dtos";
import { UseFormReturn } from "react-hook-form";

interface DischargePatientFormProps {
  form: UseFormReturn<DischargePatientFormValues>;
  onSubmit: (data: DischargePatientFormValues) => void;
  onCancel: () => void;
  selectedBed: BedResponse | null;
}

export const DischargePatientForm: React.FC<DischargePatientFormProps> = ({
  form,
  onSubmit,
  onCancel,
  selectedBed,
}) => (
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Виписка пацієнта</DialogTitle>
      <DialogDescription>
        Виписати пацієнта {selectedBed?.patientName} з ліжка{" "}
        {selectedBed?.bedNumber}
      </DialogDescription>
    </DialogHeader>
    {selectedBed && (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="dischargeReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Причина виписки</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Вкажіть причину виписки..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="actualDischargeDateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дата та час виписки</FormLabel>
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Скасувати
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Виписка..." : "Виписати пацієнта"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    )}
  </DialogContent>
);
