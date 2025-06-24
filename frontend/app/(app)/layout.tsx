"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { LoadingPage } from "@/components/ui/loading-spiner";
import { useAuth } from "@/providers/authContext";

export default function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  return <AppLayout>{children}</AppLayout>;
}
