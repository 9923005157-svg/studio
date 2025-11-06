"use client"

import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Header } from "@/components/layout/header"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { RoleProvider, useRole } from "@/hooks/use-role"
import { useUser } from "@/firebase"
import { redirect, usePathname } from "next/navigation"
import { useEffect } from "react"

const rolePaths: Record<string, string> = {
  Manufacturer: "/manufacturer",
  Distributor: "/distributor",
  Pharmacy: "/pharmacy",
  FDA: "/fda",
  Patient: "/patient",
};

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const { role, isRoleLoading } = useRole();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user) {
      redirect('/login');
    }
  }, [user, isUserLoading]);

  useEffect(() => {
    if (!isRoleLoading && role) {
      const expectedPath = rolePaths[role];
      // Allow access to /predict, otherwise enforce role path
      if (expectedPath && pathname !== expectedPath && pathname !== '/predict') {
        redirect(expectedPath);
      }
    }
  }, [role, isRoleLoading, pathname]);

  if (isUserLoading || isRoleLoading || !user || !role) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  const expectedPath = rolePaths[role];
  if (expectedPath && pathname !== expectedPath && pathname !== '/predict') {
      return (
        <div className="flex h-screen items-center justify-center">
          <p>Redirecting...</p>
        </div>
      );
  }

  return (
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
  );
}


export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <ProtectedLayout>{children}</ProtectedLayout>
    </RoleProvider>
  )
}
