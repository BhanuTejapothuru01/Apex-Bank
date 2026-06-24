import { Customer, Employee, Branch, Transaction, Loan, CreditCard, AuditLog, Ticket, Task, FixedDeposit } from '../types/dashboard';

/** Offline fallbacks — live data comes from Supabase */
export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-802',
    name: 'Alistair Sterling',
    email: 'alistair@apexbank.com',
    phone: '+1 555 010 0001',
    balance: 2500000,
    riskProfile: 'Low',
    riskScore: 14,
    status: 'Active',
    verified: true,
    branchId: 'BR-HYD-01',
    kycStatus: 'Approved',
    type: 'VIP',
    joinDate: '2024-01-15',
  },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-045',
    name: 'Vikram Naidu',
    email: 'v.naidu@apexbank.com',
    role: 'Lead Security Architect',
    department: 'Cybersecurity',
    branchId: 'BR-NYC-01',
    status: 'Active',
    rating: 4.7,
    joinDate: '2020-11-01',
    performance: 94,
  },
];

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'BR-HYD-01',
    name: 'Hyderabad HQ',
    manager: 'Mohammed Rahman',
    location: 'Hyderabad, Telangana',
    totalDeposits: 420000000,
    activeAccounts: 18500,
    rating: 4.8,
    status: 'Operational',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-98219',
    customerId: 'CUST-802',
    customerName: 'Alistair Sterling',
    amount: 1500000,
    type: 'Transfer',
    category: 'Offshore Settlement',
    timestamp: '2026-06-11T08:12:00Z',
    status: 'Success',
    fraudRiskScore: 14,
    sourceBranchId: 'BR-HYD-01',
  },
];

export const INITIAL_LOANS: Loan[] = [
  {
    id: 'LOAN-1029',
    customerId: 'CUST-293',
    customerName: 'Marcus Vance',
    amount: 750000,
    purpose: 'Tech R&D Expansion',
    duration: 36,
    interestRate: 4.85,
    status: 'Approved',
    requestedDate: '2026-06-01',
    riskScore: 32,
  },
];

export const INITIAL_CARDS: CreditCard[] = [
  {
    id: 'CARD-4401',
    customerId: 'CUST-802',
    customerName: 'Alistair Sterling',
    cardNumber: '4001 8829 0192 4821',
    limit: 2000000,
    balance: 85200,
    status: 'Active',
    expiryDate: '2029-12',
  },
];

export const INITIAL_FD: FixedDeposit[] = [
  {
    id: 'FD-501',
    customerName: 'Alistair Sterling',
    amount: 5000000,
    interestRate: 5.25,
    durationMonths: 24,
    startDate: '2025-01-10',
    status: 'Active',
  },
];

export const INITIAL_AUDIT: AuditLog[] = [
  {
    id: 'LOG-5421',
    user: 'khanamsayeemakousar@gmail.com',
    action: 'System Session Initialized',
    ipAddress: '192.168.1.144',
    timestamp: '2026-06-11T08:35:10Z',
    severity: 'Info',
  },
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TKT-312',
    customerName: 'Marcus Vance',
    subject: 'Wire Transfer Limit Boost Review',
    status: 'In Progress',
    priority: 'High',
    date: '2026-06-11',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'TSK-01',
    title: 'Verify CUST-089 Pending documents',
    status: 'Pending',
    date: '2026-06-11',
    priority: 'High',
  },
];
