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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Settings,
} from "lucide-react";
import { getStatusBadge } from "./common";
import { BedResponse } from "@/types/dtos";
import { BedStatus } from "@/types/enums";
import { UseFormReturn } from "react-hook-form";
import { ChangeBedStatusFormValues } from "@/schemas/bed-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { ADMIN } from "@/types/constants";

interface ChangeBedStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChangeBedStatusFormValues) => void;
  form: UseFormReturn<ChangeBedStatusFormValues>;
  userRole: "Admin" | "Staff";
  selectedBed: BedResponse | null;
  isLoading: boolean;
}

export function ChangeBedStatusFormDialog({
  isOpen,
  onClose,
  onSubmit,
  form,
  userRole,
  selectedBed,
  isLoading,
}: ChangeBedStatusDialogProps) {
  if (!selectedBed) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Зміна статусу ліжка</DialogTitle>
          <DialogDescription>
            Змініть статус ліжка {selectedBed?.bedNumber} в палаті{" "}
            {selectedBed?.wardNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Поточний статус:</span>
            {getStatusBadge(selectedBed.status)}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Новий статус</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Оберіть статус" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={BedStatus.Available}>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              Вільно
                            </div>
                          </SelectItem>
                          <SelectItem value={BedStatus.Cleaning}>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-yellow-600" />
                              Прибирання
                            </div>
                          </SelectItem>
                          <SelectItem value={BedStatus.Maintenance}>
                            <div className="flex items-center gap-2">
                              <Settings className="h-4 w-4 text-gray-600" />
                              Ремонт
                            </div>
                          </SelectItem>
                          <SelectItem value={BedStatus.Reserved}>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              Зарезервовано
                            </div>
                          </SelectItem>
                          {userRole === ADMIN && (
                            <SelectItem value={BedStatus.Unavailable}>
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-purple-600" />
                                Недоступно
                              </div>
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-2 space-y-2">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="statusNotes">
                        Примітка до ліжка
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Вкажіть примітку до ліжка"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Скасувати
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Змінити статус
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
