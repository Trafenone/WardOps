"use client";

import { useAuth } from "@/providers/authContext";
import { AdminSidebar } from "@/components/navigation/admin-sidebar";
import { StaffSidebar } from "@/components/navigation/staff-sidebar";
import { ADMIN } from "@/types/constants";

export function AppSidebar() {
  const { user } = useAuth();

  if (!user) return null;

  return user.role == ADMIN ? <AdminSidebar /> : <StaffSidebar />;
}
