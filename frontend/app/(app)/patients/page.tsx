"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bed, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PatientsPage() {
  const mockPatients = [
    {
      id: 1,
      name: "Іванов Василь Петрович",
      age: 42,
      gender: "Чоловіча",
      department: "Терапевтичне відділення",
      bed: "101-A",
      status: "active",
      admissionDate: "2023-05-15",
    },
    {
      id: 2,
      name: "Петров Петро Іванович",
      age: 56,
      gender: "Чоловіча",
      department: "Хірургічне відділення",
      bed: "201-B",
      status: "active",
      admissionDate: "2023-05-18",
    },
    {
      id: 3,
      name: "Сидорова Марія Олександрівна",
      age: 34,
      gender: "Жіноча",
      department: "Кардіологічне відділення",
      bed: "301-C",
      status: "active",
      admissionDate: "2023-05-10",
    },
    {
      id: 4,
      name: "Коваленко Ольга Миколаївна",
      age: 29,
      gender: "Жіноча",
      department: "Терапевтичне відділення",
      bed: null,
      status: "discharged",
      admissionDate: "2023-05-05",
      dischargeDate: "2023-05-12",
    },
    {
      id: 5,
      name: "Шевченко Андрій Володимирович",
      age: 61,
      gender: "Чоловіча",
      department: "Неврологічне відділення",
      bed: null,
      status: "discharged",
      admissionDate: "2023-05-03",
      dischargeDate: "2023-05-15",
    },
  ];

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "discharged":
        return "secondary";
      case "critical":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusUkr = (status: string) => {
    switch (status) {
      case "active":
        return "Госпіталізований";
      case "discharged":
        return "Виписаний";
      case "critical":
        return "Критичний стан";
      default:
        return status;
    }
  };

  const activePatients = mockPatients.filter(
    (patient) => patient.status === "active",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Пацієнти</h1>
          <p className="text-muted-foreground">Управління пацієнтами лікарні</p>
        </div>
        <Button>Додати пацієнта</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Загальна кількість пацієнтів
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPatients.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Госпіталізовані пацієнти
            </CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePatients}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((activePatients / mockPatients.length) * 100)}% від
              загальної кількості
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Середній час перебування
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2 дні</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Список пацієнтів</CardTitle>
            <div className="w-[200px]">
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Фільтр статусу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі пацієнти</SelectItem>
                  <SelectItem value="active">Госпіталізовані</SelectItem>
                  <SelectItem value="discharged">Виписані</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ПІБ</TableHead>
                <TableHead>Вік</TableHead>
                <TableHead>Стать</TableHead>
                <TableHead>Відділення</TableHead>
                <TableHead>Ліжко</TableHead>
                <TableHead>Дата поступлення</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.department}</TableCell>
                  <TableCell>{patient.bed || "-"}</TableCell>
                  <TableCell>{patient.admissionDate}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(patient.status)}>
                      {getStatusUkr(patient.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        Деталі
                      </Button>
                      <Button variant="ghost" size="sm">
                        Редагувати
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
