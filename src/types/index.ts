export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'operator' | 'supervisor';
    avatar?: string;
}

export interface Agent {
    id: string;
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
    status: 'active' | 'inactive';
    capacity: number;
    currentStock: number;
    district: string;
}

export interface Complaint {
    id: string;
    date: string;
    reporterNik: string;
    reporterName: string;
    issue: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved';
    assignedTo?: string;
    resolution?: string;
}

export interface QuotaManagement {
    id: string;
    recipientNik: string;
    recipientName: string;
    subsidyType: 'pupuk' | 'LPG';
    monthlyQuota: number;
    usedQuota: number;
    remainingQuota: number;
    lastReset: string;
}

export interface Merchant {
    id: string;
    name: string;
    nik: string;
    ownerName: string;
    phone: string;
    district: string;
    address: string;
    lat: number | null;
    lng: number | null;
    maxCapacity: number | null;
    status: boolean;
    password: string;
    products: MerchantProduct[];
}

export interface MerchantProduct {
    productId: string;
    quantity: number;
}

export interface Product {
    id?: string;
    name: string;
    basePrice: number;
    subsidyPrice: number;
    price: number;
    unit: string;
    monthlyQuota: number;
    maxAdditionalQuota: number;
    needApproval: boolean;
}

export interface MerchantProduct {
    id: number;
    merchantId: string;
    productId: string;
    stock: number;
    minStock: number | null;
    updatedAt: string;
    product: Product;
}

export interface Subsidy {
    id: string;
    monthlyQuota: number;
    remainingQuota: number;
    usageQuota: number;
    product: {
        id: string;
        name: string;
    };
}

export interface Recipient {
    id: string;
    nik: string;
    name: string;
    phone: string;
    avatar: string | null;
    income: string;
    status: string;
    address: string;
    balance: string;
    district: string;
    landArea: number;
    createdAt: string;
    kjsNumber: string;
    updatedAt: string;
    merchantId?: string;
    homeOwnership: string;
    classification: string | null;
    familiyMembers: number;
    haveBankAccount: boolean | string;
    suspensionNotes: string | null;
    merchant?: Merchant | null;
    subsidies?: Subsidy[] | string[];
    transactions?: Transaction[]; 
    _count?: {
        transactions: number
    }
}

export interface MetadataProduct {
    id: string;
    name: string;
    unit: string;
    basePrice: number;
    subsidyPrice: number;
    price: number;
}

export interface Transaction {
    amount: number;
    id: number;
    number: string;
    date: string;
    metadataRecipient: Recipient;
    metadataProduct: MetadataProduct;
    status: string;
    qty: number;
    basePrice: number;
    price: number;
    totalAmount: number;
    paymentMethod: string;
    notes: string | null;
    product?: Product
    recipient?: Recipient
    merchant?: Merchant
}

export interface StockCard {
    id: number;
    merchantId: string;
    merchantProductId: number;
    type: 'IN' | 'OUT';
    qty: number;
    note: string;
    metadata: {
        recipientId: string;
        recipientName: string;
        transactionId: number;
        transactionNumber: string;
    } | null;
    createdAt: string;
    merchantProduct: {
        product: {
            name: string;
            unit: string;
        };
    };
}

export interface Merchant {
    id: string;
    code: string;
    name: string;
    nik: string;
    ownerName: string;
    phone: string;
    district: string;
    address: string;
    lat: number | null;
    lng: number | null;
    maxCapacity: number | null;
    status: boolean;
    balance: string;
    createdAt: string;
    updatedAt: string;
    products: MerchantProduct[];
    transactions: Transaction[];
    stockCards: StockCard[];
    _count: {
        transactions: number;
    };
}
