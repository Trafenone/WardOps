"use client";

import { useAuth } from "@/providers/authContext";
import { AdminSidebar } from "@/components/features/navigation/admin-sidebar";
import { StaffSidebar } from "@/components/features/navigation/staff-sidebar";

export function AppSidebar() {
  const { user } = useAuth();

  if (!user) return null;

  return user.roles.includes("Admin") ? <AdminSidebar /> : <StaffSidebar />;
}
