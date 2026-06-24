export type ActiveTab =
  | 'dashboard'
  | 'payments'
  | 'loans'
  | 'customers'
  | 'transactions'
  | 'fraud'
  | 'invoices'
  | 'deposits'
  | 'documents'
  | 'inbox'
  | 'credits'
  | 'settings';

export interface WalletState {
  balance: number;
  incomeThisMonth: number;
  loansThisMonth: number;
  depositsThisMonth: number;
  dailyTracker: number;
  dailyTarget: number;
}

export interface PaymentItem {
  id: string;
  vendor: string;
  category: string;
  amount: number;
  dueDate: string;
  autopay: boolean;
  color: string;
}

export interface LoanApplication {
  id: string;
  applicantName: string;
  companyName: string;
  loanType: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Required Info';
  dateApplied: string;
  creditScore: number;
  income: number;
  existingLiabilities: number;
  dti: number; // debt to income %
  riskRating: 'Low' | 'Medium' | 'High' | 'Extreme';
  interestRate: number;
  termYears: number;
  decisionReason?: string;
  verification: {
    kycStatus: boolean;
    panCard: boolean;
    aadhaarCard: boolean;
    bankReconciled: boolean;
    employmentCheck: 'Verified' | 'Pending' | 'Failed';
  };
}

export interface CustomerCard {
  id: string;
  name: string;
  company: string;
  type: string;
  limit: number;
  balance: number;
  cardNum: string;
  exp: string;
  cvv: string;
  avatarColor: string;
  status: 'Active' | 'Pending' | 'Blocked';
  creditScore: number;
  amlCheck: 'Cleared' | 'Flagged' | 'Under Review';
  idCheck: 'Verified' | 'Review Required';
  incorpCheck: 'Verified' | 'Review Required';
}

export interface TransactionItem {
  id: string;
  sender: string;
  recipient: string;
  amount: number;
  date: string;
  time: string;
  status: 'Completed' | 'Pending' | 'Flagged' | 'Blocked';
  category: 'Infrastructure' | 'Utility' | 'Rent' | 'Fees' | 'Stripe' | 'Salary' | 'Transfer';
  reference: string;
}

export interface FlaggedAlert {
  id: string;
  source: string;
  reason: string;
  amount: number;
  riskProbability: number; // 0 to 100
  time: string;
  status: 'Pending' | 'Approved' | 'Declined' | 'Blocked';
  location: string;
  deviceType: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'Paid' | 'Outstanding' | 'Overdue';
  items: Array<{ description: string; qty: number; unitPrice: number }>;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: 'Contracts' | 'NDAs' | 'KYC Docs' | 'Financial Audits';
  size: string;
  uploadedBy: string;
  uploadDate: string;
  extension: 'pdf' | 'docx' | 'xlsx' | 'zip';
}

export interface MessageItem {
  id: string;
  sender: string;
  subject: string;
  body: string;
  time: string;
  date: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  isRead: boolean;
  avatarColor: string;
  chatHistory: Array<{
    id: string;
    sender: string;
    message: string;
    time: string;
    isUser: boolean;
  }>;
  leaveDetails?: {
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
  };
}

export interface CreditProduct {
  id: string;
  tierName: string;
  baseLimit: number;
  interestRate: number;
  aprDiscount: number;
  features: string[];
  applied: boolean;
  color: string;
}

export interface SystemSyncItem {
  id: string;
  name: string;
  lastSync: string;
  status: 'Syncing' | 'synced' | 'failed';
}

export interface HelpGuide {
  id: string;
  title: string;
  excerpt: string;
  category: 'Overview' | 'Loan Process' | 'Compliance' | 'Fraud Security';
  content: string;
}
