"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/authContext";
import { AppLayout } from "@/components/layout/app-layout";
import Dashboard from "./dashboard/page";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}
