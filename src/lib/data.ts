import type { SupplyChainEvent, IotDataPoint, Alert, DrugInfo } from '@/lib/types';

export const drugInfo: DrugInfo = {
  name: 'CureAll-500mg',
  batchId: 'BATCH-XYZ-12345',
  expiryDate: '2026-10-31',
  status: 'In Transit to Pharmacy',
};

export const supplyChainData: SupplyChainEvent[] = [
  {
    id: 1,
    stage: 'Supplier',
    actor: 'Bulk Chemicals Inc.',
    timestamp: '2024-07-20T08:00:00Z',
    location: 'Shanghai, China',
    details: 'Raw materials shipped to manufacturer.',
  },
  {
    id: 2,
    stage: 'Manufacturing',
    actor: 'PharmaTrust Manufacturing',
    timestamp: '2024-07-22T14:30:00Z',
    location: 'Frankfurt, Germany',
    details: 'Drug manufactured. FDA approval requested.',
    fdaStatus: 'Approved',
  },
  {
    id: 3,
    stage: 'Repackaging',
    actor: 'PackRight Solutions',
    timestamp: '2024-07-23T10:00:00Z',
    location: 'Frankfurt, Germany',
    details: 'Drugs packaged for distribution.',
  },
  {
    id: 4,
    stage: 'Distribution',
    actor: 'Global Pharma Distributors',
    timestamp: '2024-07-24T05:00:00Z',
    location: 'JFK Airport, NY, USA',
    details: 'Shipment in transit to pharmacy network.',
  },
  {
    id: 5,
    stage: 'Pharmacy',
    actor: 'Your Local Pharmacy',
    timestamp: '2024-07-25T11:00:00Z',
    location: 'New York, NY, USA',
    details: 'Awaiting patient prescription.',
  },
];

export const iotData: IotDataPoint[] = [
  { time: '08:00', temperature: 4.5, humidity: 60, pressure: 1012 },
  { time: '09:00', temperature: 4.6, humidity: 61, pressure: 1012 },
  { time: '10:00', temperature: 4.8, humidity: 62, pressure: 1013 },
  { time: '11:00', temperature: 5.0, humidity: 62, pressure: 1013 },
  { time: '12:00', temperature: 9.2, humidity: 65, pressure: 1014 }, // Anomaly
  { time: '13:00', temperature: 5.1, humidity: 63, pressure: 1013 },
  { time: '14:00', temperature: 5.0, humidity: 62, pressure: 1012 },
];

export const alerts: Alert[] = [
  {
    id: 1,
    timestamp: '2024-07-24T12:05:00Z',
    description: 'Temperature spike to 9.2°C detected in container #C123. Recommended range: 2-8°C.',
    severity: 'High',
  },
  {
    id: 2,
    timestamp: '2024-07-24T09:15:00Z',
    description: 'Shipment stationary for 2 hours, longer than scheduled stop.',
    severity: 'Medium',
  },
  {
    id: 3,
    timestamp: '2024-07-22T15:00:00Z',
    description: 'FDA Approval for BATCH-XYZ-12345 received.',
    severity: 'Low',
  },
];


export const sampleIotDataForPrediction = JSON.stringify(
  [
    { "timestamp": "2024-07-24T08:00:00Z", "temperature": 4.5, "humidity": 60, "location": "JFK Airport, NY", "pressure": 1012 },
    { "timestamp": "2024-07-24T12:00:00Z", "temperature": 9.2, "humidity": 65, "location": "On I-95, CT", "pressure": 1014 },
    { "timestamp": "2024-07-24T14:00:00Z", "temperature": 5.0, "humidity": 62, "location": "Dist. Center, Boston", "pressure": 1012 }
  ], null, 2
);

export const sampleBlockchainDataForPrediction = JSON.stringify(
  [
    { "txId": "0xabc...", "timestamp": "2024-07-24T05:00:00Z", "batchId": "BATCH-XYZ-12345", "from": "PackRight Solutions", "to": "Global Pharma Distributors", "location": "Frankfurt, Germany", "role": "Distributor" },
    { "txId": "0xdef...", "timestamp": "2024-07-24T08:30:00Z", "batchId": "BATCH-XYZ-12345", "from": "Global Pharma Distributors", "to": "Your Local Pharmacy", "location": "JFK Airport, NY", "role": "Pharmacy" },
    { "txId": "0xghi...", "timestamp": "2024-07-24T18:00:00Z", "batchId": "BATCH-XYZ-12345", "from": "Unknown Entity", "to": "Your Local Pharmacy", "location": "Bridgeport, CT", "role": "Pharmacy" }
  ], null, 2
);
