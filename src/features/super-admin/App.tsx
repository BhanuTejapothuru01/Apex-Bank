import './index.css';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar, { ActiveTab } from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import CustomerManagement from './components/CustomerManagement';
import EmployeeManagement from './components/EmployeeManagement';
import BranchManagement from './components/BranchManagement';
import AccountManagement from './components/AccountManagement';
import LoanManagement from './components/LoanManagement';
import CreditCards from './components/CreditCards';
import TransactionMonitoring from './components/TransactionMonitoring';
import KYCVerification from './components/KYCVerification';
import FraudDetection from './components/FraudDetection';
import InvestmentWealth from './components/InvestmentWealth';
import FixedDeposits from './components/FixedDeposits';
import AuditLogs from './components/AuditLogs';
import Settings from './components/Settings';
import SupportSystem from './components/SupportSystem';
import Reports from './components/Reports';
import AIFeatures from './components/AIFeatures';
import MyProfile from './components/MyProfile';
import ApexBankAIAssistant from './components/ApexBankAIAssistant';
import Inbox, { InboxMessage } from './components/Inbox';
import { BackgroundClouds } from './components/BackgroundClouds';
import { clearSession } from '@/auth/session';
import { useSupabaseTable } from '@/hooks/useSupabaseTable';
import {
  mapStudentToCustomer,
  mapEmployeeRow,
  mapBranchRow,
  mapBankTransactionRow,
  mapBankLoanRow,
  mapBankCardRow,
  mapFixedDepositRow,
  mapAuditLogRow,
  mapTicketRow,
  mapTaskRow,
  mapSuperAdminInboxRow,
  mapFraudAlertNotification,
} from '@/lib/db/mappers';

import { 
  INITIAL_CUSTOMERS, 
  INITIAL_EMPLOYEES, 
  INITIAL_BRANCHES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_LOANS, 
  INITIAL_CARDS, 
  INITIAL_FD, 
  INITIAL_AUDIT, 
  INITIAL_TICKETS, 
  INITIAL_TASKS 
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const customersDb = useSupabaseTable({ table: 'students', mapRow: mapStudentToCustomer, fallback: INITIAL_CUSTOMERS });
  const employeesDb = useSupabaseTable({ table: 'employees', mapRow: mapEmployeeRow, fallback: INITIAL_EMPLOYEES });
  const branchesDb = useSupabaseTable({ table: 'branches', mapRow: mapBranchRow, fallback: INITIAL_BRANCHES, orderColumn: 'id' });
  const transactionsDb = useSupabaseTable({ table: 'bank_transactions', mapRow: mapBankTransactionRow, fallback: INITIAL_TRANSACTIONS });
  const loansDb = useSupabaseTable({ table: 'bank_loans', mapRow: mapBankLoanRow, fallback: INITIAL_LOANS });
  const cardsDb = useSupabaseTable({ table: 'bank_cards', mapRow: mapBankCardRow, fallback: INITIAL_CARDS });
  const fixedDepositsDb = useSupabaseTable({ table: 'fixed_deposits', mapRow: mapFixedDepositRow, fallback: INITIAL_FD });
  const logsDb = useSupabaseTable({ table: 'audit_logs', mapRow: mapAuditLogRow, fallback: INITIAL_AUDIT });
  const ticketsDb = useSupabaseTable({ table: 'support_tickets', mapRow: mapTicketRow, fallback: INITIAL_TICKETS, orderColumn: 'ticket_date' });
  const tasksDb = useSupabaseTable({ table: 'admin_tasks', mapRow: mapTaskRow, fallback: INITIAL_TASKS, orderColumn: 'task_date' });
  const inboxDb = useSupabaseTable({ table: 'inbox_messages', mapRow: mapSuperAdminInboxRow, fallback: [] });
  const fraudDb = useSupabaseTable({ table: 'fraud_alerts', mapRow: mapFraudAlertNotification, fallback: [] });

  const customers = customersDb.data;
  const setCustomers = customersDb.setData;
  const employees = employeesDb.data;
  const setEmployees = employeesDb.setData;
  const branches = branchesDb.data;
  const transactions = transactionsDb.data;
  const setTransactions = transactionsDb.setData;
  const loans = loansDb.data;
  const setLoans = loansDb.setData;
  const cards = cardsDb.data;
  const setCards = cardsDb.setData;
  const fixedDeposits = fixedDepositsDb.data;
  const setFixedDeposits = fixedDepositsDb.setData;
  const logs = logsDb.data;
  const tickets = ticketsDb.data;
  const setTickets = ticketsDb.setData;
  const tasks = tasksDb.data;
  const inboxMessages = inboxDb.data;
  const setInboxMessages = inboxDb.setData;
  const notifications = fraudDb.data;
  const setNotifications = fraudDb.setData;

  useEffect(() => {
    if (!selectedCustomerId && customers.length > 0) {
      setSelectedCustomerId(customers[0].id);
    }
  }, [customers, selectedCustomerId]);

  const liveConnected =
    customersDb.connected ||
    employeesDb.connected ||
    branchesDb.connected ||
    transactionsDb.connected ||
    loansDb.connected;

  const addAuditLog = (action: string, severity: 'Info' | 'Warning' | 'Critical') => {
    const nextLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      user: 'khanamsayeemakousar@gmail.com',
      action,
      ipAddress: '192.168.1.144',
      timestamp: new Date().toISOString(),
      severity
    };
    logsDb.setData((prev) => [nextLog, ...prev]);
    void logsDb.upsert({
      id: nextLog.id,
      user_email: nextLog.user,
      action: nextLog.action,
      ip_address: nextLog.ipAddress,
      severity: nextLog.severity,
      created_at: nextLog.timestamp,
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Badges calculations
  const pendingKycCount = customers.filter(c => c.kycStatus === 'Pending').length;
  const activeAlertsCount = notifications.filter(n => !n.read).length;
  const openTicketsCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  const unreadInboxCount = inboxMessages.filter(m => !m.read && !m.archived).length;

  return (
    <div className="super-admin-dashboard">
        <motion.div 
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          dir="ltr"
          className="flex h-screen overflow-hidden bg-[#fbf5f7] text-[#2e1065] relative font-sans"
        >
          {/* Floating animated pale pink clouds system */}
          <BackgroundClouds />

          {/* Full-screen dreamy luxury background system */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#fbf5f7]">
            {/* Soft pink cloud gradients */}
            <div className="absolute top-[10%] left-[-10%] w-[60%] h-[60%] bg-[#f472b6]/15 rounded-full blur-[120px] animate-float-1" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-[#c084fc]/15 rounded-full blur-[150px] animate-float-2" />
            <div className="absolute top-[40%] right-[10%] w-[40%] h-[40%] bg-[#ec4899]/10 rounded-full blur-[100px] animate-float-3" />
            
            {/* Atmospheric glow overlays */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#fbf5f7] via-transparent to-[#fdf8f9] opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,132,252,0.05),transparent_50%)]" />
          </div>

          {/* Mobile Sidebar Backdrop Shading overlay */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-[#3a2072]/45 backdrop-blur-[3px] z-[45]"
              />
            )}
          </AnimatePresence>
          
          {/* Sidebar navigation */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            pendingKycCount={pendingKycCount}
            activeAlertsCount={activeAlertsCount}
            openTicketsCount={openTicketsCount}
            unreadInboxCount={unreadInboxCount}
            onLogout={() => {
              clearSession();
              window.location.href = '/';
            }}
            addAuditLog={addAuditLog}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main Panel layout wrapper */}
          <div className="flex-1 flex flex-col min-w-0 font-sans">
            
            {/* Top Header */}
            <Header 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              notifications={notifications}
              setNotifications={setNotifications}
              markNotificationAsRead={markNotificationAsRead}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              addAuditLog={addAuditLog}
              onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
              customers={customers}
              selectedCustomerId={selectedCustomerId}
              setSelectedCustomerId={setSelectedCustomerId}
              liveConnected={liveConnected}
              onLogout={() => {
                clearSession();
                window.location.href = '/';
              }}
            />

            {/* Central dynamically toggling interactive view screen area */}
            <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 select-text scrollbar-thin scrollbar-thumb-slate-800">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="h-full"
                >
                  {activeTab === 'overview' && (
                    <DashboardOverview 
                      customers={customers}
                      setCustomers={setCustomers}
                      employees={employees}
                      branches={branches}
                      transactions={transactions}
                      setTransactions={setTransactions}
                      loans={loans}
                      cards={cards}
                      fixedDeposits={fixedDeposits}
                      logs={logs}
                      searchQuery={searchQuery}
                      addAuditLog={addAuditLog}
                    />
                  )}

                  {activeTab === 'customers' && (
                    <CustomerManagement 
                      customers={customers}
                      setCustomers={setCustomers}
                      transactions={transactions}
                      branches={branches}
                      searchQuery={searchQuery}
                      addAuditLog={addAuditLog}
                      selectedCustomerId={selectedCustomerId}
                      setSelectedCustomerId={setSelectedCustomerId}
                    />
                  )}

                  {activeTab === 'employees' && (
                    <EmployeeManagement 
                      employees={employees}
                      setEmployees={setEmployees}
                      branches={branches}
                      addAuditLog={addAuditLog}
                    />
                  )}

                  {activeTab === 'branches' && (
                    <BranchManagement 
                      branches={branches}
                    />
                  )}

                  {activeTab === 'accounts' && (
                    <AccountManagement 
                      customers={customers}
                      setCustomers={setCustomers}
                      employees={employees}
                      branches={branches}
                      addAuditLog={addAuditLog}
                      setActiveTab={setActiveTab}
                    />
                  )}

                  {activeTab === 'loans' && (
                    <LoanManagement 
                      loans={loans}
                      setLoans={setLoans}
                      customers={customers}
                      setCustomers={setCustomers}
                      transactions={transactions}
                      setTransactions={setTransactions}
                      employees={employees}
                      branches={branches}
                      addAuditLog={addAuditLog}
                    />
                  )}

                  {activeTab === 'cards' && (
                    <CreditCards 
                      cards={cards}
                      setCards={setCards}
                      addAuditLog={addAuditLog}
                    />
                  )}

                  {activeTab === 'transactions' && (
                    <TransactionMonitoring 
                      transactions={transactions}
                      setTransactions={setTransactions}
                      searchQuery={searchQuery}
                      customers={customers}
                      employees={employees}
                      branches={branches}
                      addAuditLog={addAuditLog}
                      setActiveTab={setActiveTab}
                    />
                  )}

                  {activeTab === 'kyc' && (
                    <KYCVerification 
                      customers={customers}
                      setCustomers={setCustomers}
                      employees={employees}
                      setEmployees={setEmployees}
                      addAuditLog={addAuditLog}
                    />
                  )}

                  {activeTab === 'fraud' && (
                    <FraudDetection
                      alerts={notifications}
                      setAlerts={setNotifications}
                      addAuditLog={addAuditLog}
                    />
                  )}

                  {activeTab === 'wealth' && (
                    <InvestmentWealth />
                  )}

                  {activeTab === 'deposits' && (
                    <FixedDeposits 
                      fixedDeposits={fixedDeposits}
                      setFixedDeposits={setFixedDeposits}
                      customers={customers}
                      employees={employees}
                      branches={branches}
                      addAuditLog={addAuditLog}
                    />
                  )}

                  {activeTab === 'reports' && (
                    <Reports 
                      customers={customers}
                      transactions={transactions}
                      addAuditLog={addAuditLog}
                    />
                  )}

                  {activeTab === 'ai-core' && (
                    <AIFeatures 
                      customers={customers}
                      employees={employees}
                      loans={loans}
                      transactions={transactions}
                      addAuditLog={addAuditLog}
                    />
                  )}

                  {activeTab === 'audit' && (
                    <AuditLogs 
                      logs={logs}
                    />
                  )}

                  {activeTab === 'settings' && (
                    <Settings />
                  )}

                  {activeTab === 'profile' && (
                    <MyProfile />
                  )}

                  {activeTab === 'support' && (
                    <SupportSystem 
                      tickets={tickets}
                      setTickets={setTickets}
                      addAuditLog={addAuditLog}
                    />
                  )}

                  {activeTab === 'inbox' && (
                    <Inbox 
                      messages={inboxMessages}
                      setMessages={setInboxMessages}
                      addAuditLog={addAuditLog}
                      employees={employees}
                      branches={branches}
                    />
                  )}

                </motion.div>
              </AnimatePresence>
            </main>

          </div>
          
          {/* Global Prismatic Apex Banking AI Assistant Co-pilot */}
          <ApexBankAIAssistant 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            customers={customers}
            employees={employees}
            branches={branches}
            transactions={transactions}
            loans={loans}
            cards={cards}
            fixedDeposits={fixedDeposits}
            logs={logs}
            notifications={notifications}
            addAuditLog={addAuditLog}
          />
        </motion.div>
    </div>
  );
}
