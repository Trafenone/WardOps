"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/authContext";
import { LoadingPage } from "@/components/ui/loading-spiner";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return <LoadingPage />;
}
