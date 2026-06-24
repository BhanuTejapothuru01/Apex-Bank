import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Download, ShieldCheck, RefreshCw } from 'lucide-react';
import { TransactionItem } from '../types';

interface TransactionsViewProps {
  transactions: TransactionItem[];
  userName: string;
  onSelectCustomerByName?: (name: string) => void;
}

export default function TransactionsView({ transactions, userName, onSelectCustomerByName }: TransactionsViewProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Pending' | 'Flagged' | 'Blocked'>('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = transactions.filter(tx => {
    const matchesSearch = 
      tx.sender.toLowerCase().includes(search.toLowerCase()) ||
      tx.recipient.toLowerCase().includes(search.toLowerCase()) ||
      tx.reference.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || tx.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleExportCSV = () => {
    alert('Generating secure transaction audit file... Downloading CSV to storage...');
  };

  return (
    <div id="transactions-view-root" className="space-y-6">
      
      {/* Search and Filters Hub */}
      <div className="bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-base font-bold font-sans text-gray-900">System Transaction Ledger</h3>
            <p className="text-[11px] text-gray-400 font-sans mt-0.5">
              Securely monitor and audit all incoming and outgoing capital movements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3_5 py-2 bg-[#24142F] hover:bg-[#351b44] text-white text-xs font-sans font-bold rounded-xl flex items-center gap-1.5 transition-all outline-none"
            >
              <Download className="w-4 h-4" />
              EXPORT CSV
            </button>
          </div>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reference, recipient or sender..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-pink-200 outline-none rounded-xl text-xs font-sans focus:ring-1 focus:ring-pink-500 background bg-pink-50/10"
            />
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400 font-mono uppercase mr-1.5 font-semibold">STATUS:</span>
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="flex-1 bg-pink-50 border border-pink-200 text-[#24142F] outline-none px-2.5 py-1.5 rounded-xl font-sans text-xs font-medium"
            >
              <option value="All">All statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Flagged">Flagged</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400 font-mono uppercase mr-1.5 font-semibold">CATEGORY:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 bg-pink-50 border border-pink-200 text-[#24142F] outline-none px-2.5 py-1.5 rounded-xl font-sans text-xs font-medium"
            >
              <option value="All">All categories</option>
              <option value="Utility">Utility</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Rent">Rent</option>
              <option value="Salary">Salary</option>
              <option value="Stripe">Stripe</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-3xl border border-pink-500/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-50/50 border-b border-pink-100 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-5">Reference</th>
                <th className="py-3 px-5">Intermediaries</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Date/Time</th>
                <th className="py-3 px-5 text-right">Volume</th>
                <th className="py-3 px-5 text-center">Security Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-500/5 text-xs">
              {filtered.map((tx) => {
                const isSentByMe = tx.sender.includes(userName) || tx.sender.includes('Andrew Forbist');
                return (
                  <tr key={tx.id} className="hover:bg-pink-50/30 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-gray-400 font-semibold">
                      {tx.reference}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-md shrink-0 ${
                          isSentByMe ? 'bg-pink-100 text-pink-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {isSentByMe ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <p 
                            onClick={() => onSelectCustomerByName?.(tx.sender)}
                            className={`font-sans font-bold text-[#24142F] ${onSelectCustomerByName ? 'hover:underline hover:text-pink-600 cursor-pointer' : ''}`}
                            title={onSelectCustomerByName ? "Click to view customer details" : undefined}
                          >
                            {tx.sender}
                          </p>
                          <span className="text-[10px] text-gray-500 font-sans">
                            to <span 
                              onClick={() => onSelectCustomerByName?.(tx.recipient)}
                              className={`${onSelectCustomerByName ? 'hover:underline hover:text-pink-600 cursor-pointer font-semibold' : ''}`}
                              title={onSelectCustomerByName ? "Click to view recipient details" : undefined}
                            >{tx.recipient}</span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-mono text-gray-500 uppercase text-[10px] bg-gray-100 px-2 py-0.5 rounded-md">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-gray-500">
                      {tx.date} · {tx.time}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-[#24142F]">
                      {isSentByMe ? '-' : '+'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                        tx.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tx.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : tx.status === 'Flagged'
                          ? 'bg-purple-100 text-purple-800 animate-pulse'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 font-sans">
                    No matching systemic transaction records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
