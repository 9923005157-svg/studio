"use client"

import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Header } from "@/components/layout/header"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { RoleProvider } from "@/hooks/use-role"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <SidebarInset>
          <div className="flex min-h-svh flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}
