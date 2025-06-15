"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Bed,
  UserCheck,
  Building2,
  BarChart3,
} from "lucide-react";

const navigationItems = [
  {
    title: "Головна",
    items: [
      { title: "Дашборд", url: "/dashboard", icon: LayoutDashboard },
      { title: "Аналітика", url: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Адміністрування",
    items: [
      {
        title: "Структура лікарні",
        url: "/admin/hospital-structure",
        icon: Building2,
      },
      { title: "Управління ліжками", url: "/admin/beds", icon: Bed },
      { title: "Управління персоналом", url: "/admin/staff", icon: UserCheck },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-foreground">
            Адміністратор
          </h2>
          <p className="text-sm text-muted-foreground">Повний доступ</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          Ward Operation System
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
