"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
// import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserMenu } from "@/components/features/navigation/user-menu";
import { Hospital } from "lucide-react";

// TODO: Uncomment when ThemeToggle is implemented

export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-card px-4 theme-transition">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex items-center gap-2">
        <Hospital className="h-6 w-6 text-primary" />
        <h1 className="font-semibold text-foreground">Ward Operation System</h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {/* <ThemeToggle /> */}
        <UserMenu />
      </div>
    </header>
  );
}
