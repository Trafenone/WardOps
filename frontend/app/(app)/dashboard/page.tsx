"use client";

import { useAuth } from "@/providers/authContext";
import AdminDashboard from "@/components/dashboards/admin-dashboard";
import StaffDashboard from "@/components/dashboards/staff-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { ADMIN, STAFF } from "@/types/constants";

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (user.role === ADMIN) {
    return <AdminDashboard user={user} />;
  }

  if (user.role === STAFF) {
    return <StaffDashboard user={user} />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Невідома роль</h1>
      <p>Дашборд для вашої ролі ще не налаштовано.</p>
    </div>
  );
}
