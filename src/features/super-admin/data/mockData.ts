import { Customer, Employee, Branch, Transaction, Loan, CreditCard, AuditLog, Ticket, Task, FixedDeposit } from '../types/dashboard';

/** Offline fallbacks — live data comes from Supabase */
export const INITIAL_CUSTOMERS: Customer[] = [];
export const INITIAL_EMPLOYEES: Employee[] = [];
export const INITIAL_BRANCHES: Branch[] = [];
export const INITIAL_TRANSACTIONS: Transaction[] = [];
export const INITIAL_LOANS: Loan[] = [];
export const INITIAL_CARDS: CreditCard[] = [];
export const INITIAL_FD: FixedDeposit[] = [];
export const INITIAL_AUDIT: AuditLog[] = [];
export const INITIAL_TICKETS: Ticket[] = [];
export const INITIAL_TASKS: Task[] = [];
