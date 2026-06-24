import {
  WalletState,
  PaymentItem,
  LoanApplication,
  CustomerCard,
  TransactionItem,
  FlaggedAlert,
  InvoiceItem,
  DocumentItem,
  MessageItem,
  CreditProduct,
  SystemSyncItem,
  HelpGuide,
} from './types';

/** Offline fallbacks — live data comes from Supabase */
export const initialWallet: WalletState = {
  balance: 0,
  incomeThisMonth: 0,
  loansThisMonth: 0,
  depositsThisMonth: 0,
  dailyTracker: 0,
  dailyTarget: 0,
};

export const initialPayments: PaymentItem[] = [];
export const initialLoans: LoanApplication[] = [];
export const initialCustomers: CustomerCard[] = [];
export const initialTransactions: TransactionItem[] = [];
export const initialFlaggedAlerts: FlaggedAlert[] = [];
export const initialInvoices: InvoiceItem[] = [];
export const initialDocuments: DocumentItem[] = [];
export const initialMessages: MessageItem[] = [];
export const initialCredits: CreditProduct[] = [];

export const initialSyncItems: SystemSyncItem[] = [
  { id: 'sync-1', name: 'Core Banking', status: 'synced', lastSync: 'Just now' },
  { id: 'sync-2', name: 'SWIFT Gateway', status: 'synced', lastSync: '2 min ago' },
  { id: 'sync-3', name: 'KYC Provider', status: 'synced', lastSync: '5 min ago' },
];

export const helpGuides: HelpGuide[] = [
  { id: 'help-1', title: 'Processing a loan application', excerpt: 'Step-by-step loan review workflow.', category: 'Loan Process', content: '' },
  { id: 'help-2', title: 'Flagging suspicious transactions', excerpt: 'How to escalate fraud alerts.', category: 'Fraud Security', content: '' },
  { id: 'help-3', title: 'Generating customer invoices', excerpt: 'Create and send invoices.', category: 'Compliance', content: '' },
];
