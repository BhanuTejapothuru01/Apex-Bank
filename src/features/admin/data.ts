import { Transaction, StatCard, CashflowItem, ActivityLog, SavingTarget } from './types';

/** Offline fallbacks — live data comes from Supabase */
export const INITIAL_TRANSACTIONS: Transaction[] = [];
export const STATS: StatCard[] = [];
export const CASHFLOW_DATA: CashflowItem[] = [];
export const ACTIVITY_LOGS: ActivityLog[] = [];
export const SAVING_TARGETS: SavingTarget[] = [];

export const EXPENSE_CATEGORIES = [
  { name: 'Payroll', value: 35, color: '#ec4899', amount: 3500, percentage: 35 },
  { name: 'Operations', value: 25, color: '#a855f7', amount: 2500, percentage: 25 },
  { name: 'Marketing', value: 15, color: '#6366f1', amount: 1500, percentage: 15 },
  { name: 'Infrastructure', value: 12, color: '#14b8a6', amount: 1200, percentage: 12 },
  { name: 'Compliance', value: 8, color: '#f59e0b', amount: 800, percentage: 8 },
  { name: 'Other', value: 5, color: '#64748b', amount: 500, percentage: 5 },
];
