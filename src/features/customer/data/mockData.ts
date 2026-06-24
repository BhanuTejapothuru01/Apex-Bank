import { Transaction, Card, SavingVault, UserWealthState } from '../types';

/** Offline fallbacks — live data comes from Supabase */
export const INITIAL_WEALTH: UserWealthState = {
  balance: 0,
  income: 0,
  expenses: 0,
  savingsRate: 0,
};

export const INITIAL_CARDS: Card[] = [];
export const INITIAL_SAVINGS_VAULTS: SavingVault[] = [];
export const INITIAL_TRANSACTIONS: Transaction[] = [];
