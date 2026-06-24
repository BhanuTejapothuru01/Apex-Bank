import React, { useState } from 'react';
import { FileText, Download, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { InvoiceItem } from '../types';

interface InvoicesViewProps {
  invoices: InvoiceItem[];
  setInvoices: React.Dispatch<React.SetStateAction<InvoiceItem[]>>;
}

export default function InvoicesView({ invoices, setInvoices }: InvoicesViewProps) {
  const [selectedInvId, setSelectedInvId] = useState<string>(invoices[0]?.id || '');
  const activeInvoice = invoices.find(inv => inv.id === selectedInvId) || invoices[0];

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Paid' ? 'Outstanding' : currentStatus === 'Outstanding' ? 'Overdue' : 'Paid';
    setInvoices(prev => 
      prev.map(inv => inv.id === id ? { ...inv, status: nextStatus as any } : inv)
    );
  };

  const handlePrint = () => {
    alert(`Initializing native printer subsystem for Invoice: ${activeInvoice.invoiceNumber}`);
  };

  return (
    <div id="invoices-view-root" className="space-y-6">
      
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-pink-500/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase">Total Invoice Value</p>
            <h4 className="text-2xl font-bold font-sans text-gray-900 mt-1">
              ${invoices.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
            </h4>
          </div>
          <div className="p-3 bg-pink-100 text-pink-500 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-pink-500/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase">Collected capital</p>
            <h4 className="text-2xl font-bold font-sans text-emerald-600 mt-1">
              ${invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
            </h4>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-pink-500/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase">Outstanding / Overdue</p>
            <h4 className="text-2xl font-bold font-sans text-amber-600 mt-1">
              ${invoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
            </h4>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Lists of invoices */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm space-y-4">
          <h3 className="text-xs font-bold font-mono uppercase text-[#24142F] tracking-wider">
            Billed Invoices Directory
          </h3>

          <div className="space-y-3">
            {invoices.map((inv) => (
              <button
                key={inv.id}
                onClick={() => setSelectedInvId(inv.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex justify-between items-center active:scale-[0.98] ${
                  selectedInvId === inv.id
                    ? 'border-pink-500 bg-pink-100/50 shadow-sm'
                    : 'border-pink-500/10 hover:bg-[#FAF4F8] bg-white'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-[#24142F] font-sans">{inv.invoiceNumber}</h4>
                  <p className="text-[10px] text-gray-500 font-sans mt-0.5">{inv.clientName}</p>
                  <p className="text-[9px] text-gray-400 font-mono mt-1">DUE: {inv.dueDate}</p>
                </div>

                <div className="text-right space-y-1.5">
                  <p className="text-xs font-bold font-mono text-gray-900">${inv.amount.toLocaleString()}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(inv.id, inv.status);
                    }}
                    className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                      inv.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inv.status === 'Outstanding'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {inv.status}
                  </button>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active invoice billing sheet */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-pink-500/10 shadow-sm space-y-6">
          {activeInvoice ? (
            <>
              <div className="flex justify-between items-start border-b border-gray-100 pb-5">
                <div>
                  <h3 className="text-base font-bold font-sans text-gray-900">Billing Statement</h3>
                  <p className="text-[11px] font-mono text-gray-400 mt-1 uppercase">
                    SYS-REFS: {activeInvoice.invoiceNumber}
                  </p>
                </div>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-[#24142F] text-white hover:bg-[#351b44] font-sans font-bold text-[10px] tracking-wider rounded-xl transition duration-200 flex items-center gap-1.5 active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  GENERATE PDF
                </button>
              </div>

              {/* Client & Metadata details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-xs">
                <div>
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest leading-none mb-1">CLIENT NAME</p>
                  <p className="font-sans font-bold text-gray-900">{activeInvoice.clientName}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest leading-none mb-1">DATE ISSUED</p>
                  <p className="font-mono text-gray-700">{activeInvoice.issueDate}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest leading-none mb-1">PAYMENT DUE</p>
                  <p className="font-mono text-gray-700">{activeInvoice.dueDate}</p>
                </div>
              </div>

              {/* Invoice lines itemized table */}
              <div className="border border-pink-500/10 rounded-2xl overflow-hidden mt-4">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-pink-50/50 border-b border-pink-100 font-mono text-gray-500 text-[9px] uppercase tracking-wider">
                      <th className="py-2.5 px-4">Item Description</th>
                      <th className="py-2.5 px-4 text-center">Qty</th>
                      <th className="py-2.5 px-4 text-right">Unit Price</th>
                      <th className="py-2.5 px-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-500/5">
                    {activeInvoice.items.map((item, index) => (
                      <tr key={index} className="text-gray-700">
                        <td className="py-3 px-4 font-sans font-medium">{item.description}</td>
                        <td className="py-3 px-4 text-center font-mono">{item.qty}</td>
                        <td className="py-3 px-4 text-right font-mono">${item.unitPrice.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">
                          ${(item.qty * item.unitPrice).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Ledger Summary block */}
              <div className="border-t border-gray-100 pt-4 flex flex-col items-end spacing-y-1.5">
                <div className="flex justify-between w-64 text-xs font-mono text-gray-500">
                  <span>SUB-TOTALS:</span>
                  <span>${activeInvoice.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-64 text-xs font-mono text-gray-500 mt-1">
                  <span>TAX ACCRUED (0%):</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between w-64 text-sm font-sans font-bold text-[#24142F] border-t border-pink-100 pt-2 mt-2">
                  <span>BALANCE DUE:</span>
                  <span>${activeInvoice.amount.toLocaleString()} USD</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400 font-sans">
              Select an invoice from directory to generate billing statements.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
