"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Users, Building2 } from "lucide-react";
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

export default function StaffPage() {
  const mockStaff = [
    {
      id: 1,
      name: "Іванов Іван Іванович",
      position: "Лікар",
      department: "Терапевтичне відділення",
      email: "ivanov@hospital.com",
      phone: "+380991234567",
      status: "active",
    },
    {
      id: 2,
      name: "Петрова Ольга Петрівна",
      position: "Головна медсестра",
      department: "Хірургічне відділення",
      email: "petrova@hospital.com",
      phone: "+380992345678",
      status: "active",
    },
    {
      id: 3,
      name: "Сидоренко Михайло Федорович",
      position: "Лікар",
      department: "Кардіологічне відділення",
      email: "sydorenko@hospital.com",
      phone: "+380993456789",
      status: "active",
    },
    {
      id: 4,
      name: "Шевченко Наталія Ігорівна",
      position: "Медсестра",
      department: "Терапевтичне відділення",
      email: "shevchenko@hospital.com",
      phone: "+380994567890",
      status: "leave",
    },
    {
      id: 5,
      name: "Коваленко Андрій Валерійович",
      position: "Лікар",
      department: "Неврологічне відділення",
      email: "kovalenko@hospital.com",
      phone: "+380995678901",
      status: "active",
    },
  ];

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "leave":
        return "secondary";
      case "inactive":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusUkr = (status: string) => {
    switch (status) {
      case "active":
        return "Активний";
      case "leave":
        return "Відпустка";
      case "inactive":
        return "Неактивний";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Управління персоналом
          </h1>
          <p className="text-muted-foreground">
            Керування працівниками лікарні
          </p>
        </div>
        <Button>Додати працівника</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Загальна кількість персоналу
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStaff.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активний персонал
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStaff.filter((staff) => staff.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (mockStaff.filter((staff) => staff.status === "active").length /
                  mockStaff.length) *
                  100,
              )}
              % персоналу
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Кількість відділень
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(mockStaff.map((staff) => staff.department)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Список працівників</CardTitle>
            <div className="w-[200px]">
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Фільтр відділень" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі відділення</SelectItem>
                  <SelectItem value="терапевтичне">Терапевтичне</SelectItem>
                  <SelectItem value="хірургічне">Хірургічне</SelectItem>
                  <SelectItem value="кардіологічне">Кардіологічне</SelectItem>
                  <SelectItem value="неврологічне">Неврологічне</SelectItem>
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
                <TableHead>Посада</TableHead>
                <TableHead>Відділення</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>{staff.position}</TableCell>
                  <TableCell>{staff.department}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>{staff.phone}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(staff.status)}>
                      {getStatusUkr(staff.status)}
                    </Badge>
                  </TableCell>
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
