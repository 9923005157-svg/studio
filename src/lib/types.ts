export type UserRole = "Manufacturer" | "Distributor" | "Pharmacy" | "FDA" | "Patient";

export type SupplyChainEvent = {
  id: number;
  stage: 'Supplier' | 'Manufacturing' | 'Repackaging' | 'Distribution' | 'Pharmacy' | 'Patient';
  actor: string;
  timestamp: string;
  location: string;
  details: string;
  fdaStatus?: 'Pending' | 'Approved' | 'Rejected';
};

export type IotDataPoint = {
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
};

export type Alert = {
  id: number;
  timestamp: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
};

export type DrugInfo = {
  name: string;
  batchId: string;
  expiryDate: string;
  status: string;
};

export type FdaApprovalItem = {
  id: string;
  drugName: string;
  drugDetails: string;
  storageTemperature: string;
  manufacturerId: string;
  manufacturerName: string;
  submissionDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

    