export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator" | "supervisor";
  avatar?: string;
}

export interface Recipient {
  id: string;
  nik: string;
  name: string;
  address: string;
  district: string;
  subsidyType: "pupuk" | "LPG" | "both";
  status: "active" | "inactive" | "suspended";
  remainingQuota: number;
  monthlyQuota: number;
  lastTransaction?: string;
  classification: "poor" | "middle" | "rich";
  income: number;
  familyMembers: number;
  landSize?: number;
  houseOwnership: "owned" | "rented" | "family";
  vehicleOwnership: string[];
  bankAccount: boolean;
  socialSecurityNumber?: string;
}

export interface Agent {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  status: "active" | "inactive";
  capacity: number;
  currentStock: number;
  district: string;
}

export interface Transaction {
  id: string;
  date: string;
  recipientNik: string;
  recipientName: string;
  product: "pupuk" | "LPG";
  quantity: number;
  agentName: string;
  status: "completed" | "pending" | "failed";
  amount: number;
}

export interface Complaint {
  id: string;
  date: string;
  reporterNik: string;
  reporterName: string;
  issue: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  assignedTo?: string;
  resolution?: string;
}

export interface QuotaManagement {
  id: string;
  recipientNik: string;
  recipientName: string;
  subsidyType: "pupuk" | "LPG";
  monthlyQuota: number;
  usedQuota: number;
  remainingQuota: number;
  lastReset: string;
}
