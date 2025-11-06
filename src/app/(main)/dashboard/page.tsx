'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useUser } from '@/firebase';
import { useRole } from '@/hooks/use-role';

const rolePaths = {
  Manufacturer: '/manufacturer',
  Distributor: '/distributor',
  Pharmacy: '/pharmacy',
  FDA: '/fda',
  Patient: '/patient',
};

export default function DashboardRedirectPage() {
  const { user, isUserLoading } = useUser();
  const { role, isRoleLoading } = useRole();

  useEffect(() => {
    if (!isUserLoading && !user) {
      redirect('/login');
    }
  }, [user, isUserLoading]);

  useEffect(() => {
    if (!isRoleLoading && role) {
      const path = rolePaths[role] || '/patient';
      redirect(path);
    }
  }, [role, isRoleLoading]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading your dashboard...</p>
    </div>
  );
}
