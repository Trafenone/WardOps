"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DepartmentsPage() {
  const mockDepartments = [
    {
      id: 1,
      name: "Терапевтичне відділення",
      beds: 40,
      occupiedBeds: 32,
      staff: 15,
    },
    {
      id: 2,
      name: "Хірургічне відділення",
      beds: 30,
      occupiedBeds: 20,
      staff: 12,
    },
    {
      id: 3,
      name: "Кардіологічне відділення",
      beds: 25,
      occupiedBeds: 22,
      staff: 10,
    },
    {
      id: 4,
      name: "Неврологічне відділення",
      beds: 20,
      occupiedBeds: 15,
      staff: 8,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Структура лікарні
          </h1>
          <p className="text-muted-foreground">
            Управління відділеннями та структурою лікарні
          </p>
        </div>
        <Button>Додати відділення</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Загальна кількість відділень
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDepartments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Загальна кількість ліжок
            </CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDepartments.reduce((sum, dep) => sum + dep.beds, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Загальна кількість персоналу
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDepartments.reduce((sum, dep) => sum + dep.staff, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Відділення лікарні</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Назва відділення</TableHead>
                <TableHead>Кількість ліжок</TableHead>
                <TableHead>Зайнято ліжок</TableHead>
                <TableHead>Персонал</TableHead>
                <TableHead>Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDepartments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">
                    {department.name}
                  </TableCell>
                  <TableCell>{department.beds}</TableCell>
                  <TableCell>
                    {department.occupiedBeds} (
                    {Math.round(
                      (department.occupiedBeds / department.beds) * 100,
                    )}
                    %)
                  </TableCell>
                  <TableCell>{department.staff}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Редагувати
                    </Button>
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
