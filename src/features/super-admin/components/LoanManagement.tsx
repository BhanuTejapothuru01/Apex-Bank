import React, { useState, useMemo, useEffect } from 'react';
import { 
  DollarSign, 
  Coins, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  TrendingDown,
  Search,
  User,
  Users,
  Building2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Mail,
  UserCheck,
  FileText,
  Activity,
  UserX,
  Lock,
  Unlock,
  ShieldAlert,
  CornerDownRight,
  Download,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Loan, Customer, Transaction, Employee, Branch } from '../types/dashboard';

interface LoanManagementProps {
  loans: Loan[];
  setLoans: (loans: Loan[]) => void;
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  employees?: Employee[];
  branches?: Branch[];
  addAuditLog: (action: string, severity: 'Info' | 'Warning' | 'Critical') => void;
  setActiveTab?: (tab: string) => void;
}

interface UnifiedLoanItem {
  id: string; // Reference ID
  applicantId: string;
  applicantName: string;
  applicantType: 'Customer' | 'Employee';
  phone: string;
  email: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Closed' | 'Overdue';
  loanType: 'Personal Loan' | 'Home Loan' | 'Vehicle Loan' | 'Education Loan' | 'Business Loan' | 'Corporate Loan' | 'Gold Loan';
  amount: number;
  interestRate: number;
  duration: number; // months
  emiAmount: number;
  remainingBalance: number;
  purpose: string;
  requestedDate: string;
  requestedTime: string;
  riskScore: number;
  creditScore: number;
  incomeVerified: string;
  complianceStatus: string;
  underwritingResult: string;

  // Linked Account Information
  accountNumber: string;
  accountType: string;
  accountBalance: number;
  linkedAccountNumber: string;
  accountOpeningDate: string;

  // Branch Information
  branchId: string;
  branchName: string;
  branchCode: string;
  branchLocation: string;
  branchZone: string;

  // Branch Manager Information
  managerName: string;
  managerId: string;
  managerDesignation: string;
  managerPhone: string;
  managerEmail: string;

  // Processing Information
  createdBy: string;
  createdById: string;
  createdByRole: string;
  submissionDate: string;
  submissionTime: string;

  // Approval Information
  approvedBy: string;
  approvedById: string;
  approvedByRole: string;
  approvalDate: string;
  approvalTime: string;
  managerAuthorizationStatus: string;
  managerAuthDate: string;
  managerAuthTime: string;

  // Ledger transactions
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    date: string;
    time: string;
    status: 'Success' | 'Failed' | 'Suspicious';
  }>;

  // Lifecycle Timeline
  timeline: Array<{
    event: string;
    date: string;
    time: string;
    responsible: string;
    remarks: string;
  }>;
}

// Branch master directory for mapping consistency
const BRANCH_DETAILS_DIRECTORY: Record<string, {
  name: string;
  code: string;
  location: string;
  zone: string;
  manager: {
    name: string;
    empId: string;
    designation: string;
    phone: string;
    email: string;
  }
}> = {
  "BR-HYD-01": {
    name: "Hyderabad Main Branch",
    code: "BR-101",
    location: "Hyderabad, Telangana",
    zone: "South India Region",
    manager: {
      name: "Mohammed Rahman",
      empId: "EMP-0007",
      designation: "Branch Manager",
      phone: "+91 90001 02345",
      email: "m.rahman@apexbank.com"
    }
  },
  "BR-ZH-01": {
    name: "Zurich Elite Vault",
    code: "BR-101",
    location: "Zurich, Switzerland",
    zone: "Central Europe Zone",
    manager: {
      name: "Maximilian Kael",
      empId: "EMP-0014",
      designation: "General Director & Zurich Manager",
      phone: "+41 44 200 4567",
      email: "m.kael@apexbank.com"
    }
  },
  "BR-LDN-02": {
    name: "London Square Premium",
    code: "BR-581",
    location: "London, United Kingdom",
    zone: "Western Europe Region",
    manager: {
      name: "Alistair Sterling",
      empId: "EMP-0092",
      designation: "Executive Director & London Manager",
      phone: "+44 20 7946 0192",
      email: "a.sterling@apexbank.com"
    }
  },
  "BR-[#141c48]": {
    name: "Hyderabad Main Branch",
    code: "BR-101",
    location: "Hyderabad, Telangana",
    zone: "South India Region",
    manager: {
      name: "Mohammed Rahman",
      empId: "EMP-0007",
      designation: "Branch Manager",
      phone: "+91 900 010 2345",
      email: "m.rahman@apexbank.com"
    }
  },
  "BR-NYC-01": {
    name: "New York Wall St. Flagship",
    code: "BR-021",
    location: "New York, USA",
    zone: "North America Zone",
    manager: {
      name: "Donald Vance",
      empId: "EMP-0011",
      designation: "Senior Credit Officer",
      phone: "+1 (555) 014-9988",
      email: "d.vance@apexbank.com"
    }
  },
  "BR-TKY-03": {
    name: "Tokyo Neo Skyline",
    code: "BR-039",
    location: "Tokyo, Japan",
    zone: "East Asia Region",
    manager: {
      name: "Masami Tanaka",
      empId: "EMP-0205",
      designation: "Tokyo Branch General Manager",
      phone: "+81 90 1234 5678",
      email: "m.tanaka@apexbank.com"
    }
  },
  "BR-SGP-04": {
    name: "Singapore Wharf Hub",
    code: "BR-882",
    location: "Marina Bay, Singapore",
    zone: "Southeast Asia Zone",
    manager: {
      name: "Lawrence Wong",
      empId: "EMP-0044",
      designation: "Executive Director & Singapore Custodian",
      phone: "+65 6123 4567",
      email: "l.wong@apexbank.com"
    }
  }
};

export default function LoanManagement({
  loans = [],
  setLoans,
  customers = [],
  setCustomers,
  transactions = [],
  setTransactions,
  employees = [],
  branches = [],
  addAuditLog,
  setActiveTab
}: LoanManagementProps) {
  
  // High fidelity states
  const [selectedLoanId, setSelectedLoanId] = useState<string>("LOAN-1029");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{name: string, audit: string, handler: () => void} | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConfirmAction(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleActionClick = (actionName: string, auditText: string, tab?: string, isSensitive?: boolean) => {
    const executeAction = () => {
      setLoadingAction(actionName);
      setConfirmAction(null);
      
      // Artificial delay to simulate processing
      setTimeout(() => {
        triggerFeedback(`[ACCESS GRANTED] Executing procedure: ${actionName}. Access logged under corporate Super Admin protocols.`);
        if (addAuditLog) {
          addAuditLog(auditText, "Info");
        }
        if (tab && setActiveTab) {
          setActiveTab(tab);
        }
        setLoadingAction(null);
      }, 800);
    };

    if (isSensitive) {
      setConfirmAction({ name: actionName, audit: auditText, handler: executeAction });
    } else {
      executeAction();
    }
  };
  const [applicantFilter, setApplicantFilter] = useState<'All' | 'Customer' | 'Employee'>('All');
  const [loanStatusFilter, setLoanStatusFilter] = useState<'All' | 'Approved' | 'Pending' | 'Rejected' | 'Closed' | 'Overdue'>('All');
  const [loanTypeFilter, setLoanTypeFilter] = useState<'All' | 'Personal Loan' | 'Home Loan' | 'Vehicle Loan' | 'Education Loan' | 'Business Loan' | 'Corporate Loan' | 'Gold Loan'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Trigger feedback banner
  const triggerFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  // Build the complete combined dataset dynamically to support customers, custom employees, and rich timelines
  const combinedLoans = useMemo<UnifiedLoanItem[]>(() => {
    // 1. Map existing customer loans
    const customerMapped: UnifiedLoanItem[] = loans.map(l => {
      const matchCust = customers.find(c => c.id === l.customerId) || {
        id: l.customerId || "CUST-999",
        name: l.customerName,
        phone: "+1 (555) 014-9988",
        email: "client@apexbank.com",
        balance: 450000.00,
        branchId: "BR-NYC-01"
      };

      const branchKey = matchCust.branchId || "BR-HYD-01";
      const branchMeta = BRANCH_DETAILS_DIRECTORY[branchKey] || BRANCH_DETAILS_DIRECTORY["BR-HYD-01"];

      // Categorize loan type on basis of amount/purpose
      let mappedType: UnifiedLoanItem['loanType'] = 'Personal Loan';
      if (l.amount >= 2000000) mappedType = 'Corporate Loan';
      else if (l.amount >= 1000000) mappedType = 'Business Loan';
      else if (l.purpose.toLowerCase().includes('assets') || l.purpose.toLowerCase().includes('maritime')) mappedType = 'Corporate Loan';
      else if (l.purpose.toLowerCase().includes('home') || l.purpose.toLowerCase().includes('headquarters')) mappedType = 'Home Loan';
      else if (l.purpose.toLowerCase().includes('expansion') || l.purpose.toLowerCase().includes('tech')) mappedType = 'Business Loan';
      else if (l.purpose.toLowerCase().includes('micro')) mappedType = 'Education Loan';
      else if (l.purpose.toLowerCase().includes('infrastructure') || l.purpose.toLowerCase().includes('compute')) mappedType = 'Corporate Loan';

      const emi = Number((l.amount / l.duration * 1.055).toFixed(2));
      const remBalance = l.status === 'Approved' ? Number((l.amount * 0.85).toFixed(2)) : l.status === 'Pending' ? l.amount : 0;

      // Credit ratings mapping
      let creditScore = 720;
      if (l.riskScore > 80) creditScore = 510;
      else if (l.riskScore > 60) creditScore = 610;
      else if (l.riskScore < 20) creditScore = 840;
      else if (l.riskScore < 40) creditScore = 780;

      const incVerified = l.riskScore > 80 ? 'Pending' : 'Verified';
      const compliance = l.riskScore > 80 ? 'Flagged' : 'Passed';
      const underwrite = l.riskScore > 80 ? 'High Risk default advisory' : 'Approved standard credit';

      // Timestamps matching the opened status
      const dateOpenedSec = l.requestedDate || "2026-06-05";

      return {
        id: l.id,
        applicantId: matchCust.id,
        applicantName: matchCust.name,
        applicantType: 'Customer',
        phone: matchCust.phone,
        email: matchCust.email,
        status: (l.status === 'Approved' ? 'Approved' : l.status === 'Pending' ? 'Pending' : 'Rejected'),
        loanType: mappedType,
        amount: l.amount,
        interestRate: l.interestRate,
        duration: l.duration,
        emiAmount: emi,
        remainingBalance: remBalance,
        purpose: l.purpose,
        requestedDate: dateOpenedSec,
        requestedTime: "10:45:32 AM",
        riskScore: l.riskScore,
        creditScore,
        incomeVerified: incVerified,
        complianceStatus: compliance,
        underwritingResult: underwrite,

        // Account Information
        accountNumber: `AP-SAV-${matchCust.id.replace("CUST-", "")}8391`,
        accountType: 'Savings Portfolio Account',
        accountBalance: matchCust.balance,
        linkedAccountNumber: `AP-LON-${matchCust.id.replace("CUST-", "")}5529`,
        accountOpeningDate: '12 January 2022',

        // Branch
        branchId: branchKey,
        branchName: branchMeta.name,
        branchCode: branchMeta.code,
        branchLocation: branchMeta.location,
        branchZone: branchMeta.zone,

        // Branch Manager Info
        managerName: branchMeta.manager.name,
        managerId: branchMeta.manager.empId,
        managerDesignation: branchMeta.manager.designation,
        managerPhone: branchMeta.manager.phone,
        managerEmail: branchMeta.manager.email,

        // Processing Information
        createdBy: "Sarah Jenkins",
        createdById: "EMP-0101",
        createdByRole: "Senior Compliance Officer",
        submissionDate: dateOpenedSec,
        submissionTime: "10:45:32 AM IST",

        // Approval Information
        approvedBy: "Maximilian Kael",
        approvedById: "EMP-014",
        approvedByRole: l.status === 'Approved' ? "Senior Credit Officer" : "N/A",
        approvalDate: l.status === 'Approved' ? "15 June 2026" : "N/A",
        approvalTime: l.status === 'Approved' ? "03:15:45 PM IST" : "N/A",
        managerAuthorizationStatus: l.status === 'Approved' ? "Authorized & Signed" : l.status === 'Pending' ? "Pending Approval" : "Denied Clearance",
        managerAuthDate: l.status === 'Approved' ? "15 June 2026" : "N/A",
        managerAuthTime: l.status === 'Approved' ? "03:20:00 PM IST" : "N/A",

        // History
        transactions: [
          {
            id: `TXN-${matchCust.id.replace("CUST-", "")}771`,
            type: 'Loan Disbursement',
            amount: l.amount,
            date: dateOpenedSec,
            time: '02:15 PM',
            status: l.status === 'Approved' ? 'Success' : 'Failed'
          },
          {
            id: `TXN-${matchCust.id.replace("CUST-", "")}772`,
            type: 'EMI Deposit',
            amount: emi,
            date: '12-Jun-2026',
            time: '10:45 AM',
            status: 'Success'
          }
        ],

        // Timeline
        timeline: [
          {
            event: 'Loan Application Submitted',
            date: dateOpenedSec,
            time: '10:45:32 AM IST',
            responsible: 'Sarah Jenkins (EMP-0101)',
            remarks: 'Digital workspace application received securely with fully compiled credit files.'
          },
          {
            event: 'Initial Review Completed',
            date: dateOpenedSec,
            time: '11:00:15 AM IST',
            responsible: 'Sarah Jenkins (EMP-0101)',
            remarks: 'Applicant matches collateral registration index requirements.'
          },
          {
            event: 'Document Verification',
            date: dateOpenedSec,
            time: '11:30:00 AM IST',
            responsible: 'Compliance Engine OCR',
            remarks: 'Liveness bio-verification and collateral deeds matched successfully.'
          },
          {
            event: 'Risk Assessment',
            date: dateOpenedSec,
            time: '11:45:00 AM IST',
            responsible: 'Automated Scorecard Systems',
            remarks: `Risk index quantified at ${l.riskScore}%. Baseline interest yield optimized.`
          },
          {
            event: 'Branch Manager Approval',
            date: l.status === 'Approved' ? '15 June 2026' : 'Awaiting',
            time: l.status === 'Approved' ? '03:15:45 PM IST' : 'Awaiting',
            responsible: branchMeta.manager.name,
            remarks: l.status === 'Approved' ? 'Branch authorization key code signed and verified.' : 'Pending physical board clearance.'
          },
          {
            event: 'Loan Sanctioned',
            date: l.status === 'Approved' ? '15 June 2026' : 'Awaiting',
            time: l.status === 'Approved' ? '03:18:22 PM IST' : 'Awaiting',
            responsible: 'Underwriting Office',
            remarks: l.status === 'Approved' ? 'Sovereign ledger credit line opened.' : 'Awaiting prior step completions.'
          },
          {
            event: 'Amount Disbursed',
            date: l.status === 'Approved' ? '15 June 2026' : 'Awaiting',
            time: l.status === 'Approved' ? '03:20:00 PM IST' : 'Awaiting',
            responsible: 'SWIFT Settlement Gateway',
            remarks: l.status === 'Approved' ? 'Capital dispatched to primary savings portfolio.' : 'Disbursal pending credit validation.'
          },
          {
            event: 'EMI Payments Started',
            date: l.status === 'Approved' ? '12 July 2026' : 'Awaiting',
            time: '10:00:00 AM IST',
            responsible: 'Automated Clearing House (ACH)',
            remarks: 'Sovereign EMI scheduled compounding begins.'
          }
        ]
      };
    });

    // 2. Synthesize complete Employee Loan items representing Jenkins, Kael, Naidu, Dupont which matching specification
    const employeeMapped: UnifiedLoanItem[] = [
      {
        id: "LOAN-EMP-001",
        applicantId: "EMP-001",
        applicantName: "Sarah Jenkins",
        applicantType: 'Employee',
        phone: "+91 99000 88776",
        email: "s.jenkins@apexbank.com",
        status: "Approved",
        loanType: "Personal Loan",
        amount: 85000.00,
        interestRate: 3.50,
        duration: 24,
        emiAmount: 3672.50,
        remainingBalance: 42000.00,
        purpose: "Home Refurbishing & Solar Grid",
        requestedDate: "2025-11-20",
        requestedTime: "09:30:00 AM",
        riskScore: 12,
        creditScore: 810,
        incomeVerified: "Verified",
        complianceStatus: "Passed",
        underwritingResult: "Employee Discounted Loan Program Approved",
        accountNumber: "AP-SAL-0011024",
        accountType: "Salary Account Link",
        accountBalance: 92000.00,
        linkedAccountNumber: "AP-LON-EMP-001",
        accountOpeningDate: "15 June 2018",
        branchId: "BR-NYC-01",
        branchName: "New York Wall St. Flagship",
        branchCode: "BR-021",
        branchLocation: "New York, USA",
        branchZone: "North America Zone",
        managerName: "Donald Vance",
        managerId: "EMP-0011",
        managerDesignation: "Senior Credit Officer",
        managerPhone: "+1 (555) 014-9988",
        managerEmail: "d.vance@apexbank.com",
        createdBy: "Chloe Dupont",
        createdById: "EMP-092",
        createdByRole: "Senior Loan Underwriter",
        submissionDate: "2025-11-20",
        submissionTime: "09:30:00 AM IST",
        approvedBy: "Maximilian Kael",
        approvedById: "EMP-014",
        approvedByRole: "Senior Credit Officer",
        approvalDate: "2025-11-23",
        approvalTime: "11:15:00 AM IST",
        managerAuthorizationStatus: "Authorized & Board Signed",
        managerAuthDate: "2025-11-23",
        managerAuthTime: "11:30:00 AM IST",
        transactions: [
          {
            id: "TXN-EMP-101",
            type: "Loan Disbursement",
            amount: 85000.00,
            date: "2025-11-23",
            time: "11:45 AM",
            status: "Success"
          },
          {
            id: "TXN-EMP-102",
            type: "EMI Deposit",
            amount: 3672.50,
            date: "12-Jun-2026",
            time: "10:45 AM",
            status: "Success"
          }
        ],
        timeline: [
          {
            event: 'Loan Application Submitted',
            date: '20-Nov-2025',
            time: '09:30:00 AM IST',
            responsible: 'Sarah Jenkins (EMP-001)',
            remarks: 'Employee benefits credit application generated internally.'
          },
          {
            event: 'Document Verification',
            date: '20-Nov-2025',
            time: '10:00:00 AM IST',
            responsible: 'Underwriting Office',
            remarks: 'Internal payroll allocation verified. Automatic deduction enabled.'
          },
          {
            event: 'Risk Assessment',
            date: '21-Nov-2025',
            time: '02:00:00 PM IST',
            responsible: 'Automated Scoring Engine',
            remarks: 'Risk classified as Low (12%). Sovereign credit baseline set.'
          },
          {
            event: 'Branch Manager Approval',
            date: '23-Nov-2025',
            time: '11:15:00 AM IST',
            responsible: 'Maximilian Kael (EMP-014)',
            remarks: 'Sovereign regional interest discount applied.'
          },
          {
            event: 'Amount Disbursed',
            date: '23-Nov-2025',
            time: '11:45:00 AM IST',
            responsible: 'Internal Settlements Port',
            remarks: 'Cleared immediately via salary ledger routing.'
          }
        ]
      },
      {
        id: "LOAN-EMP-014",
        applicantId: "EMP-014",
        applicantName: "Maximilian Kael",
        applicantType: 'Employee',
        phone: "+41 44 200 4567",
        email: "m.kael@apexbank.com",
        status: "Pending",
        loanType: "Home Loan",
        amount: 300000.00,
        interestRate: 2.90,
        duration: 120,
        emiAmount: 2880.00,
        remainingBalance: 300000.00,
        purpose: "Zurich Lakefront Apartment",
        requestedDate: "2026-06-05",
        requestedTime: "11:20:00 AM",
        riskScore: 18,
        creditScore: 830,
        incomeVerified: "Verified",
        complianceStatus: "Passed",
        underwritingResult: "Executive Real-Estate Co-Investment Awaiting Board",
        accountNumber: "AP-SAL-0141024",
        accountType: "Executive Asset Account",
        accountBalance: 125032.00,
        linkedAccountNumber: "AP-LON-EMP-014",
        accountOpeningDate: "10 August 2015",
        branchId: "BR-ZH-01",
        branchName: "Zurich Elite Vault",
        branchCode: "BR-101",
        branchLocation: "Zurich, Switzerland",
        branchZone: "Central Europe Zone",
        managerName: "Maximilian Kael",
        managerId: "EMP-0014",
        managerDesignation: "Branch Manager & Custodian",
        managerPhone: "+41 44 200 4567",
        managerEmail: "m.kael@apexbank.com",
        createdBy: "Sarah Jenkins",
        createdById: "EMP-001",
        createdByRole: "Senior Compliance Officer",
        submissionDate: "2026-06-05",
        submissionTime: "11:20:00 AM IST",
        approvedBy: "Alistair Sterling",
        approvedById: "EMP-0092",
        approvedByRole: "Executive Director",
        approvalDate: "Awaiting",
        approvalTime: "Awaiting",
        managerAuthorizationStatus: "Pending Board Verification",
        managerAuthDate: "N/A",
        managerAuthTime: "N/A",
        transactions: [
          {
            id: "TXN-EMP-111",
            type: "Refund Processing",
            amount: 500.00,
            date: "08-Jun-2026",
            time: "03:12 PM",
            status: "Success"
          }
        ],
        timeline: [
          {
            event: 'Loan Application Submitted',
            date: '05-Jun-2026',
            time: '11:20:00 AM IST',
            responsible: 'Sarah Jenkins (EMP-001)',
            remarks: 'Executive home loan file initialized.'
          },
          {
            event: 'Initial Review Completed',
            date: '06-Jun-2026',
            time: '09:00:00 AM IST',
            responsible: 'Corporate Registry',
            remarks: 'Property title verified with Swiss land registry.'
          },
          {
            event: 'Document Verification',
            date: '08-Jun-2026',
            time: '04:30:00 PM IST',
            responsible: 'Auditing Desk',
            remarks: 'Passed all cross-border wealth preservation policies.'
          },
          {
            event: 'Risk Assessment',
            date: '09-Jun-2026',
            time: '10:15:00 AM IST',
            responsible: 'Underwriting Office',
            remarks: 'Asset valuation matches mortgage loan coverage ratio (MLCR).'
          }
        ]
      },
      {
        id: "LOAN-EMP-045",
        applicantId: "EMP-045",
        applicantName: "Vikram Naidu",
        applicantType: 'Employee',
        phone: "+91 98660 55667",
        email: "v.naidu@apexbank.com",
        status: "Closed",
        loanType: "Vehicle Loan",
        amount: 18000.00,
        interestRate: 4.10,
        duration: 12,
        emiAmount: 1530.00,
        remainingBalance: 0.00,
        purpose: "Super-sport Motorcycle Acquisition",
        requestedDate: "2025-05-10",
        requestedTime: "04:15:00 PM",
        riskScore: 25,
        creditScore: 765,
        incomeVerified: "Verified",
        complianceStatus: "Passed",
        underwritingResult: "Discounted staff auto-loan scheme",
        accountNumber: "AP-CUR-0451024",
        accountType: "Salary Account Port",
        accountBalance: 85000.00,
        linkedAccountNumber: "AP-LON-EMP-045",
        accountOpeningDate: "01 November 2020",
        branchId: "BR-HYD-01",
        branchName: "Hyderabad Main Branch",
        branchCode: "BR-101",
        branchLocation: "Hyderabad, Telangana",
        branchZone: "South India Region",
        managerName: "Mohammed Rahman",
        managerId: "EMP-0007",
        managerDesignation: "Branch Manager",
        managerPhone: "+91 900 010 2345",
        managerEmail: "m.rahman@apexbank.com",
        createdBy: "Sarah Jenkins",
        createdById: "EMP-001",
        createdByRole: "Senior Compliance Officer",
        submissionDate: "2025-05-10",
        submissionTime: "04:15:00 PM IST",
        approvedBy: "Mohammed Rahman",
        approvedById: "EMP-0007",
        approvedByRole: "Branch Manager",
        approvalDate: "2025-05-12",
        approvalTime: "10:30:00 AM IST",
        managerAuthorizationStatus: "Successfully Settled & Released",
        managerAuthDate: "2026-05-12",
        managerAuthTime: "11:00:00 AM IST",
        transactions: [
          {
            id: "TXN-EMP-401",
            type: "Loan Disbursement",
            amount: 18000.00,
            date: "2025-05-12",
            time: "11:00 AM",
            status: "Success"
          },
          {
            id: "TXN-EMP-402",
            type: "Full Settlement Payments",
            amount: 18360.00,
            date: "10-May-2026",
            time: "02:00 PM",
            status: "Success"
          }
        ],
        timeline: [
          {
            event: 'Loan Application Submitted',
            date: '10-May-2025',
            time: '04:15:00 PM IST',
            responsible: 'Vikram Naidu',
            remarks: 'Staff vehicle lending program application filed.'
          },
          {
            event: 'Risk Assessment',
            date: '11-May-2025',
            time: '11:00:00 AM IST',
            responsible: 'Sovereign Core System',
            remarks: 'Risk evaluated as low.'
          },
          {
            event: 'Branch Manager Approval',
            date: '12-May-2025',
            time: '10:30:00 AM IST',
            responsible: 'Mohammed Rahman (EMP-0007)',
            remarks: 'Approved and authorized immediately.'
          },
          {
            event: 'First Deposit',
            date: '12-Jun-2025',
            time: '10:00:00 AM IST',
            responsible: 'Automated Debit Engine',
            remarks: 'EMI deduction authorized.'
          },
          {
            event: 'Latest Transaction',
            date: '10-May-2026',
            time: '02:00:00 PM IST',
            responsible: 'Vikram Naidu',
            remarks: 'Liquidated outstanding balances. Fully settled.'
          }
        ]
      },
      {
        id: "LOAN-EMP-092",
        applicantId: "EMP-092",
        applicantName: "Chloe Dupont",
        applicantType: 'Employee',
        phone: "+91 99350 44556",
        email: "c.dupont@apexbank.com",
        status: "Overdue",
        loanType: "Personal Loan",
        amount: 25000.00,
        interestRate: 4.80,
        duration: 12,
        emiAmount: 2200.00,
        remainingBalance: 12500.00,
        purpose: "Emergency Medical Contingency",
        requestedDate: "2025-06-18",
        requestedTime: "02:45:00 PM",
        riskScore: 35,
        creditScore: 680,
        incomeVerified: "Verified",
        complianceStatus: "Under Review",
        underwritingResult: "Awaiting subsequent installment compliance clearance",
        accountNumber: "AP-SAV-0921024",
        accountType: "Salary Account Link",
        accountBalance: 62450.00,
        linkedAccountNumber: "AP-LON-EMP-092",
        accountOpeningDate: "18 June 2021",
        branchId: "BR-LDN-02",
        branchName: "London Square Premium",
        branchCode: "BR-581",
        branchLocation: "London, UK",
        branchZone: "Western Europe Region",
        managerName: "Alistair Sterling",
        managerId: "EMP-0092",
        managerDesignation: "Branch Manager & Custodian",
        managerPhone: "+44 20 7946 0192",
        managerEmail: "a.sterling@apexbank.com",
        createdBy: "Sarah Jenkins",
        createdById: "EMP-001",
        createdByRole: "Senior Compliance Officer",
        submissionDate: "2025-06-18",
        submissionTime: "02:45:00 PM IST",
        approvedBy: "Alistair Sterling",
        approvedById: "EMP-0092",
        approvedByRole: "Branch Manager & Custodian",
        approvalDate: "2025-06-20",
        approvalTime: "04:30:00 PM IST",
        managerAuthorizationStatus: "Active Billing with Overdue notice triggered",
        managerAuthDate: "2025-06-20",
        managerAuthTime: "04:40:00 PM IST",
        transactions: [
          {
            id: "TXN-EMP-901",
            type: "Loan Disbursement",
            amount: 25000.00,
            date: "2025-06-21",
            time: "10:00 AM",
            status: "Success"
          },
          {
            id: "TXN-EMP-902",
            type: "EMI Deposit",
            amount: 2200.00,
            date: "12-Sep-2025",
            time: "09:30 AM",
            status: "Success"
          }
        ],
        timeline: [
          {
            event: 'Loan Application Submitted',
            date: '18-Jun-2025',
            time: '02:45:00 PM IST',
            responsible: 'Sarah Jenkins',
            remarks: 'Subsidized loan application uploaded.'
          },
          {
            event: 'Document Verification',
            date: '19-Jun-2025',
            time: '11:00:00 AM IST',
            responsible: 'Lending Office',
            remarks: 'Medical documents verified under emergency guidelines.'
          },
          {
            event: 'Branch Manager Approval',
            date: '20-Jun-2025',
            time: '04:30:00 PM IST',
            responsible: 'Alistair Sterling (EMP-0092)',
            remarks: 'Overrode local balance limit rules under staff protection bylaws.'
          },
          {
            event: 'Amount Disbursed',
            date: '21-Jun-2025',
            time: '10:00:00 AM IST',
            responsible: 'SWIFT Desk',
            remarks: 'Disbursed successfully.'
          },
          {
            event: 'EMI Payments Started',
            date: '21-Jul-2025',
            time: '09:00:00 AM IST',
            responsible: 'ACH Gateway',
            remarks: ' Compounding schedule commenced.'
          }
        ]
      }
    ];

    return [...customerMapped, ...employeeMapped];
  }, [loans, customers]);

  // Compute stats on the basis of dynamic database state
  const aggregatedStats = useMemo(() => {
    const totalIssued = combinedLoans
      .filter(l => l.status === 'Approved' || l.status === 'Closed')
      .reduce((sum, l) => sum + l.amount, 0);

    const pendingIssued = combinedLoans
      .filter(l => l.status === 'Pending')
      .reduce((sum, l) => sum + l.amount, 0);

    const meanRisk = combinedLoans.length > 0 
      ? (combinedLoans.reduce((sum, l) => sum + l.riskScore, 0) / combinedLoans.length) 
      : 0;

    return { totalIssued, pendingIssued, meanRisk };
  }, [combinedLoans]);

  // Active Loan selection lookup
  const activeLoanItem = useMemo(() => {
    return combinedLoans.find(item => item.id === selectedLoanId) || combinedLoans[0] || null;
  }, [combinedLoans, selectedLoanId]);

  // Combined search and filtering logic
  const filteredLoans = useMemo(() => {
    return combinedLoans.filter(l => {
      // 1. Applicant filters (Customer vs. Employee)
      if (applicantFilter !== 'All' && l.applicantType !== applicantFilter) {
        return false;
      }

      // 2. Loan Status filters (Approved, Pending, Closed, Overdue, etc.)
      if (loanStatusFilter !== 'All') {
        if (loanStatusFilter === 'Approved' && l.status !== 'Approved') return false;
        if (loanStatusFilter === 'Pending' && l.status !== 'Pending') return false;
        if (loanStatusFilter === 'Rejected' && l.status !== 'Rejected') return false;
        if (loanStatusFilter === 'Closed' && l.status !== 'Closed') return false;
        if (loanStatusFilter === 'Overdue' && l.status !== 'Overdue') return false;
      }

      // 3. Loan Type filters
      if (loanTypeFilter !== 'All' && l.loanType !== loanTypeFilter) {
        return false;
      }

      // 4. Searching
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        
        const matchesLoanId = l.id.toLowerCase().includes(query);
        const matchesApplicant = l.applicantName.toLowerCase().includes(query);
        const matchesAccount = l.accountNumber.toLowerCase().includes(query);
        const matchesPhone = l.phone.toLowerCase().includes(query);
        const matchesBranch = l.branchName.toLowerCase().includes(query);

        if (!matchesLoanId && !matchesApplicant && !matchesAccount && !matchesPhone && !matchesBranch) {
          return false;
        }
      }

      return true;
    });
  }, [combinedLoans, applicantFilter, loanStatusFilter, loanTypeFilter, searchQuery]);

  // Handle Action decisioning
  const handleDecision = (id: string, action: 'Approved' | 'Rejected') => {
    // 1. Update primitive loans array passed via props to retain full system synchronization
    const updatedLoans = loans.map(l => {
      if (l.id === id) {
        return { ...l, status: action };
      }
      return l;
    });

    if (setLoans) {
      setLoans(updatedLoans);
    }

    const tObj = combinedLoans.find(item => item.id === id);
    if (tObj) {
      // 2. Synchronize customer balance if approved
      if (action === 'Approved') {
        const updatedCustomers = customers.map(c => {
          if (c.id === tObj.applicantId) {
            return { ...c, balance: c.balance + tObj.amount };
          }
          return c;
        });
        setCustomers(updatedCustomers);

        // Inject transaction
        const disbursementTx: Transaction = {
          id: `TXN-DISB-${Math.floor(10000 + Math.random() * 90000)}`,
          customerId: tObj.applicantId,
          customerName: tObj.applicantName,
          amount: tObj.amount,
          type: 'Loan Disbursal',
          category: `Sovereign Disbursal: ${tObj.purpose}`,
          timestamp: new Date().toISOString(),
          status: 'Success',
          fraudRiskScore: tObj.riskScore,
          sourceBranchId: tObj.branchId
        };
        setTransactions([disbursementTx, ...transactions]);
      }

      addAuditLog(`Super Admin rendered decision on Loan [${id}] for ${tObj.applicantName} to status ${action.toUpperCase()}`, action === 'Approved' ? 'Info' : 'Warning');
      triggerFeedback(`Loan Program ${id} successfully decisioned: [${action.toUpperCase()}]`);
    }
  };

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(val);
  };

  return (
    <div id="loan-management-module-main" className="space-y-6">
      
      {/* Absolute Dynamic System toast */}
      {feedback && (
        <div id="toast-lending-notification" className="fixed bottom-5 right-5 z-50 p-4 rounded-xl border border-[#d4af37]/40 bg-[#060a28] shadow-2xl animate-bounce flex items-center gap-3 max-w-sm">
          <ShieldAlert className="text-[#d4af37] animate-pulse" size={18} />
          <div>
            <p className="text-[10px] font-mono text-[#d4af37] font-bold uppercase tracking-widest">Sovereign Credit Broadcast</p>
            <p className="text-xs text-white mt-0.5">{feedback}</p>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Overlay */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setConfirmAction(null);
            }}
            className="fixed inset-0 bg-black/35 backdrop-blur-[6px] z-[99999] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0a1135] border border-[#232d66] p-6 rounded-2xl max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-amber-400">
                <ShieldAlert size={28} />
                <h3 className="text-lg font-bold">Security Clearance Required</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                You are about to execute a Level 5 Super Admin override: <span className="text-white font-bold">{confirmAction.name}</span>. 
                This action will be permanently recorded in the immutable audit ledger.
              </p>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Abort
                </button>
                <button 
                  onClick={confirmAction.handler}
                  className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] cursor-pointer"
                >
                  Authorize
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Structured Credit KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-5 rounded-2xl border border-[#17235a]/60 bg-[#070c2e]/80 shadow-2xl relative">
          <div className="absolute top-2 right-4 text-emerald-500 opacity-20"><Coins size={36} /></div>
          <span className="text-amber-500 text-[9px] font-mono tracking-widest uppercase font-bold block">Aggregated Issuance</span>
          <h3 className="text-sm font-bold text-white mt-1">Outstanding Capital Disbursed</h3>
          <p className="text-2xl font-bold font-mono text-white mt-3">
            {formatUSD(aggregatedStats.totalIssued)}
          </p>
          <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
            <span className="text-emerald-400">● Live Ledger Linked</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-[#17235a]/60 bg-[#070c2e]/80 shadow-2xl relative">
          <div className="absolute top-2 right-4 text-[#d4af37] opacity-20"><Clock size={36} /></div>
          <span className="text-blue-400 text-[9px] font-mono tracking-widest uppercase font-bold block">Appraisal Pipeline</span>
          <h3 className="text-sm font-bold text-white mt-1">Pending Application Capital</h3>
          <p className="text-2xl font-bold font-mono text-white mt-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
            {formatUSD(aggregatedStats.pendingIssued)}
          </p>
          <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
            <span className="text-amber-500 animate-pulse">● Risk Analysis Running</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-[#17235a]/60 bg-[#070c2e]/80 shadow-2xl relative">
          <div className="absolute top-2 right-4 text-rose-500 opacity-20"><AlertTriangle size={36} /></div>
          <span className="text-rose-500 text-[9px] font-mono tracking-widest uppercase font-bold block">Threat metrics</span>
          <h3 className="text-sm font-bold text-white mt-1">Avg Structural Portfolio Risk</h3>
          <p className="text-2xl font-bold font-mono text-rose-400 mt-3">
            {aggregatedStats.meanRisk.toFixed(1)}% Score
          </p>
          <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
            <span className="text-rose-400">● Compliance limit: 45.0%</span>
          </div>
        </div>

      </div>

      {/* Main Ledger & Context Sideboard workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ledger area */}
        <div className="lg:col-span-2 p-3 sm:p-5 lg:p-6 rounded-2xl border border-[#17235a]/60 bg-[#070c2e]/80 shadow-2xl space-y-5">
          
          {/* Header & searching */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Credit Allocation Ledger</h3>
              <p className="text-[#556994] text-xs">Authorize, audit, and analyze sovereign lending schemes globally.</p>
            </div>

            <div className="relative max-w-sm w-full">
              <input
                id="loan-search-input"
                type="text"
                placeholder="Search Loan ID, Name, Account, Phone, Branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#04081c] border border-[#141b44] focus:border-amber-500 text-xs px-3.5 py-2 pl-9 rounded-xl text-white outline-none placeholder-slate-500 transition-all font-sans"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
            </div>
          </div>

          {/* New Segment Filter Controller Buttons */}
          <div id="credit-filter-grid" className="p-4 rounded-xl border border-[#141b44] bg-[#04081c]/70 space-y-3">
            
            {/* ROW 1: Applicant Filters (Customers / Employees) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-500 tracking-wider w-28">Applicant Level:</span>
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'Customer', 'Employee'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setApplicantFilter(f)}
                    className={`px-3 py-1 text-[10px] rounded-lg border font-mono font-bold transition-all ${
                      applicantFilter === f 
                        ? 'bg-amber-500/20 text-[#d4af37] border-amber-500/50' 
                        : 'bg-[#060a24]/80 text-slate-400 border-[#141c48] hover:border-slate-700 hover:text-slate-250'
                    }`}
                  >
                    {f === 'All' ? 'All Applicants' : f === 'Customer' ? 'Customers' : 'Employees'}
                  </button>
                ))}
              </div>
            </div>

            {/* ROW 2: Loan Status Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold text-blue-400 tracking-wider w-28">Lending Status:</span>
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'Approved', 'Pending', 'Rejected', 'Closed', 'Overdue'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setLoanStatusFilter(s)}
                    className={`px-3 py-1 text-[10px] rounded-lg border font-mono font-bold transition-all ${
                      loanStatusFilter === s 
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' 
                        : 'bg-[#060a24]/80 text-slate-400 border-[#141c48] hover:border-slate-700 hover:text-slate-250'
                    }`}
                  >
                    {s === 'All' ? 'All Loans' : s}
                  </button>
                ))}
              </div>
            </div>

            {/* ROW 3: Loan Type Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider w-28">Category Schema:</span>
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'Personal Loan', 'Home Loan', 'Vehicle Loan', 'Education Loan', 'Business Loan', 'Corporate Loan', 'Gold Loan'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setLoanTypeFilter(t)}
                    className={`px-3 py-1 text-[10px] rounded-lg border font-mono font-semibold transition-all ${
                      loanTypeFilter === t 
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50' 
                        : 'bg-[#060a24]/80 text-slate-400 border-[#141c48] hover:border-slate-700 hover:text-slate-250'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Table representing filtered data */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#141c48] text-[9px] text-[#8496bf] font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Loan ID</th>
                  <th className="py-3 px-3">Applicant details</th>
                  <th className="py-3 px-3">Classification Type</th>
                  <th className="py-3 px-3">Capital Asset Limit</th>
                  <th className="py-3 px-3 text-center">Score Risk</th>
                  <th className="py-3 px-3 text-right">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141c48]">
                {filteredLoans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-xs text-slate-500">
                      No loan records correspond to the requested structural filters.
                    </td>
                  </tr>
                ) : (
                  filteredLoans.map((l) => {
                    const isSelected = selectedLoanId === l.id;
                    return (
                      <tr
                        id={`loan-row-${l.id}`}
                        key={l.id}
                        onClick={() => setSelectedLoanId(l.id)}
                        className={`text-xs hover:bg-[#121c4b]/50 transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#152361]/60 border-l-2 border-amber-500' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-slate-300">{l.id}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            {l.applicantName}
                            <span className={`px-1 rounded text-[8px] font-mono leading-none ${
                              l.applicantType === 'Employee' 
                                ? 'bg-blue-500/20 text-blue-300' 
                                : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {l.applicantType === 'Employee' ? 'Staff' : 'Client'}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#556994] font-mono lowercase block truncate w-48">{l.purpose}</span>
                        </td>
                        <td className="py-3 px-3 text-indigo-300 font-mono font-medium">{l.loanType}</td>
                        <td className="py-3 px-3 font-mono font-semibold text-white">
                          {formatUSD(l.amount)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded font-bold font-mono ${
                            l.riskScore > 75 
                              ? 'bg-rose-500/15 text-rose-400' 
                              : l.riskScore > 40
                                ? 'bg-amber-500/15 text-amber-400'
                                : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {l.riskScore}%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            l.status === 'Approved' 
                              ? 'bg-emerald-500/15 text-emerald-400' 
                              : l.status === 'Pending'
                                ? 'bg-amber-500/15 text-amber-500 animate-pulse'
                                : l.status === 'Closed'
                                  ? 'bg-slate-700 text-slate-300'
                                  : l.status === 'Overdue'
                                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                    : 'bg-rose-500/15 text-rose-400'
                          }`}>
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Dynamic Context Profile Side Panel */}
        <div id="loan-secure-details-box" className="rounded-2xl border border-[#17235a]/60 bg-[#070c2e]/80 shadow-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between relative overflow-y-auto max-h-[1200px] scrollbar-thin">
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          
          {activeLoanItem ? (
            <div className="space-y-6">
              
              {/* Header profile info */}
              <div className="flex items-center gap-4 border-b border-[#141b44] pb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#d4af37]/30 to-indigo-600/40 border-2 border-[#d4af37] flex items-center justify-center font-bold text-white shadow-lg text-lg">
                  {activeLoanItem.applicantName.split(' ')[0][0]}{activeLoanItem.applicantName.split(' ').slice(-1)[0][0] || ''}
                </div>
                <div>
                  <span className="text-[9px] font-mono text-amber-500 font-bold uppercase tracking-widest block">Audit profile gate</span>
                  <h4 className="text-md font-bold text-white leading-tight">{activeLoanItem.applicantName}</h4>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">{activeLoanItem.applicantType} Profile ID: {activeLoanItem.applicantId}</p>
                </div>
              </div>

              {/* 1. Applicant Information */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8496bf] font-bold">1. Applicant Profile Overview</p>
                <div className="p-3.5 rounded-xl border border-[#141b44] bg-[#04081c]/60 space-y-2 text-xs w-full max-w-full box-border h-auto min-h-max animate-fade-in">
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Application Name:</span>
                    <span className="w-[65%] text-white font-semibold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.applicantName}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-mono font-semibold text-left flex-shrink-0 select-none">Reference Code:</span>
                    <span className="w-[65%] text-white font-mono font-medium text-left break-all [word-break:break-all] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.applicantId}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-mono font-semibold text-left flex-shrink-0 select-none">Mobile Number:</span>
                    <span className="w-[65%] text-slate-300 font-mono text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.phone}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-mono font-semibold text-left flex-shrink-0 select-none">Official Email:</span>
                    <span className="w-[65%] text-slate-300 text-[11px] font-mono text-left break-all [word-break:break-word] [overflow-wrap:break-word] whitespace-normal" title={activeLoanItem.email}>{activeLoanItem.email}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Designation Role:</span>
                    <span className="w-[65%] text-indigo-400 font-mono text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.applicantType} Account</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Applicant status:</span>
                    <div className="w-[65%] text-left">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-sans font-bold bg-emerald-500/10 text-emerald-400">Active Clear</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Loan Information */}
              <div className="space-y-2 font-sans">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8496bf] font-bold">2. Loan Information Ledger</p>
                <div className="p-3.5 rounded-xl border border-[#141b44] bg-[#04081c]/60 space-y-2 text-xs w-full max-w-full box-border h-auto min-h-max">
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Lending ID:</span>
                    <span className="w-[65%] text-white font-mono font-bold text-left break-all [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.id}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-mono font-semibold text-left flex-shrink-0 select-none">Lending Type:</span>
                    <span className="w-[65%] text-[#d4af37] font-bold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.loanType}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Asset Amount:</span>
                    <span className="w-[65%] text-white font-mono font-black text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{formatUSD(activeLoanItem.amount)}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-mono font-semibold text-left flex-shrink-0 select-none">Interest APR Rate:</span>
                    <span className="w-[65%] text-indigo-400 font-mono font-bold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.interestRate}% APR Yield</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Amortization Tenure:</span>
                    <span className="w-[65%] text-slate-300 font-mono text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.duration} Months</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5 border-t border-[#141b44]/55 pt-2 mt-2">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Monthly EMI Payment:</span>
                    <span className="w-[65%] text-[#10b981] font-mono font-bold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{formatUSD(activeLoanItem.emiAmount)}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Outstanding Debt Balance:</span>
                    <span className="w-[65%] text-orange-400 font-mono font-extrabold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{formatUSD(activeLoanItem.remainingBalance)}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Sovereign State:</span>
                    <div className="w-[65%] text-left">
                      <span className={`inline-block px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                        activeLoanItem.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : activeLoanItem.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-400'
                      }`}>{activeLoanItem.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Account Information */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8496bf] font-bold">3. Account Link Connection</p>
                <div className="p-3.5 rounded-xl border border-[#141b44] bg-[#04081c]/60 space-y-2 text-xs w-full max-w-full box-border h-auto min-h-max">
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Linked Account Number:</span>
                    <span className="w-[65%] text-white font-mono font-semibold text-left break-all [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.accountNumber}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-mono font-semibold text-left flex-shrink-0 select-none">Linked Type:</span>
                    <span className="w-[65%] text-slate-300 text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.accountType}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Linked Account Balance:</span>
                    <span className="w-[65%] text-emerald-400 font-mono font-bold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{formatUSD(activeLoanItem.accountBalance)}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Linked Opening Date:</span>
                    <span className="w-[65%] text-slate-300 font-mono text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.accountOpeningDate}</span>
                  </div>
                </div>
              </div>

              {/* 4. Branch Information */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8496bf] font-bold">4. Regional Branch Anchor</p>
                <div className="p-3.5 rounded-xl border border-[#141b44] bg-[#04081c]/60 space-y-2 text-xs w-full max-w-full box-border h-auto min-h-max">
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Branch Name:</span>
                    <span className="w-[65%] text-white font-semibold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.branchName}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-mono font-semibold text-left flex-shrink-0 select-none">Branch Code ID:</span>
                    <span className="w-[65%] text-amber-500 font-mono font-bold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.branchCode}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Location Coordinate:</span>
                    <span className="w-[65%] text-slate-300 font-mono text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.branchLocation}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-mono font-semibold text-left flex-shrink-0 select-none">Regional Zone:</span>
                    <span className="w-[65%] text-indigo-400 font-mono text-[10px] text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.branchZone}</span>
                  </div>
                </div>
              </div>

              {/* 5. Branch Manager Information */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8496bf] font-bold">5. Regional Custodial manager</p>
                <div className="p-3.5 rounded-xl border border-[#141b44] bg-[#04081c]/60 space-y-2 text-xs w-full max-w-full box-border h-auto min-h-max">
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Branch Manager:</span>
                    <span className="w-[65%] text-white font-semibold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.managerName}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-mono font-semibold text-left flex-shrink-0 select-none">Manager Employee ID:</span>
                    <span className="w-[65%] text-slate-300 font-mono text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.managerId}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Designation Class:</span>
                    <span className="w-[65%] text-indigo-400 text-[11px] font-mono font-semibold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.managerDesignation}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Mobile Number:</span>
                    <span className="w-[65%] text-slate-300 font-mono text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.managerPhone}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Official Email:</span>
                    <span className="w-[65%] text-slate-300 text-[10px] font-mono text-left break-all [word-break:break-word] [overflow-wrap:break-word] whitespace-normal" title={activeLoanItem.managerEmail}>{activeLoanItem.managerEmail}</span>
                  </div>
                </div>
              </div>

              {/* 6. Loan Processing Information */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8496bf] font-bold">6. Intraday Creation Audit</p>
                <div className="p-3.5 rounded-xl border border-[#141b44] bg-[#04081c]/60 space-y-2.5 text-xs w-full max-w-full box-border h-auto min-h-max">
                  <div className="flex items-start w-full gap-2 py-0.5 border-b border-[#141b44]/55 pb-1.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Lending Officer:</span>
                    <div className="w-[65%] text-left">
                      <span className="text-white font-bold block">{activeLoanItem.createdBy}</span>
                      <span className="text-[10px] font-mono text-slate-400 block break-words [word-break:break-word] [overflow-wrap:break-word]">{activeLoanItem.createdByRole} ({activeLoanItem.createdById})</span>
                    </div>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Submission Date & Time:</span>
                    <span className="w-[65%] text-[#d4af37] font-mono block font-bold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.submissionDate} at {activeLoanItem.submissionTime}</span>
                  </div>
                </div>
              </div>

              {/* 7. Loan Approval Information */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8496bf] font-bold">7. Sovereign Signatory Clearance</p>
                <div className="p-3.5 rounded-xl border border-[#141b44] bg-[#04081c]/60 space-y-2.5 text-xs w-full max-w-full box-border h-auto min-h-max">
                  <div className="flex items-start w-full gap-2 py-0.5 border-b border-[#141b44]/55 pb-1.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Clearing Officer:</span>
                    <div className="w-[65%] text-left">
                      <span className="text-white font-bold block">{activeLoanItem.approvedBy}</span>
                      <span className="text-[10px] font-mono text-slate-400 block break-words [word-break:break-word] [overflow-wrap:break-word]">{activeLoanItem.approvedByRole} ({activeLoanItem.approvedById})</span>
                    </div>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5 border-b border-[#141b44]/55 pb-1.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Approval Date & Time:</span>
                    <span className="w-[65%] text-white font-mono block font-bold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.approvalDate} at {activeLoanItem.approvalTime}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Authorization Code:</span>
                    <div className="w-[65%] text-left">
                      <span className="text-[#10b981] font-mono font-bold block break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.managerAuthorizationStatus}</span>
                      <span className="text-[10px] font-mono text-slate-400 block break-words [word-break:break-all] [overflow-wrap:break-word] mt-0.5">SEC-DIR-1-HYD-{activeLoanItem.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8. Credit Risk Assessment */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8496bf] font-bold">8. Credit Risk Underwriting</p>
                <div className="p-3.5 rounded-xl border border-[#141b44] bg-[#04081c]/60 space-y-2.5 text-xs w-full max-w-full box-border h-auto min-h-max">
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Credit Score:</span>
                    <span className="w-[65%] text-emerald-400 font-mono font-black text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.creditScore} FICO</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">Income Verification:</span>
                    <span className="w-[65%] text-indigo-400 font-mono font-bold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.incomeVerified}</span>
                  </div>
                  <div className="flex items-start w-full gap-2 py-0.5">
                    <span className="w-[35%] text-slate-400 font-semibold text-left flex-shrink-0 select-none">AML Match Status:</span>
                    <span className="w-[65%] text-emerald-400 font-mono font-bold text-left break-words [word-break:break-word] [overflow-wrap:break-word] whitespace-normal">{activeLoanItem.complianceStatus}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="space-y-1.5 border-t border-[#141b44]/55 pt-2 mt-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Portfolio Default Risk:</span>
                      <span className="font-mono text-amber-500 font-bold">{activeLoanItem.riskScore}%</span>
                    </div>
                    <div className="w-full bg-[#11163b] h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          activeLoanItem.riskScore > 75 
                            ? 'bg-rose-500' 
                            : activeLoanItem.riskScore > 45 
                              ? 'bg-amber-500' 
                              : 'bg-emerald-500'
                        }`}
                        style={{ width: `${activeLoanItem.riskScore}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[10px] italic text-[#8496bf] leading-relaxed text-center mt-1 break-words [word-break:break-word] [overflow-wrap:break-word]">
                    Risk Assessment: {activeLoanItem.underwritingResult}
                  </p>
                </div>
              </div>

              {/* 9. Loan Transaction History Table */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8496bf] font-bold">9. Lending Ledger Transactions</p>
                <div className="overflow-x-auto p-3.5 rounded-xl border border-[#141b44] bg-[#04081c]/60">
                  <table className="w-full text-left text-[11px] border-collapse font-sans">
                    <thead>
                      <tr className="border-b border-[#141c48] text-[9px] text-[#8496bf] uppercase font-bold tracking-wider">
                        <th className="py-1.5 px-2">TXN ID</th>
                        <th className="py-1.5 px-2">Type</th>
                        <th className="py-1.5 px-2 text-right">Value</th>
                        <th className="py-1.5 px-2 text-center">Date</th>
                        <th className="py-1.5 px-2 text-right">State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#141c48]/60 text-slate-300">
                      {activeLoanItem.transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-800/40">
                          <td className="py-2 px-2 font-mono font-bold text-slate-400">{tx.id}</td>
                          <td className="py-2 px-2 font-mono">{tx.type}</td>
                          <td className="py-2 px-2 text-right font-mono text-white">{formatUSD(tx.amount)}</td>
                          <td className="py-2 px-2 text-center font-mono opacity-80">{tx.date}</td>
                          <td className="py-2 px-2 text-right font-mono font-bold text-emerald-400">{tx.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 10. Loan Timeline */}
              <div className="space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8496bf] font-bold">10. Credit Lifecycle Timeline</p>
                
                <div className="relative border-l-2 border-[#17235a] ml-2.5 pl-4 space-y-4">
                  {activeLoanItem.timeline.map((evt, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-[#0d153a]" />
                      <div className="text-xs">
                        <div className="font-bold text-white">{evt.event}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{evt.date} at {evt.time}</div>
                        <div className="text-slate-300 text-[10px] mt-0.5">Clearing officer: {evt.responsible}</div>
                        <div className="text-slate-400 text-[9px] italic mt-1 leading-relaxed">"{evt.remarks}"</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 11. Decisions Decision cockpit Action Area */}
              {activeLoanItem.status === 'Pending' && (
                <div className="pt-4 border-t border-[#141b44] space-y-3">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Render Underwriting Verdict</p>
                  <div className="grid grid-cols-2 gap-3.5">
                    <button
                      id="apex-reject-verdict-btn"
                      onClick={() => handleDecision(activeLoanItem.id, 'Rejected')}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/15 text-rose-100 hover:bg-rose-500/30 text-xs font-bold uppercase cursor-pointer transition-all"
                    >
                      <XCircle size={14} />
                      <span>Reject Application</span>
                    </button>

                    <button
                      id="apex-approve-verdict-btn"
                      onClick={() => handleDecision(activeLoanItem.id, 'Approved')}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/35 text-xs font-bold uppercase cursor-pointer transition-all"
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve Capital</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 12. Super Admin Actions List */}
              <div className="space-y-2 border-t border-[#141b44] pt-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8496bf] font-bold">Super Admin Clearance Console</p>
                <div id="super-admin-action-block-lending" className="grid grid-cols-2 gap-2 mt-2">
                  
                  <button
                    id="sa-view-file"
                    onClick={() => handleActionClick("View Loan Application", `Super Admin accessed electronic lending record ${activeLoanItem.id}`)}
                    disabled={loadingAction === "View Loan Application"}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-[#0e1744] hover:bg-[#15225c] border border-[#1b2a6f] text-[10px] text-white font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingAction === "View Loan Application" ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FileText size={12} className="text-blue-400" />}
                    <span>View Loan File</span>
                  </button>

                  <button
                    id="sa-view-linked"
                    onClick={() => handleActionClick("Auditing Linked Account", `Super Admin audited primary account linked to loan ${activeLoanItem.id}`, 'accounts')}
                    disabled={loadingAction === "Auditing Linked Account"}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-[#0e1744] hover:bg-[#15225c] border border-[#1b2a6f] text-[10px] text-white font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingAction === "Auditing Linked Account" ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Activity size={12} className="text-emerald-400" />}
                    <span>Linked Account</span>
                  </button>

                  <button
                    id="sa-view-tx-hist"
                    onClick={() => handleActionClick("Transaction Log Diagnostic", `Super Admin ran comprehensive transactions log diagnostic for ${activeLoanItem.id}`, 'transactions')}
                    disabled={loadingAction === "Transaction Log Diagnostic"}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-[#0e1744] hover:bg-[#15225c] border border-[#1b2a6f] text-[10px] text-white font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingAction === "Transaction Log Diagnostic" ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Coins size={12} className="text-[#d4af37]" />}
                    <span>View Transactions</span>
                  </button>

                  <button
                    id="sa-contact-manager"
                    type="button"
                    onClick={() => handleActionClick("Contact Branch Manager", `Super Admin initiated call to branch manager for loan ${activeLoanItem.id}`, undefined, true)}
                    disabled={loadingAction === "Contact Branch Manager"}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-[#0e1744] hover:bg-[#15225c] border border-[#1b2a6f] text-[10px] text-white font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingAction === "Contact Branch Manager" ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Phone size={12} className="text-amber-500" />}
                    <span>Contact Manager</span>
                  </button>

                  <button
                    id="sa-email-manager"
                    onClick={() => handleActionClick("Email Branch Manager", `Super Admin initiated email composer for branch manager: ${activeLoanItem.managerEmail}`, undefined, true)}
                    disabled={loadingAction === "Email Branch Manager"}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-[#0e1744] hover:bg-[#15225c] border border-[#1b2a6f] text-[10px] text-white font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingAction === "Email Branch Manager" ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Mail size={12} className="text-blue-400" />}
                    <span>Email Manager</span>
                  </button>

                  <button
                    id="sa-contact-officer"
                    onClick={() => handleActionClick("Contact Credit Officer", `Super Admin established bridge with loan initiator: ${activeLoanItem.createdBy}`, undefined, true)}
                    disabled={loadingAction === "Contact Credit Officer"}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-[#0e1744] hover:bg-[#15225c] border border-[#1b2a6f] text-[10px] text-white font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingAction === "Contact Credit Officer" ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <UserCheck size={12} className="text-indigo-400" />}
                    <span>Contact Officer</span>
                  </button>

                  <button
                    id="sa-contact-approver"
                    onClick={() => handleActionClick("Contact Approval Authority", `Super Admin pinged lending board approver: ${activeLoanItem.approvedBy}`, undefined, true)}
                    disabled={loadingAction === "Contact Approval Authority"}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-[#0e1744] hover:bg-[#15225c] border border-[#1b2a6f] text-[10px] text-white font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingAction === "Contact Approval Authority" ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <ShieldCheck size={12} className="text-emerald-500" />}
                    <span>Contact Approver</span>
                  </button>

                  <button
                    id="sa-download-rep"
                    onClick={() => handleActionClick("Download Sovereign Certificate", `Super Admin downloaded sovereign report dataset for loan ${activeLoanItem.id}`, undefined, true)}
                    disabled={loadingAction === "Download Sovereign Certificate"}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-[#0e1744] hover:bg-[#15225c] border border-[#1b2a6f] text-[10px] text-white font-bold transition-all cursor-pointer col-span-2 disabled:opacity-50"
                  >
                    {loadingAction === "Download Sovereign Certificate" ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Download size={12} className="text-sky-400" />}
                    <span>Download Sovereign Credit Certificate</span>
                  </button>

                </div>
              </div>

            </div>
          ) : (
            <div className="py-24 text-center text-xs text-[#556994] font-mono">
              Select an outstanding credit file from the Ledger to begin deep audit verification.
            </div>
          )}

          <div className="text-[9px] text-[#556994] font-mono mt-5 pt-3 border-t border-[#141b44]/65">
            Sovereign Ledger assets are fully governed under international banking reserve policies. Authorization DIR-99-A active.
          </div>

        </div>

      </div>

    </div>
  );
}
