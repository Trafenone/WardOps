"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types/models";

interface StaffDashboardProps {
  user: User;
}

export default function StaffDashboard({ user }: StaffDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ваш Дашборд</h1>
        <p className="text-muted-foreground">
          Вітаємо у системі WardOps, {user.firstName}!
        </p>
      </div>

      <Card className="p-6 bg-secondary/50">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            Ваша поточна роль: {user.position}
          </h2>
          <p className="text-muted-foreground">
            Використовуйте бічну панель для навігації по системі та виконання
            ваших завдань.
          </p>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ваш профіль</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Повне ім&apos;я:</div>
              <div className="col-span-2">
                {user.firstName} {user.lastName}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Email:</div>
              <div className="col-span-2">{user.email}</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Посада:</div>
              <div className="col-span-2">{user.position}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
