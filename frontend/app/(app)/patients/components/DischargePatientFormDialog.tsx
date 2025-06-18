import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { Hospitalization } from "@/types/models";
import { UseFormReturn } from "react-hook-form";

interface DischargePatientFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dischargePatientData: DischargePatientFormValues) => void;
  form: UseFormReturn<DischargePatientFormValues>;
  selectedHospitalization: Hospitalization;
  isLoading: boolean;
}

export default function DischargePatientFormDialog({
  isOpen,
  onClose,
  onSubmit,
  form,
  selectedHospitalization,
  isLoading,
}: DischargePatientFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Виписка пацієнта</DialogTitle>
          <DialogDescription>
            Виписати пацієнта {selectedHospitalization.patientFullName} з ліжка{" "}
            {selectedHospitalization.bedNumber}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
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
              <Button type="button" variant="outline" onClick={onClose}>
                Скасувати
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Виписка..." : "Виписати пацієнта"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
