'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useUser } from '@/firebase';
import { useRole } from '@/hooks/use-role';
import { ManufacturerDashboard } from '@/components/dashboards/manufacturer-dashboard';
import { DistributorDashboard } from '@/components/dashboards/distributor-dashboard';
import { PharmacyDashboard } from '@/components/dashboards/pharmacy-dashboard';
import { FdaDashboard } from '@/components/dashboards/fda-dashboard';
import { PatientDashboard } from '@/components/dashboards/patient-dashboard';
import { DrugOverviewCard } from '@/components/dashboard/drug-overview-card';
import { TraceabilityTimeline } from '@/components/dashboard/traceability-timeline';
import { IotMonitor } from '@/components/dashboard/iot-monitor';
import { AlertFeed } from '@/components/dashboard/alert-feed';
import { drugInfo, supplyChainData, iotData, alerts } from '@/lib/data';

const roleDashboards = {
  Manufacturer: ManufacturerDashboard,
  Distributor: DistributorDashboard,
  Pharmacy: PharmacyDashboard,
  FDA: FdaDashboard,
  Patient: PatientDashboard,
};

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const { role, isRoleLoading } = useRole();

  useEffect(() => {
    if (!isUserLoading && !user) {
      redirect('/login');
    }
  }, [user, isUserLoading]);

  const isLoading = isUserLoading || isRoleLoading;

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const RoleDashboard = roleDashboards[role] || PatientDashboard;

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RoleDashboard />
          <DrugOverviewCard drugInfo={drugInfo} />
          <TraceabilityTimeline events={supplyChainData} />
        </div>
        <div className="space-y-6 lg:col-span-1">
          <IotMonitor iotData={iotData} />
          <AlertFeed alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
