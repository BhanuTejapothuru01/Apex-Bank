/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Bot, User, RefreshCw, HelpCircle, ShieldAlert, X } from 'lucide-react';
import { AdvisorMessage, Transaction, SavingVault } from '../types';

interface AIFinancialAdvisorProps {
  transactions: Transaction[];
  savingsVaults: SavingVault[];
  balance: number;
  onClose?: () => void;
}

const TEMPLATE_PROMPTS = [
  "Can you evaluate my current spending patterns?",
  "Analyze my monthly luxury items.",
  "Give me 3 baby-pink tips to save for my vaults.",
  "Check my ledger for any red flags or outlier spent."
];

export default function AIFinancialAdvisor({ transactions, savingsVaults, balance, onClose }: AIFinancialAdvisorProps) {
  const [messages, setMessages] = useState<AdvisorMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: '🌸 **Greetings from Apex Wealth Control center.** I am **Apex AI**, your elite, pastel-inspired financial intelligence concierge. I have securely audited your transaction logs, current vaults, and accounting sheets.\n\n*Ask me to calculate spending, optimize your saving rate, or verify recent merchants!*',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleQuery = async (queryText: string) => {
    if (!queryText.trim() || isProcessing) return;

    const userMsg: AdvisorMessage = {
      id: `m-${Date.now()}-u`,
      sender: 'user',
      content: queryText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      const payloadMessages = [...messages, userMsg];

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          transactions,
          savingsVaults,
          balance
        })
      });

      if (!response.ok) {
        throw new Error('Database transaction query failed');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: `m-${Date.now()}-a`,
        sender: 'assistant',
        content: data.content || "I apologize, my predictive cognitive nodes encountered a latency event. Please refresh and resubmit your voucher.",
        timestamp: new Date().toISOString()
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: `m-${Date.now()}-err`,
        sender: 'assistant',
        content: '🚨 **Apex Cloud Node Exception:** Unable to parse secure ledger index. Please verify that your `GEMINI_API_KEY` is loaded securely inside **Settings > Secrets** in the AI Studio editor interface.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        content: '🌸 **Greetings from Apex Wealth Control center.** I am **Apex AI**, your elite, pastel-inspired financial intelligence concierge. I have securely audited your transaction logs, current vaults, and accounting sheets.\n\n*Ask me to calculate spending, optimize your saving rate, or verify recent merchants!*',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-premium flex flex-col h-[520px]">
      
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-white/40 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-pink-100/50 text-[#4A1C6D] rounded-xl">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-medium text-gray-800 text-sm">Apex AI Intelligence</h3>
            <p className="text-[10px] text-gray-400 font-mono">Live Session Context Synchronized</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearHistory}
            className="p-1 px-2.5 rounded-lg border border-white/70 hover:bg-white/60 text-[#4A1C6D] text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="Reset Thread Context"
          >
            <RefreshCw className="w-3 h-3" /> RESTORE
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 border border-[#ff5e9c]/20 hover:bg-pink-100/40 text-[#4A1C6D] rounded-lg transition-all cursor-pointer flex items-center justify-center"
              title="Close AI Assistant"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Thread list */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-1 scrollbar-thin">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${isUser ? 'bg-pink-100/60 text-[#4A1C6D]' : 'bg-pink-100/30 text-[#4A1C6D]'}`}>
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                isUser 
                  ? 'bg-[#4A1C6D] text-white rounded-tr-none' 
                  : 'bg-white/35 text-gray-800 rounded-tl-none border border-white/50'
              }`}>
                {/* Parse Markdown-like titles in simple string checks safely */}
                <div className="space-y-1.5 whitespace-pre-line break-words">
                  {m.content.split('\n').map((line, idx) => {
                    // Quick bold formatting
                    let renderedLine = line;
                    
                    // Simple replacement for basic bullet lists
                    let isBullet = false;
                    if (renderedLine.startsWith('* ') || renderedLine.startsWith('- ')) {
                      renderedLine = renderedLine.substring(2);
                      isBullet = true;
                    }

                    // Format bold tags: **text**
                    const parts = renderedLine.split('**');
                    const formatted = parts.map((part, pIdx) => {
                      if (pIdx % 2 === 1) {
                        return <strong key={pIdx} className="font-bold text-[#4A1C6D]">{part}</strong>;
                      }
                      return part;
                    });

                    if (isBullet) {
                      return <div key={idx} className="flex gap-1.5 pl-2"><span className="text-[#4A1C6D]">•</span><div>{formatted}</div></div>;
                    }

                    return <span key={idx} className="block">{formatted}</span>;
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-start gap-2 max-w-[85%]">
            <div className="p-1.5 rounded-lg bg-pink-100/40 text-[#4A1C6D] shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 bg-white/35 rounded-2xl rounded-tl-none border border-white/50 text-xs text-gray-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#4A1C6D] rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-[#4A1C6D] rounded-full animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 bg-[#4A1C6D] rounded-full animate-bounce delay-200" />
              <span>Analyzing ledger entries...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestion prompt templates */}
      {messages.length === 1 && (
        <div className="mb-3.5">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1.5 block">Suggested Core Actions:</span>
          <div className="grid grid-cols-2 gap-1.5">
            {TEMPLATE_PROMPTS.map((promptText) => (
              <button
                key={promptText}
                onClick={() => handleQuery(promptText)}
                className="p-2 bg-white/45 hover:bg-white/80 border border-white/60 text-[10px] font-semibold text-gray-600 hover:text-[#4A1C6D] text-left rounded-xl transition-all truncate cursor-pointer"
                title={promptText}
              >
                {promptText}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Submit box */}
      <form onSubmit={(e) => { e.preventDefault(); handleQuery(inputMessage); }} className="relative flex items-center gap-2 mt-auto">
        <input
          type="text"
          value={inputMessage}
          disabled={isProcessing}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask Apex AI (e.g. List utilities expense)..."
          className="flex-1 pl-4 pr-10 py-2.5 text-xs bg-white/45 rounded-2xl border border-white/65 focus:outline-none focus:border-[#4A1C6D] disabled:opacity-50 font-medium text-gray-800 placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isProcessing}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#4A1C6D] hover:text-[#32104c] disabled:opacity-30 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
