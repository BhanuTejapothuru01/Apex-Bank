import type { Transaction as CustomerTransaction, Card, SavingVault } from '@/features/customer/types';
import type { Customer, Employee, Branch, Transaction, Loan, CreditCard, FixedDeposit, AuditLog, Ticket, Task } from '@/features/super-admin/types/dashboard';
import type {
  LoanApplication,
  CustomerCard,
  TransactionItem,
  FlaggedAlert,
  InvoiceItem,
  DocumentItem,
  MessageItem,
  CreditProduct,
  PaymentItem,
} from '@/features/employee/types';
import type { Transaction as AdminTransaction, SavingTarget } from '@/features/admin/types';
import type { DbRow } from '@/hooks/useSupabaseTable';

const str = (v: unknown, fallback = '') => (v == null ? fallback : String(v));
const num = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isNaN(n) ? fallback : n;
};
const bool = (v: unknown, fallback = false) => (typeof v === 'boolean' ? v : fallback);

// ── Super Admin ──

export function mapStudentToCustomer(row: DbRow): Customer {
  return {
    id: str(row.customer_id || row.id),
    name: str(row.full_name),
    email: str(row.email_address),
    phone: str(row.mobile_number),
    balance: num(row.balance),
    riskProfile: str(row.risk_profile, 'Low') as Customer['riskProfile'],
    riskScore: num(row.risk_score),
    status: str(row.customer_status, 'Active') as Customer['status'],
    verified: bool(row.verified, true),
    branchId: str(row.branch_id, 'BR-NYC-01'),
    kycStatus: (str(row.kyc_status) === 'Verified' ? 'Approved' : str(row.kyc_status, 'Pending')) as Customer['kycStatus'],
    type: str(row.customer_type, 'Retail') as Customer['type'],
    joinDate: str(row.join_date || row.created_at, '').slice(0, 10),
  };
}

export function customerToStudentRow(c: Customer): DbRow {
  return {
    customer_id: c.id,
    full_name: c.name,
    email_address: c.email,
    mobile_number: c.phone,
    balance: c.balance,
    risk_profile: c.riskProfile,
    risk_score: c.riskScore,
    customer_status: c.status,
    verified: c.verified,
    branch_id: c.branchId,
    kyc_status: c.kycStatus === 'Approved' ? 'Verified' : c.kycStatus,
    customer_type: c.type,
    join_date: c.joinDate,
    password: 'changeme',
  };
}

export function mapEmployeeRow(row: DbRow): Employee {
  return {
    id: str(row.id),
    name: str(row.name),
    email: str(row.email),
    role: str(row.role),
    department: str(row.department),
    branchId: str(row.branch_id),
    status: str(row.status, 'Active') as Employee['status'],
    rating: num(row.rating),
    joinDate: str(row.join_date, '').slice(0, 10),
    performance: num(row.performance),
  };
}

export function mapBranchRow(row: DbRow): Branch {
  return {
    id: str(row.id),
    name: str(row.name),
    manager: str(row.manager),
    location: str(row.location),
    totalDeposits: num(row.total_deposits),
    activeAccounts: num(row.active_accounts),
    rating: num(row.rating),
    status: str(row.status, 'Operational') as Branch['status'],
  };
}

export function mapBankTransactionRow(row: DbRow): Transaction {
  return {
    id: str(row.id),
    customerId: str(row.customer_id),
    customerName: str(row.customer_name),
    amount: num(row.amount),
    type: str(row.tx_type, 'Transfer') as Transaction['type'],
    category: str(row.category),
    timestamp: str(row.transaction_date || row.created_at),
    status: str(row.status, 'Success') as Transaction['status'],
    fraudRiskScore: num(row.fraud_risk_score),
    sourceBranchId: str(row.source_branch_id),
  };
}

export function mapBankLoanRow(row: DbRow): Loan {
  return {
    id: str(row.id),
    customerId: str(row.customer_id),
    customerName: str(row.customer_name || row.applicant_name),
    amount: num(row.amount),
    purpose: str(row.purpose || row.loan_type),
    duration: num(row.duration_months) || num(row.term_years) * 12,
    interestRate: num(row.interest_rate),
    status: str(row.status, 'Pending') as Loan['status'],
    requestedDate: str(row.requested_date || row.date_applied, '').slice(0, 10),
    riskScore: num(row.risk_score),
  };
}

export function mapBankCardRow(row: DbRow): CreditCard {
  return {
    id: str(row.id),
    customerId: str(row.customer_id),
    customerName: str(row.customer_name || row.cardholder),
    cardNumber: str(row.card_number),
    limit: num(row.credit_limit),
    balance: num(row.balance),
    status: str(row.status, 'Active') as CreditCard['status'],
    expiryDate: str(row.expiry_date),
  };
}

export function mapFixedDepositRow(row: DbRow): FixedDeposit {
  return {
    id: str(row.id),
    customerName: str(row.customer_name),
    amount: num(row.amount),
    interestRate: num(row.interest_rate),
    durationMonths: num(row.duration_months),
    startDate: str(row.start_date, '').slice(0, 10),
    status: str(row.status, 'Active') as FixedDeposit['status'],
  };
}

export function mapAuditLogRow(row: DbRow): AuditLog {
  return {
    id: str(row.id),
    user: str(row.user_email),
    action: str(row.action),
    ipAddress: str(row.ip_address),
    timestamp: str(row.created_at),
    severity: str(row.severity, 'Info') as AuditLog['severity'],
  };
}

export function mapTicketRow(row: DbRow): Ticket {
  return {
    id: str(row.id),
    customerName: str(row.customer_name),
    subject: str(row.subject),
    status: str(row.status, 'Open') as Ticket['status'],
    priority: str(row.priority, 'Medium') as Ticket['priority'],
    date: str(row.ticket_date, '').slice(0, 10),
  };
}

export function mapTaskRow(row: DbRow): Task {
  return {
    id: str(row.id),
    title: str(row.title),
    status: str(row.status, 'Pending') as Task['status'],
    date: str(row.task_date, '').slice(0, 10),
    priority: str(row.priority, 'Medium') as Task['priority'],
  };
}

// ── Customer portal ──

export function mapCustomerTransactionRow(row: DbRow): CustomerTransaction {
  return {
    id: str(row.id),
    merchant: str(row.merchant || row.customer_name),
    amount: num(row.amount),
    category: str(row.category, 'Other') as CustomerTransaction['category'],
    tag: str(row.tag, '#apex'),
    date: str(row.transaction_date || row.created_at),
    status: str(row.status, 'completed').toLowerCase() as CustomerTransaction['status'],
    type: str(row.tx_direction, 'expense') as CustomerTransaction['type'],
    notes: str(row.notes) || undefined,
  };
}

export function customerTransactionToRow(
  tx: CustomerTransaction,
  studentId?: string
): DbRow {
  return {
    id: tx.id,
    student_id: studentId,
    merchant: tx.merchant,
    amount: tx.amount,
    category: tx.category,
    tag: tx.tag,
    transaction_date: tx.date,
    status: tx.status,
    tx_direction: tx.type,
    notes: tx.notes,
    portal: 'customer',
  };
}

export function mapCustomerCardRow(row: DbRow): Card {
  return {
    id: str(row.id),
    cardholder: str(row.cardholder),
    last4: str(row.last4),
    expiry: str(row.expiry_date),
    network: str(row.network, 'Visa') as Card['network'],
    isVirtual: bool(row.is_virtual),
    isFrozen: bool(row.is_frozen),
    dailyLimit: num(row.daily_limit),
    contactlessEnabled: bool(row.contactless_enabled, true),
    colorType: str(row.color_type, 'classic-pink') as Card['colorType'],
    cardType: str(row.card_type) || undefined,
    creditScore: num(row.credit_score) || undefined,
  };
}

export function mapSavingsVaultRow(row: DbRow): SavingVault {
  return {
    id: str(row.id),
    name: str(row.name),
    targetAmount: num(row.target_amount),
    currentAmount: num(row.current_amount),
    category: str(row.category),
  };
}

// ── Employee portal ──

export function mapEmployeeLoanRow(row: DbRow): LoanApplication {
  const verification = (row.verification as Record<string, unknown>) || {};
  return {
    id: str(row.id),
    applicantName: str(row.applicant_name || row.customer_name),
    companyName: str(row.company_name),
    loanType: str(row.loan_type || row.purpose),
    amount: num(row.amount),
    status: str(row.status, 'Pending') as LoanApplication['status'],
    dateApplied: str(row.date_applied || row.requested_date, '').slice(0, 10),
    creditScore: num(row.credit_score),
    income: num(row.income),
    existingLiabilities: num(row.existing_liabilities),
    dti: num(row.dti),
    riskRating: str(row.risk_rating, 'Medium') as LoanApplication['riskRating'],
    interestRate: num(row.interest_rate),
    termYears: num(row.term_years),
    decisionReason: str(row.decision_reason) || undefined,
    verification: {
      kycStatus: bool(verification.kycStatus),
      panCard: bool(verification.panCard),
      aadhaarCard: bool(verification.aadhaarCard),
      bankReconciled: bool(verification.bankReconciled),
      employmentCheck: str(verification.employmentCheck, 'Pending') as 'Verified' | 'Pending' | 'Failed',
    },
  };
}

export function mapEmployeeCustomerRow(row: DbRow): CustomerCard {
  return {
    id: str(row.id),
    name: str(row.name),
    company: str(row.company),
    type: str(row.account_type, 'Corporate'),
    limit: num(row.credit_limit),
    balance: num(row.balance),
    cardNum: str(row.card_number),
    exp: str(row.expiry_date),
    cvv: str(row.cvv, '***'),
    avatarColor: str(row.avatar_color, 'bg-pink-500'),
    status: str(row.status, 'Active') as CustomerCard['status'],
    creditScore: num(row.credit_score),
    amlCheck: str(row.aml_check, 'Cleared') as CustomerCard['amlCheck'],
    idCheck: str(row.id_check, 'Verified') as CustomerCard['idCheck'],
    incorpCheck: str(row.incorp_check, 'Verified') as CustomerCard['incorpCheck'],
  };
}

export function mapEmployeeTransactionRow(row: DbRow): TransactionItem {
  return {
    id: str(row.id),
    sender: str(row.sender),
    recipient: str(row.recipient),
    amount: num(row.amount),
    date: str(row.transaction_date, '').slice(0, 10),
    time: str(row.tx_time, '12:00'),
    status: str(row.status, 'Completed') as TransactionItem['status'],
    category: str(row.category, 'Transfer') as TransactionItem['category'],
    reference: str(row.reference),
  };
}

export function mapFraudAlertRow(row: DbRow): FlaggedAlert {
  return {
    id: str(row.id),
    source: str(row.source),
    reason: str(row.reason),
    amount: num(row.amount),
    riskProbability: num(row.risk_probability),
    time: str(row.alert_time),
    status: str(row.status, 'Pending') as FlaggedAlert['status'],
    location: str(row.location),
    deviceType: str(row.device_type),
  };
}

export function mapInvoiceRow(row: DbRow): InvoiceItem {
  const items = Array.isArray(row.items) ? (row.items as InvoiceItem['items']) : [];
  return {
    id: str(row.id),
    invoiceNumber: str(row.invoice_number || row.id),
    clientName: str(row.client_name),
    amount: num(row.amount),
    issueDate: str(row.issue_date || row.created_at, '').slice(0, 10),
    dueDate: str(row.due_date),
    status: str(row.status, 'Outstanding') as InvoiceItem['status'],
    items,
  };
}

export function mapDocumentRow(row: DbRow): DocumentItem {
  return {
    id: str(row.id),
    name: str(row.title || row.name),
    category: str(row.doc_type, 'Contracts') as DocumentItem['category'],
    size: str(row.file_size),
    uploadedBy: str(row.uploaded_by),
    uploadDate: str(row.uploaded_at || row.created_at, '').slice(0, 10),
    extension: str(row.file_extension, 'pdf') as DocumentItem['extension'],
  };
}

export function mapInboxMessageRow(row: DbRow): MessageItem {
  return {
    id: str(row.id),
    sender: str(row.sender_name),
    subject: str(row.subject),
    body: str(row.content),
    time: str(row.message_time),
    date: str(row.created_at, '').slice(0, 10),
    priority: str(row.priority, 'Medium') as MessageItem['priority'],
    isRead: bool(row.is_read),
    avatarColor: str(row.avatar_color, 'bg-pink-500'),
    chatHistory: [],
  };
}

export function mapCreditProductRow(row: DbRow): CreditProduct {
  const meta = (row.metadata as Record<string, unknown>) || {};
  return {
    id: str(row.id),
    tierName: str(row.name),
    baseLimit: num(meta.baseLimit, num(row.applicants) * 1000 || 50000),
    interestRate: num(row.rate),
    aprDiscount: num(meta.aprDiscount, 0),
    features: Array.isArray(meta.features) ? (meta.features as string[]) : [],
    applied: bool(meta.applied),
    color: str(meta.color, 'from-pink-500 via-rose-500 to-pink-600'),
  };
}

export function mapPaymentRow(row: DbRow): PaymentItem {
  return {
    id: str(row.id),
    vendor: str(row.vendor),
    category: str(row.category),
    amount: num(row.amount),
    dueDate: str(row.due_date),
    autopay: bool(row.autopay),
    color: str(row.color_class, 'bg-pink-500'),
  };
}

// ── Admin portal ──

export function mapAdminTransactionRow(row: DbRow): AdminTransaction {
  return {
    id: str(row.id),
    name: str(row.name || row.merchant),
    type: str(row.tx_direction === 'income' ? 'Income' : row.tx_direction, 'Expense') as AdminTransaction['type'],
    date: str(row.transaction_date || row.created_at).replace('T', ' ').slice(0, 19),
    amount: num(row.amount),
    recipient: str(row.recipient),
    status: str(row.status, 'Pending') as AdminTransaction['status'],
    iconName: str(row.icon_name, 'ReceiptText'),
  };
}

export function mapSavingTargetRow(row: DbRow): SavingTarget {
  const current = num(row.current_amount);
  const target = num(row.target_amount);
  return {
    id: str(row.id),
    name: str(row.name),
    current,
    target,
    percentage: target > 0 ? Math.min(100, parseFloat(((current / target) * 100).toFixed(2))) : 0,
    color: str(row.color, '#ec4899'),
  };
}

// ── Super-admin portal ──

export function mapSuperAdminInboxRow(row: DbRow) {
  const msgType = str(row.message_type, 'System Message');
  const type =
    msgType === 'Leave Request' ? 'Leave Request'
    : msgType === 'Announcement' ? 'Announcement'
    : msgType === 'Support' ? 'Support Notification'
    : 'System Message';

  return {
    id: str(row.id),
    senderName: str(row.sender_name),
    employeeId: str(row.employee_id),
    branchName: str(row.branch_name),
    timestamp: str(row.message_time),
    subject: str(row.subject),
    content: str(row.content),
    type: type as 'Leave Request' | 'Announcement' | 'System Message' | 'Support Notification',
    status: str(row.status, 'Pending') as 'Pending' | 'Approved' | 'Rejected' | 'More Info Requested',
    read: bool(row.is_read),
    archived: bool(row.is_archived),
    priority: str(row.priority, 'Medium') as 'High' | 'Medium' | 'Low',
    replies: [] as Array<{ sender: string; message: string; timestamp: string }>,
  };
}

export function mapFraudAlertNotification(row: DbRow) {
  const risk = num(row.risk_probability);
  return {
    id: str(row.id),
    title: str(row.reason),
    description: `${str(row.source)} — ₹${num(row.amount).toLocaleString()} (${str(row.location)})`,
    time: str(row.alert_time),
    type: (risk >= 80 ? 'critical' : risk >= 50 ? 'warning' : 'info') as 'critical' | 'warning' | 'info',
    read: str(row.status) !== 'Pending',
  };
}
