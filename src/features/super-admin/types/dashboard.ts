export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  riskProfile: 'Low' | 'Medium' | 'High' | 'Critical';
  riskScore: number;
  status: 'Active' | 'Frozen' | 'Suspended';
  verified: boolean;
  branchId: string;
  kycStatus: 'Approved' | 'Pending' | 'Rejected';
  type: 'VIP' | 'Retail' | 'Corporate';
  joinDate: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  branchId: string;
  status: 'Active' | 'Inactive';
  rating: number; // 0-5
  joinDate: string;
  performance: number; // 0-100
}

export interface Branch {
  id: string;
  name: string;
  manager: string;
  location: string;
  totalDeposits: number;
  activeAccounts: number;
  rating: number; // 0-5
  status: 'Operational' | 'Maintenance';
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  type: 'Deposit' | 'Withdrawal' | 'Transfer' | 'Loan Disbursal' | 'Card Payment';
  category: string;
  timestamp: string;
  status: 'Success' | 'Failed' | 'Suspicious';
  fraudRiskScore: number; // 0-100
  sourceBranchId: string;
}

export interface Loan {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  purpose: string;
  duration: number; // in months
  interestRate: number; // percentage
  status: 'Approved' | 'Pending' | 'Rejected';
  requestedDate: string;
  riskScore: number; // 0-100
}

export interface CreditCard {
  id: string;
  customerId: string;
  customerName: string;
  cardNumber: string;
  limit: number;
  balance: number;
  status: 'Active' | 'Frozen' | 'Blocked' | 'Inactive' | 'Suspended' | 'Expired' | 'Pending Activation';
  expiryDate: string;
  isEmployee?: boolean;
  cardType?: string;
  cardCategory?: string;
  availableLimit?: number;
  outstandingBalance?: number;
  mobileNumber?: string;
  emailAddress?: string;
  linkedAccountNumber?: string;
  accountType?: string;
  accountBalance?: number;
  branchName?: string;
  branchCode?: string;
  branchLocation?: string;
  branchManagerName?: string;
  branchManagerEmployeeId?: string;
  branchManagerDesignation?: string;
  branchManagerMobile?: string;
  branchManagerEmail?: string;
  cardIssuedByName?: string;
  cardIssuedByEmployeeId?: string;
  cardIssuedByDesignation?: string;
  cardIssueDate?: string;
  cardIssueTime?: string;
  cardActivationDate?: string;
  cardActivationTime?: string;
  cardActivatedByName?: string;
  approvedByName?: string;
  approvedByEmployeeId?: string;
  approvalRole?: string;
  approvalDate?: string;
  approvalTime?: string;
  creditScore?: number;
  creditRating?: string;
  creditUtilizationRatio?: number;
  paymentHistory?: { onTime: number; missed: number; delayed: number };
  riskProfile?: string;
  creditHealthTrend?: number[];
  creditAnalytics?: {
    monthlySpending: number;
    yearlySpending: number;
    avgTransaction: number;
    highestTransaction: number;
    lowestTransaction: number;
    totalTransactions: number;
  };
  cardActivity?: {
    lastTransaction: { date: string; time: string; amount: number; location: string };
    lastATM: { date: string; time: string; amount: number; location: string };
    lastOnline: { date: string; time: string; amount: number; location: string };
    lastPOS: { date: string; time: string; amount: number; location: string };
    lastInternational: { date: string; time: string; amount: number; location: string };
  };
  riskAssessment?: {
    fraudRiskScore: number;
    creditHealthStatus: 'Good' | 'Moderate' | 'High Risk';
    repaymentPerformance: string;
    emiPerformance: string;
    missedPaymentsCount: number;
  };
  paymentSummary?: {
    totalOutstandingBalance: number;
    dueAmount: number;
    nextPaymentDate: string;
    minimumDue: number;
    lastPaymentDate: string;
    lastPaymentAmount: number;
  };
  cardTransactions?: Array<{ id: string; type: string; merchant: string; amount: number; date: string; time: string; status: string }>;
  cardTimeline?: Array<{ id: string; event: string; date: string; time: string; employee: string; remarks: string }>;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  ipAddress: string;
  timestamp: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

export interface Ticket {
  id: string;
  customerName: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  date: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'Pending' | 'Completed';
  date: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface FixedDeposit {
  id: string;
  customerName: string;
  amount: number;
  interestRate: number;
  durationMonths: number;
  startDate: string;
  status: 'Active' | 'Matured' | 'Closed';
}
