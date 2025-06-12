"use client";

import { useAuth } from "@/providers/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bed, Building2 } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Дашборд</h1>
        <p className="text-muted-foreground">
          Огляд операційної діяльності лікарні
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Пацієнти</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">
              +12% у порівнянні з минулим місяцем
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Загрузка ліжок
            </CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-muted-foreground">
              -5% у порівнянні з минулим місяцем
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Відділення</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Загальна кількість відділень
            </p>
          </CardContent>
        </Card>
      </div>

      {user && (
        <Card className="p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              Вітаємо, {user.firstName}!
            </h2>
            <p className="text-muted-foreground">
              Ви увійшли як {user.position} з ролями: {user.roles.join(", ")}
            </p>
            <p>
              На цій сторінці ви можете бачити загальну статистику та основні
              показники роботи лікарні. Використовуйте бічну панель для
              навігації по різних розділах системи.
            </p>
          </div>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Профіль користувача</CardTitle>
          </CardHeader>
          <CardContent>
            {user && (
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
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Ролі:</div>
                  <div className="col-span-2">{user.roles.join(", ")}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Остання активність</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Тут буде відображатися історія останніх дій у системі.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
