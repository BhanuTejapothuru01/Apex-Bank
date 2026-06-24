import { Transaction, StatCard, CashflowItem, ActivityLog, SavingTarget } from './types';

/** Offline fallbacks — live data comes from Supabase when connected */
export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tx-adm-1', name: 'Payroll Disbursement', type: 'Expense', date: '2026-06-12 09:00:00', amount: 42000, recipient: 'Operations Team', status: 'Completed', iconName: 'ReceiptText' },
  { id: 'tx-adm-2', name: 'Treasury Deposit', type: 'Income', date: '2026-06-11 14:30:00', amount: 85000, recipient: 'Apex Holdings', status: 'Completed', iconName: 'TrendingUp' },
  { id: 'tx-adm-3', name: 'Loan Servicing Fee', type: 'Income', date: '2026-06-10 11:15:00', amount: 3200, recipient: 'Marcus Vance', status: 'Completed', iconName: 'TrendingUp' },
];

export const STATS: StatCard[] = [
  { id: 'stat-income', title: 'Total Income', value: '$128,400', change: '+12.4%', isPositive: true, type: 'income' },
  { id: 'stat-loans', title: 'Active Loans', value: '$43,000', change: '-2.1%', isPositive: false, type: 'loans' },
  { id: 'stat-deposits', title: 'Total Deposits', value: '$562,000', change: '+8.7%', isPositive: true, type: 'deposits' },
];

export const CASHFLOW_DATA: CashflowItem[] = [
  { month: 'Jan', income: 6200, expense: 4100 },
  { month: 'Feb', income: 5800, expense: 3900 },
  { month: 'Mar', income: 7100, expense: 4500 },
  { month: 'Apr', income: 6800, expense: 4200 },
  { month: 'May', income: 7400, expense: 4800 },
  { month: 'Jun', income: 8200, expense: 5100 },
  { month: 'Jul', income: 7900, expense: 4900 },
  { month: 'Aug', income: 7600, expense: 4700 },
  { month: 'Sep', income: 8100, expense: 5000 },
  { month: 'Oct', income: 8500, expense: 5200 },
  { month: 'Nov', income: 8800, expense: 5400 },
  { month: 'Dec', income: 9200, expense: 5600 },
];

export const ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    user: { name: 'Andrew Forbist', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150', initials: 'AF' },
    action: 'Approved loan application LN-2026-089A',
    time: '10:15 AM',
    group: 'Today',
  },
  {
    id: 'log-2',
    user: { name: 'Rebecca Adler', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', initials: 'RA' },
    action: 'Updated fraud rule: velocity check enabled',
    time: '9:42 AM',
    group: 'Today',
  },
  {
    id: 'log-3',
    user: { name: 'System', avatarUrl: '', initials: 'SY' },
    action: 'Treasury sync completed — balance $562,000',
    time: '8:00 AM',
    group: 'Today',
  },
  {
    id: 'log-4',
    user: { name: 'Devon Miller', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150', initials: 'DM' },
    action: 'Flagged transaction TXN-98218 for review',
    time: '6:30 PM',
    group: 'Yesterday',
  },
];

export const SAVING_TARGETS: SavingTarget[] = [
  { id: 'target-loans', name: 'Loans', current: 43000, target: 100000, percentage: 43, color: '#a855f7' },
  { id: 'target-deposits', name: 'Deposits', current: 56000, target: 120000, percentage: 46.67, color: '#ec4899' },
];

export const EXPENSE_CATEGORIES = [
  { name: 'Payroll', value: 35, color: '#ec4899', amount: 3500, percentage: 35 },
  { name: 'Operations', value: 25, color: '#a855f7', amount: 2500, percentage: 25 },
  { name: 'Marketing', value: 15, color: '#6366f1', amount: 1500, percentage: 15 },
  { name: 'Infrastructure', value: 12, color: '#14b8a6', amount: 1200, percentage: 12 },
  { name: 'Compliance', value: 8, color: '#f59e0b', amount: 800, percentage: 8 },
  { name: 'Other', value: 5, color: '#64748b', amount: 500, percentage: 5 },
];
