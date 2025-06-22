"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Bed, User, AlertTriangle, CheckCircle } from "lucide-react";
import { useBed } from "../bed-status/hooks/useBed";
import { usePatient } from "../patients/hooks/usePatient";
import { HospitalizationService } from "@/services/hospitalizationService";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  CreateHospitalizationFormValues,
  createHospitalizationSchema,
} from "@/schemas/hospitalization-schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function QuickHospitalization() {
  const { patients, refetch: fetchPatients } = usePatient();
  const { beds, fetchBeds } = useBed();

  const form = useForm<CreateHospitalizationFormValues>({
    resolver: zodResolver(createHospitalizationSchema),
    defaultValues: {
      patientId: "",
      bedId: "",
      admissionDateTime: new Date(),
      admissionReason: "",
    },
  });

  const filteredPatients = patients.filter(
    (patient) => patient.status === "Registered",
  );

  const availableBeds = beds.filter((bed) => bed.status === "Available");

  const onSubmit = async (data: CreateHospitalizationFormValues) => {
    try {
      await HospitalizationService.createHospitalization(data);
      toast.success("Пацієнта успішно госпіталізовано");
      form.reset();
    } catch (error) {
      console.error("Error during hospitalization:", error);
      toast.error("Помилка при госпіталізації пацієнта");
    } finally {
      fetchPatients();
      fetchBeds();
    }
  };

  const selectedPatient =
    patients.find((p) => p.id === form.watch("patientId")) || null;
  const selectedBed = beds.find((b) => b.id === form.watch("bedId")) || null;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <UserPlus className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Швидка госпіталізація</h2>
            <p className="text-gray-600">
              Госпіталізація пацієнта на вільне ліжко
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Вибір пацієнта
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="existingPatient">Існуючий пацієнт</Label>
                <Select
                  value={form.watch("patientId")}
                  onValueChange={(val) => form.setValue("patientId", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть пацієнта" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPatients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        <div className="flex flex-col">
                          <span>{patient.fullName}</span>
                          <span className="text-xs text-gray-500">
                            {patient.medicalCardNumber} •{" "}
                            {new Date(patient.dateOfBirth).toLocaleDateString(
                              "uk-UA",
                            )}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.patientId && (
                  <span className="text-xs text-red-500">
                    {form.formState.errors.patientId.message}
                  </span>
                )}
              </div>

              {selectedPatient && (
                <div className="space-y-2">
                  <Label>Діагноз при госпіталізації</Label>
                  <div className="bg-gray-50 rounded p-3 text-sm text-gray-800 border">
                    {selectedPatient.admissionDiagnosis || "Діагноз не вказано"}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">
                      Потребує ізоляції:
                    </span>
                    {selectedPatient.requiresIsolation ? (
                      <span className="font-semibold">Так</span>
                    ) : (
                      <span className="font-semibold">Ні</span>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="admissionReason">Причина госпіталізації</Label>
                <Textarea
                  id="admissionReason"
                  placeholder="Детальний опис причини..."
                  {...form.register("admissionReason")}
                />
                {form.formState.errors.admissionReason && (
                  <span className="text-xs text-red-500">
                    {form.formState.errors.admissionReason.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="plannedDischarge">Планова дата виписки</Label>
                <Input
                  id="plannedDischarge"
                  type="date"
                  {...form.register("plannedDischargeDateTime", {
                    valueAsDate: true,
                  })}
                />
                {form.formState.errors.plannedDischargeDateTime && (
                  <span className="text-xs text-red-500">
                    {form.formState.errors.plannedDischargeDateTime.message}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bed className="h-5 w-5" />
                Вибір ліжка
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Доступні ліжка ({availableBeds.length})</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableBeds.map((bed) => (
                    <div
                      key={bed.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        form.watch("bedId") === bed.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => form.setValue("bedId", bed.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{bed.bedNumber}</span>
                        <Badge variant="outline">{bed.departmentName}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Палата {bed.wardNumber}
                      </div>
                    </div>
                  ))}
                </div>
                {form.formState.errors.bedId && (
                  <span className="text-xs text-red-500">
                    {form.formState.errors.bedId.message}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {selectedPatient ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Пацієнт обраний</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Оберіть пацієнта</span>
                  </div>
                )}

                {selectedBed ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Ліжко обране</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Оберіть ліжко</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => form.reset()}
                >
                  Скасувати
                </Button>
                <Button
                  type="submit"
                  disabled={!form.watch("patientId") || !form.watch("bedId")}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Госпіталізувати
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
