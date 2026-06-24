/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  category: 'Fashion' | 'Dining' | 'Utilities' | 'Tech' | 'Health' | 'Salary' | 'Transfer' | 'Investments' | 'Other';
  tag: string;
  date: string;
  status: 'completed' | 'pending' | 'flagged' | 'failed';
  type: 'expense' | 'income';
  notes?: string;
}

export interface Card {
  id: string;
  cardholder: string;
  last4: string;
  expiry: string;
  network: 'Visa' | 'Mastercard';
  isVirtual: boolean;
  isFrozen: boolean;
  dailyLimit: number;
  contactlessEnabled: boolean;
  colorType: 'classic-pink' | 'blush-gradient' | 'minimal-rose';
  cardType?: string;
  creditScore?: number;
}

export interface SavingVault {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
}

export interface AdvisorMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface UserWealthState {
  balance: number;
  income: number;
  expenses: number;
  savingsRate: number;
}
