"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bed, Building2, History } from "lucide-react";
import type { User } from "@/types/models";
import { useAdminDashboard } from "@/app/(app)/dashboard/hooks/useAdminDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { uk } from "date-fns/locale";

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const { stats, isLoading, activities, isActivitiesLoading } =
    useAdminDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Дашборд Адміністратора
        </h1>
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
            {isLoading ? (
              <Skeleton className="h-7 w-1/2 mt-1" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.totalActivePatients}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Активних пацієнтів на даний момент
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Завантаженість ліжок
            </CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-1/2 mt-1" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.bedOccupancyPercentage}%
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-4 w-3/4 mt-1" />
              ) : (
                `${stats?.occupiedBeds} з ${stats?.totalBeds} зайнято`
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Відділення</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-1/2 mt-1" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.totalDepartments}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Загальна кількість відділень
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Профіль користувача</CardTitle>
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
                <div className="font-medium">Роль:</div>
                <div className="col-span-2">{user.role}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Остання активність</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isActivitiesLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Skeleton className="h-4 w-4 rounded-full mt-1" />
                    <div className="space-y-1 w-full">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))
              ) : activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <History className="h-4 w-4 mt-1 mr-3 flex-shrink-0 text-muted-foreground" />
                    <div className="text-sm">
                      <span className="font-medium">{activity.userName}</span>{" "}
                      {activity.description}
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                          locale: uk,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Немає останніх активностей.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
