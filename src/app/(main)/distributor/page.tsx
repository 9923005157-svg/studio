'use client';

import { DistributorDashboard } from '@/components/dashboards/distributor-dashboard';
import { DrugOverviewCard } from '@/components/dashboard/drug-overview-card';
import { TraceabilityTimeline } from '@/components/dashboard/traceability-timeline';
import { IotMonitor } from '@/components/dashboard/iot-monitor';
import { AlertFeed } from '@/components/dashboard/alert-feed';
import { drugInfo, supplyChainData, iotData, alerts } from '@/lib/data';
import { DistributorShipments } from '@/components/dashboard/distributor-shipments';

export default function DistributorPage() {
  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DistributorShipments />
          <DistributorDashboard />
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
