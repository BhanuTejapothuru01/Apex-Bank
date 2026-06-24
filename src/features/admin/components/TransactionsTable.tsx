import { useState } from 'react';
import { Search, ArrowUpDown, Filter, Trash2, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction } from '../types';

interface TransactionsTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  globalSearchQuery?: string;
}

export default function TransactionsTable({ transactions, onDeleteTransaction, globalSearchQuery = '' }: TransactionsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Pending' | 'Failed'>('All');
  const [sortField, setSortField] = useState<'name' | 'amount' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Handle column sorting
  const handleSort = (field: 'name' | 'amount' | 'date') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter and sort core dataset
  const filteredTransactions = transactions
    .filter((tx) => {
      const activeSearch = globalSearchQuery || searchTerm;
      const matchesSearch = 
        tx.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        tx.recipient.toLowerCase().includes(activeSearch.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="rounded-3xl bg-white/20 border border-white/40 p-5 backdrop-blur-xl shadow-lg relative overflow-hidden">
      {/* Header and Filter options */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-display font-extrabold text-base text-purple-950">Recent Transactions</h3>
          <p className="text-[10px] text-purple-950/40 uppercase tracking-wider font-bold">Transaction ledger</p>
        </div>

        {/* Filters and Search toolbar */}
        <div className="flex flex-wrap gap-2.5 items-center">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-950/40" />
            <input
              type="text"
              id="transaction-search-bar"
              placeholder="Search ledger..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 bg-white/45 border border-white/40 hover:bg-white/60 focus:bg-white/80 rounded-xl text-xs font-semibold text-purple-950 placeholder-purple-950/40 focus:outline-none focus:ring-1 focus:ring-purple-700 w-32 sm:w-40 transition-all"
            />
          </div>

          {/* Status filter badges */}
          <div className="flex gap-1 p-1 bg-purple-950/5 border border-purple-950/10 rounded-xl">
            {['All', 'Completed', 'Pending', 'Failed'].map((status) => (
              <button
                key={status}
                id={`transaction-filter-${status.toLowerCase()}`}
                onClick={() => setStatusFilter(status as any)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  statusFilter === status
                    ? 'bg-[#5e259e] text-white shadow-sm'
                    : 'text-purple-950/60 hover:text-purple-950'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Sorting controller segment */}
          <div className="flex gap-1 p-1 bg-purple-950/5 border border-purple-950/10 rounded-xl">
            {[
              { id: 'date', label: 'Date' },
              { id: 'amount', label: 'Amount' },
              { id: 'name', label: 'Name' }
            ].map((field) => {
              const isSorted = sortField === field.id;
              return (
                <button
                  key={field.id}
                  onClick={() => handleSort(field.id as any)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                    isSorted
                      ? 'bg-purple-950/80 text-white shadow-sm'
                      : 'text-purple-950/60 hover:text-purple-950'
                  }`}
                >
                  <span>{field.label}</span>
                  {isSorted && (
                    <span className="text-[9px] font-black">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Horizontal Cards Area */}
      <div className="flex flex-row overflow-x-auto gap-4 pb-2 pt-1 snap-x scrollbar-thin scrollbar-thumb-purple-950/20 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="min-w-[240px] sm:min-w-[270px] bg-white/45 hover:bg-white/60 border border-white/50 rounded-2xl p-4 flex flex-col justify-between shrink-0 snap-start shadow-sm hover:shadow-md transition-all group relative"
              >
                {/* Header row: Icon, Category & Trash deletion */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/40 shadow-sm ${
                      tx.type === 'Income' 
                        ? 'bg-emerald-500/15 text-emerald-700' 
                        : 'bg-pink-500/15 text-pink-700'
                    }`}>
                      {tx.type === 'Income' ? (
                        <span className="text-sm font-black font-sans">+</span>
                      ) : (
                        <span className="text-sm font-black font-sans">-</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="block font-bold text-purple-950 leading-tight truncate text-xs sm:text-sm" title={tx.name}>
                        {tx.name}
                      </span>
                      <span className="text-[10px] text-purple-950/40 font-semibold">{tx.type}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="p-1 rounded-lg text-purple-950/30 hover:text-rose-600 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shrink-0"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Info summary */}
                <div className="my-3 space-y-1 text-[11px] font-bold">
                  <div className="flex justify-between items-center text-purple-950/50 gap-2">
                    <span>Recip/Sender</span>
                    <span className="truncate max-w-[130px] text-purple-950 text-right">{tx.recipient}</span>
                  </div>
                  <div className="flex justify-between items-center text-purple-950/50 gap-2">
                    <span>Date & Time</span>
                    <span className="font-mono text-purple-950/70 text-right font-semibold">{tx.date}</span>
                  </div>
                </div>

                {/* Thin dividing vector */}
                <div className="h-px bg-purple-950/5 my-1" />

                {/* Amount and Status Badge */}
                <div className="flex items-center justify-between mt-1 pt-1">
                  <span className={`font-mono text-base font-black ${
                    tx.type === 'Income' ? 'text-emerald-600' : 'text-pink-600'
                  }`}>
                    {tx.type === 'Income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>

                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${
                    tx.status === 'Completed'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                      : tx.status === 'Pending'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-600'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-600'
                  }`}>
                    {tx.status === 'Completed' && <CheckCircle className="w-2.5 h-2.5" />}
                    {tx.status === 'Pending' && <HelpCircle className="w-2.5 h-2.5" />}
                    {tx.status === 'Failed' && <AlertTriangle className="w-2.5 h-2.5" />}
                    {tx.status}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-8 w-full text-center text-purple-950/45 font-semibold text-xs">
              No transactions match the filter criteria.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
