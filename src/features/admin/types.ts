export interface Transaction {
  id: string;
  name: string;
  type: 'Income' | 'Expense';
  date: string;
  amount: number;
  recipient: string;
  status: 'Completed' | 'Pending' | 'Failed';
  iconName?: string;
}

export interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  type: 'income' | 'loans' | 'deposits';
}

export interface CashflowItem {
  month: string;
  income: number;
  expense: number;
}

export interface ActivityLog {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
    initials: string;
  };
  action: string;
  time: string;
  group: 'Today' | 'Yesterday';
}

export interface SavingTarget {
  id: string;
  name: string;
  current: number;
  target: number;
  percentage: number;
  color: string;
}
