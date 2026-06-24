import type { DbRow } from '@/hooks/useSupabaseTable';

const str = (v: unknown, fallback = '') => (v == null ? fallback : String(v));
const num = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isNaN(n) ? fallback : n;
};

export interface AdminPortalCustomer {
  id: string;
  name: string;
  company: string;
  avatar: string;
  cardBrand: string;
  cardNumber: string;
  cardExpiry: string;
  bankName: string;
  bankAddress: string;
  accountNumber: string;
  routingNumber: string;
  swiftBic: string;
  accountType: string;
  availableBalance: number;
  currentLoans: number;
  creditLimit: number;
  passportId: string;
  delawareStamp: string;
  filingNumber: string;
  adminMemo: string;
  loanStatus: 'pending' | 'approved' | 'rejected';
  loanAmountRequested: number;
  businessDocAudited: boolean;
}

export interface AdminPortalEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  clearanceLevel: 'L1 Clerk' | 'L2 Specialist' | 'L3 Manager' | 'L4 Audit Director';
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  dailyLimit: number;
  approvedCount: number;
}

export interface AdminFraudIncident {
  id: string;
  sourceName: string;
  amount: number;
  riskScore: number;
  reason: string;
  location: string;
  ip: string;
  time: string;
  status: 'Pending Review' | 'Cleared' | 'Blocked';
}

export interface AdminLoanApplication {
  id: string;
  customerName: string;
  companyName: string;
  loanType: string;
  requestedAmount: number;
  interestRate: number;
  termYears: number;
  applicationDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  monthlyIncome: number;
  existingDebt: number;
  creditScore: number;
  fraudRiskScore: number;
  kycStatus: 'Verified' | 'Pending' | 'Failed';
  panVerification: 'Verified' | 'Pending' | 'Failed';
  aadhaarVerification: 'Verified' | 'Pending' | 'Failed';
  bankVerification: 'Verified' | 'Pending' | 'Failed';
  employmentVerification: 'Verified' | 'Pending' | 'Failed';
}

export interface AdminInboxMessage {
  id: string;
  sender: 'Super Admin';
  subject: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  date: string;
  customerName: string;
  accountNumber: string;
  loanId?: string;
  message: string;
  isRead: boolean;
  type: 'Balance' | 'Credit' | 'Loan' | 'Fraud' | 'KYC' | 'Transaction' | 'Compliance' | 'Risk';
  suggestedAction: string;
}

const AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
];

function hashIndex(id: string, mod: number) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i)) % mod;
  return h;
}

function clearanceFromRole(role: string): AdminPortalEmployee['clearanceLevel'] {
  const r = role.toLowerCase();
  if (r.includes('director') || r.includes('chief')) return 'L4 Audit Director';
  if (r.includes('manager') || r.includes('lead')) return 'L3 Manager';
  if (r.includes('specialist') || r.includes('senior')) return 'L2 Specialist';
  return 'L1 Clerk';
}

function mapVerification(raw: unknown): 'Verified' | 'Pending' | 'Failed' {
  const v = str(raw).toLowerCase();
  if (v === 'verified' || v === 'true') return 'Verified';
  if (v === 'failed' || v === 'rejected') return 'Failed';
  return 'Pending';
}

function parseVerificationJson(raw: unknown) {
  if (raw && typeof raw === 'object') {
    const v = raw as Record<string, unknown>;
    return {
      kyc: mapVerification(v.kycStatus),
      pan: mapVerification(v.panCard),
      aadhaar: mapVerification(v.aadhaarCard),
      bank: mapVerification(v.bankReconciled),
      employment: mapVerification(v.employmentCheck),
    };
  }
  return {
    kyc: 'Pending' as const,
    pan: 'Pending' as const,
    aadhaar: 'Pending' as const,
    bank: 'Pending' as const,
    employment: 'Pending' as const,
  };
}

export function mapStudentToAdminCustomer(row: DbRow): AdminPortalCustomer {
  const id = str(row.customer_id || row.id);
  const name = str(row.full_name, 'Customer');
  const idx = hashIndex(id, AVATARS.length);
  const balance = num(row.balance);
  return {
    id,
    name,
    company: `${name.split(' ')[0] || 'Apex'} Holdings LLC`,
    avatar: AVATARS[idx],
    cardBrand: 'Apex Mastercard Platinum',
    cardNumber: `4012  8830  ${String(idx).padStart(2, '0')}d9  6317`,
    cardExpiry: '08 / 32',
    bankName: 'Apex Union & Trust, N.A.',
    bankAddress: '120 Wall Street, Financial District, New York, NY',
    accountNumber: `${id.replace(/\D/g, '').slice(-6) || '994112'}-C-490`,
    routingNumber: '021000021',
    swiftBic: 'APEXUS33XXX',
    accountType: 'Corporate High-Yield Checking',
    availableBalance: balance,
    currentLoans: Math.round(balance * 0.08),
    creditLimit: Math.max(50000, Math.round(balance * 0.3)),
    passportId: `UA-${id.slice(-5).toUpperCase()}`,
    delawareStamp: `#883-011-${id.slice(-4)}`,
    filingNumber: `DEL-${id.replace(/\D/g, '').slice(-7) || '9941129'}`,
    adminMemo: `Profile synced from Supabase — KYC ${str(row.kyc_status, 'Pending')}.`,
    loanStatus: 'pending',
    loanAmountRequested: Math.round(balance * 0.15) || 50000,
    businessDocAudited: str(row.kyc_status) === 'Verified',
  };
}

export function mapEmployeeToAdminEmployee(row: DbRow): AdminPortalEmployee {
  const id = str(row.id);
  const performance = num(row.performance, 80);
  const idx = hashIndex(id, AVATARS.length);
  const statusRaw = str(row.status, 'Active');
  const status: AdminPortalEmployee['status'] =
    statusRaw === 'On Leave' ? 'On Leave' : statusRaw === 'Suspended' ? 'Suspended' : 'Active';

  return {
    id,
    name: str(row.name),
    role: str(row.role),
    department: str(row.department),
    avatar: AVATARS[idx],
    clearanceLevel: clearanceFromRole(str(row.role)),
    email: str(row.email),
    phone: str(row.mobile_number, '+1 (555) 010-0000'),
    status,
    dailyLimit: Math.round(50000 + performance * 2500),
    approvedCount: Math.round(performance / 2),
  };
}

export function mapFraudAlertToAdminIncident(row: DbRow): AdminFraudIncident {
  const risk = num(row.risk_probability);
  const statusRaw = str(row.status, 'Pending');
  const status: AdminFraudIncident['status'] =
    statusRaw === 'Blocked' ? 'Blocked' : statusRaw === 'Cleared' || statusRaw === 'Resolved' ? 'Cleared' : 'Pending Review';

  return {
    id: str(row.id),
    sourceName: str(row.source),
    amount: num(row.amount),
    riskScore: risk,
    reason: str(row.reason),
    location: str(row.location),
    ip: str(row.device_type, 'Unknown device'),
    time: str(row.alert_time),
    status,
  };
}

export function mapBankLoanToAdminApplication(row: DbRow): AdminLoanApplication {
  const verification = parseVerificationJson(row.verification);
  const statusRaw = str(row.status, 'Pending');
  const status: AdminLoanApplication['status'] =
    statusRaw === 'Approved' ? 'Approved' : statusRaw === 'Rejected' ? 'Rejected' : 'Pending';
  const durationMonths = num(row.duration_months) || num(row.term_years) * 12 || 36;

  return {
    id: str(row.id),
    customerName: str(row.customer_name || row.applicant_name),
    companyName: str(row.company_name, 'Apex Client Corp'),
    loanType: str(row.loan_type || row.purpose, 'Commercial Loan'),
    requestedAmount: num(row.amount),
    interestRate: num(row.interest_rate, 5.5),
    termYears: Math.max(1, Math.round(durationMonths / 12)),
    applicationDate: str(row.requested_date || row.date_applied, '').slice(0, 10),
    status,
    monthlyIncome: num(row.income, 25000),
    existingDebt: num(row.existing_liabilities, 5000),
    creditScore: num(row.credit_score, 720),
    fraudRiskScore: num(row.risk_score, 15),
    kycStatus: verification.kyc,
    panVerification: verification.pan,
    aadhaarVerification: verification.aadhaar,
    bankVerification: verification.bank,
    employmentVerification: verification.employment,
  };
}

function inboxTypeFromMessageType(msgType: string): AdminInboxMessage['type'] {
  const t = msgType.toLowerCase();
  if (t.includes('fraud') || t.includes('support')) return 'Fraud';
  if (t.includes('leave') || t.includes('loan')) return 'Loan';
  if (t.includes('announcement')) return 'Compliance';
  if (t.includes('kyc')) return 'KYC';
  if (t.includes('balance')) return 'Balance';
  if (t.includes('credit')) return 'Credit';
  if (t.includes('transaction')) return 'Transaction';
  return 'Risk';
}

export function mapInboxToAdminMessage(row: DbRow): AdminInboxMessage {
  const priorityRaw = str(row.priority, 'Medium');
  const priority: AdminInboxMessage['priority'] =
    priorityRaw === 'Critical' ? 'Critical' : priorityRaw === 'High' ? 'High' : priorityRaw === 'Low' ? 'Low' : 'Medium';

  return {
    id: str(row.id),
    sender: 'Super Admin',
    subject: str(row.subject),
    priority,
    date: str(row.message_time || row.created_at),
    customerName: str(row.sender_name),
    accountNumber: `XXXXXXXXX${str(row.employee_id).slice(-4) || '0000'}`,
    loanId: str(row.metadata && typeof row.metadata === 'object' ? (row.metadata as Record<string, unknown>).loanId : ''),
    message: str(row.content || row.preview),
    isRead: Boolean(row.is_read),
    type: inboxTypeFromMessageType(str(row.message_type)),
    suggestedAction: str(row.preview, 'Review and take appropriate administrative action.'),
  };
}
