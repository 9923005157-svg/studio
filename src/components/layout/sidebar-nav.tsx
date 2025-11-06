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

export function SidebarNav() {
  const pathname = usePathname()

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
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                    side: "right",
                  }}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  )
}
