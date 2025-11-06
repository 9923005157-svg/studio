"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Hexagon, LayoutDashboard, BrainCircuit } from "lucide-react"
import { useRole } from "@/hooks/use-role"

const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/predict",
    label: "Predictive Analytics",
    icon: BrainCircuit,
  },
]

const roleBasePaths: Record<string, string> = {
    Manufacturer: "/manufacturer",
    Distributor: "/distributor",
    Pharmacy: "/pharmacy",
    FDA: "/fda",
    Patient: "/patient",
}

export function SidebarNav() {
  const pathname = usePathname()
  const { role } = useRole()
  const dashboardPath = role ? roleBasePaths[role] || "/patient" : "/dashboard";

  const updatedMenuItems = menuItems.map(item => 
    item.href === "/dashboard" ? { ...item, href: dashboardPath } : item
  );

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Hexagon className="h-8 w-8 text-sidebar-primary" />
          <span className="font-headline text-lg font-semibold text-sidebar-foreground">
            PharmaTrust
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {updatedMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                    side: "right",
                  }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  )
}
