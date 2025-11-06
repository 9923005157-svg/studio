"use client";

import React, { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react';
import type { UserRole } from '@/lib/types';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

type RoleContextType = {
  role: UserRole | null;
  isRoleLoading: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const { user, isUserLoading: isUserAuthLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  
  const { data: userData, isLoading: isUserDocLoading } = useDoc<{role: UserRole}>(userDocRef);

  useEffect(() => {
    if (userData && userData.role) {
      setRole(userData.role);
    } else if (!isUserDocLoading && !userData) {
      // If doc doesn't exist and we are not loading, there's no role.
      setRole(null);
    }
  }, [userData, isUserDocLoading]);

  const isRoleLoading = isUserAuthLoading || isUserDocLoading;

  const value = useMemo(() => ({ role, isRoleLoading }), [role, isRoleLoading]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
