"use client";

import { useEffect } from "react";
import { useAuth } from "@/providers/authContext";
import { useRouter } from "next/navigation";
import { LoadingPage } from "@/components/ui/loading-spiner";
import { ADMIN } from "@/types/constants";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.role.includes(ADMIN)) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (!user) return null;

  if (!user.role.includes(ADMIN)) return <LoadingPage />;

  return <>{children}</>;
}
