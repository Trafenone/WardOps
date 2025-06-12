"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, Users } from "lucide-react";
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
import { useAuth } from "@/providers/authContext";

export default function BedsPage() {
  const { user } = useAuth();

  const mockBeds = [
    {
      id: 1,
      number: "101-A",
      department: "Терапевтичне відділення",
      status: "occupied",
      patient: "Іванов Іван",
      since: "2023-05-15",
    },
    {
      id: 2,
      number: "102-A",
      department: "Терапевтичне відділення",
      status: "free",
      patient: null,
      since: null,
    },
    {
      id: 3,
      number: "103-A",
      department: "Терапевтичне відділення",
      status: "maintenance",
      patient: null,
      since: null,
    },
    {
      id: 4,
      number: "201-B",
      department: "Хірургічне відділення",
      status: "occupied",
      patient: "Петров Петро",
      since: "2023-05-18",
    },
    {
      id: 5,
      number: "202-B",
      department: "Хірургічне відділення",
      status: "free",
      patient: null,
      since: null,
    },
    {
      id: 6,
      number: "301-C",
      department: "Кардіологічне відділення",
      status: "occupied",
      patient: "Сидорова Марія",
      since: "2023-05-10",
    },
  ];

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "occupied":
        return "destructive";
      case "free":
        return "success";
      case "maintenance":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getBedStatusUkr = (status: string) => {
    switch (status) {
      case "occupied":
        return "Зайнято";
      case "free":
        return "Вільно";
      case "maintenance":
        return "Обслуговування";
      default:
        return status;
    }
  };

  const isAdmin = user?.roles.includes("Admin");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Управління ліжками
          </h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Керування ліжковим фондом лікарні"
              : "Перегляд ліжкового фонду лікарні"}
          </p>
        </div>
        {isAdmin && <Button>Додати ліжко</Button>}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Загальна кількість ліжок
            </CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBeds.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Зайнято ліжок</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockBeds.filter((bed) => bed.status === "occupied").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (mockBeds.filter((bed) => bed.status === "occupied").length /
                  mockBeds.length) *
                  100,
              )}
              % зайнятості
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Вільно ліжок</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockBeds.filter((bed) => bed.status === "free").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (mockBeds.filter((bed) => bed.status === "free").length /
                  mockBeds.length) *
                  100,
              )}
              % доступності
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Список ліжок</CardTitle>
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
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер ліжка</TableHead>
                <TableHead>Відділення</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Пацієнт</TableHead>
                <TableHead>З дати</TableHead>
                <TableHead>Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBeds.map((bed) => (
                <TableRow key={bed.id}>
                  <TableCell className="font-medium">{bed.number}</TableCell>
                  <TableCell>{bed.department}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(bed.status)}>
                      {getBedStatusUkr(bed.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{bed.patient || "-"}</TableCell>
                  <TableCell>{bed.since || "-"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        Деталі
                      </Button>
                      {isAdmin && (
                        <Button variant="ghost" size="sm">
                          Редагувати
                        </Button>
                      )}
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
