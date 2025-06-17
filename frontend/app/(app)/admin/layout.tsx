"use client";

import { useEffect } from "react";
import { useAuth } from "@/providers/authContext";
import { useRouter } from "next/navigation";
import { LoadingPage } from "@/components/ui/loading-spiner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.role.includes("Admin")) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (!user) return null;

  if (!user.role.includes("Admin")) return <LoadingPage />;

  return <>{children}</>;
}
