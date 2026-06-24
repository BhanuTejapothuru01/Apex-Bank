import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function upsert(db: ReturnType<typeof createClient>, table: string, rows: Record<string, unknown>[], conflict?: string) {
  const batchSize = 5;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = conflict
      ? await db.from(table).upsert(batch, { onConflict: conflict })
      : await db.from(table).upsert(batch);
    if (error) throw new Error(`${table}: ${error.message}`);
  }
}

async function main() {
  const db = createClient(url, serviceKey, { auth: { persistSession: false } });
  console.log('[Apex Bank] Seeding expanded dataset across all domains…\n');

  await upsert(db, 'branches', [
    { id: 'BR-HYD-05', name: 'Hyderabad Main Branch', manager: 'Priya Menon', location: 'Hyderabad, India', total_deposits: 285000000, active_accounts: 12400, rating: 4.7, status: 'Operational' },
    { id: 'BR-DXB-06', name: 'Dubai International Hub', manager: 'Ahmed Hassan', location: 'Dubai, UAE', total_deposits: 412000000, active_accounts: 3680, rating: 4.8, status: 'Operational' },
    { id: 'BR-BLR-07', name: 'Bangalore Tech Park', manager: 'Ananya Reddy', location: 'Bangalore, India', total_deposits: 198000000, active_accounts: 8900, rating: 4.6, status: 'Operational' },
  ]);
  console.log('  ✓ branches (+3)');

  const customers = [
    { customer_id: 'CUST-089', full_name: 'Dmitry Volkov', email_address: 'd.volikov@uralgas.ru', mobile_number: '+7 495 123 4567', password: 'demo123', account_number: 'APEX8800000005', account_type: 'Corporate', kyc_status: 'Verified', balance: 3200000, city: 'Moscow', state: 'Russia', risk_profile: 'Medium', risk_score: 55, customer_status: 'Active', verified: true, branch_id: 'BR-ZH-01', customer_type: 'Corporate', join_date: '2022-03-20' },
    { customer_id: 'CUST-901', full_name: 'Kenji Takahashi', email_address: 'k.takahashi@neo-tokyo.jp', mobile_number: '+81 90 1234 5678', password: 'demo123', account_number: 'APEX8800000006', account_type: 'VIP Savings', kyc_status: 'Verified', balance: 8500000, city: 'Tokyo', state: 'Japan', risk_profile: 'Low', risk_score: 10, customer_status: 'Active', verified: true, branch_id: 'BR-TKY-03', customer_type: 'VIP', join_date: '2020-11-08' },
    { customer_id: 'CUST-210', full_name: 'Priya Sharma', email_address: 'priya.sharma@gmail.com', mobile_number: '9876501234', password: 'demo123', account_number: 'APEX8800000007', account_type: 'Premium Savings', kyc_status: 'Verified', balance: 485000, city: 'Hyderabad', state: 'Telangana', risk_profile: 'Low', risk_score: 22, customer_status: 'Active', verified: true, branch_id: 'BR-HYD-05', customer_type: 'Retail', join_date: '2023-06-12' },
    { customer_id: 'CUST-311', full_name: 'Raj Patel', email_address: 'raj.patel@outlook.com', mobile_number: '9823456789', password: 'demo123', account_number: 'APEX8800000008', account_type: 'Savings', kyc_status: 'Verified', balance: 920000, city: 'Mumbai', state: 'Maharashtra', risk_profile: 'Low', risk_score: 18, customer_status: 'Active', verified: true, branch_id: 'BR-HYD-05', customer_type: 'Retail', join_date: '2022-01-05' },
    { customer_id: 'CUST-422', full_name: 'Fatima Al-Rashid', email_address: 'f.alrashid@emirates.ae', mobile_number: '+971 50 123 4567', password: 'demo123', account_number: 'APEX8800000009', account_type: 'VIP Savings', kyc_status: 'Verified', balance: 2150000, city: 'Dubai', state: 'UAE', risk_profile: 'Low', risk_score: 14, customer_status: 'Active', verified: true, branch_id: 'BR-DXB-06', customer_type: 'VIP', join_date: '2021-08-22' },
    { customer_id: 'CUST-533', full_name: 'James OConnor', email_address: 'j.oconnor@dublin.ie', mobile_number: '+353 87 123 4567', password: 'demo123', account_number: 'APEX8800000010', account_type: 'Premium Savings', kyc_status: 'Verified', balance: 675000, city: 'Dublin', state: 'Ireland', risk_profile: 'Low', risk_score: 20, customer_status: 'Active', verified: true, branch_id: 'BR-LDN-02', customer_type: 'Retail', join_date: '2023-02-14' },
    { customer_id: 'CUST-644', full_name: 'Mei Lin', email_address: 'mei.lin@sgtech.sg', mobile_number: '+65 9123 4567', password: 'demo123', account_number: 'APEX8800000011', account_type: 'Corporate', kyc_status: 'Verified', balance: 1580000, city: 'Singapore', state: 'Singapore', risk_profile: 'Medium', risk_score: 35, customer_status: 'Active', verified: true, branch_id: 'BR-SGP-04', customer_type: 'Corporate', join_date: '2022-07-30' },
    { customer_id: 'CUST-755', full_name: 'Carlos Mendez', email_address: 'c.mendez@brasil.com', mobile_number: '+55 11 98765 4321', password: 'demo123', account_number: 'APEX8800000012', account_type: 'Savings', kyc_status: 'Pending', balance: 340000, city: 'Sao Paulo', state: 'Brazil', risk_profile: 'Medium', risk_score: 48, customer_status: 'Active', verified: true, branch_id: 'BR-NYC-01', customer_type: 'Retail', join_date: '2024-01-20' },
    { customer_id: 'CUST-866', full_name: 'Ananya Reddy', email_address: 'ananya.reddy@tech.in', mobile_number: '9988776655', password: 'demo123', account_number: 'APEX8800000013', account_type: 'Premium Savings', kyc_status: 'Verified', balance: 780000, city: 'Bangalore', state: 'Karnataka', risk_profile: 'Low', risk_score: 16, customer_status: 'Active', verified: true, branch_id: 'BR-BLR-07', customer_type: 'Retail', join_date: '2023-09-01' },
    { customer_id: 'CUST-977', full_name: 'Hiroshi Nakamura', email_address: 'h.nakamura@osaka.jp', mobile_number: '+81 80 9876 5432', password: 'demo123', account_number: 'APEX8800000014', account_type: 'Corporate', kyc_status: 'Verified', balance: 4200000, city: 'Osaka', state: 'Japan', risk_profile: 'Low', risk_score: 12, customer_status: 'Active', verified: true, branch_id: 'BR-TKY-03', customer_type: 'Corporate', join_date: '2021-12-10' },
    { customer_id: 'CUST-1088', full_name: 'Sophie Laurent', email_address: 's.laurent@paris.fr', mobile_number: '+33 6 9876 5432', password: 'demo123', account_number: 'APEX8800000015', account_type: 'VIP Savings', kyc_status: 'Verified', balance: 1890000, city: 'Paris', state: 'France', risk_profile: 'Low', risk_score: 11, customer_status: 'Active', verified: true, branch_id: 'BR-LDN-02', customer_type: 'VIP', join_date: '2020-05-18' },
    { customer_id: 'CUST-1199', full_name: 'David Kim', email_address: 'd.kim@seoul.kr', mobile_number: '+82 10 1234 5678', password: 'demo123', account_number: 'APEX8800000016', account_type: 'Corporate', kyc_status: 'Verified', balance: 2650000, city: 'Seoul', state: 'South Korea', risk_profile: 'Medium', risk_score: 28, customer_status: 'Active', verified: true, branch_id: 'BR-TKY-03', customer_type: 'Corporate', join_date: '2022-04-25' },
    { customer_id: 'CUST-1200', full_name: 'Michael Chen', email_address: 'm.chen@sf-tech.com', mobile_number: '+1 415 555 0199', password: 'demo123', account_number: 'APEX8800000017', account_type: 'Premium Savings', kyc_status: 'Verified', balance: 550000, city: 'San Francisco', state: 'USA', risk_profile: 'Low', risk_score: 19, customer_status: 'Active', verified: true, branch_id: 'BR-NYC-01', customer_type: 'Retail', join_date: '2023-11-11' },
    { customer_id: 'CUST-1201', full_name: 'Olivia Brown', email_address: 'olivia.b@chicago.net', mobile_number: '+1 312 555 0144', password: 'demo123', account_number: 'APEX8800000018', account_type: 'Savings', kyc_status: 'Pending', balance: 95000, city: 'Chicago', state: 'USA', risk_profile: 'High', risk_score: 72, customer_status: 'Active', verified: false, branch_id: 'BR-NYC-01', customer_type: 'Retail', join_date: '2024-08-03' },
  ];
  await upsert(db, 'students', customers, 'email_address');
  console.log(`  ✓ students (+${customers.length} new)`);

  await upsert(db, 'employees', [
    { id: 'EMP-002', name: 'Donald Vance', email: 'd.vance@apexbank.com', role: 'NYC Branch Manager', department: 'Branch Management', branch_id: 'BR-NYC-01', status: 'Active', rating: 4.7, join_date: '2014-03-01', performance: 95 },
    { id: 'EMP-015', name: 'Lawrence Wong', email: 'l.wong@apexbank.com', role: 'Singapore Hub Director', department: 'Branch Management', branch_id: 'BR-SGP-04', status: 'Active', rating: 4.6, join_date: '2016-07-12', performance: 93 },
    { id: 'EMP-046', name: 'Priya Menon', email: 'p.menon@apexbank.com', role: 'Hyderabad Branch Manager', department: 'Branch Management', branch_id: 'BR-HYD-05', status: 'Active', rating: 4.8, join_date: '2019-04-20', performance: 96 },
    { id: 'EMP-093', name: 'Ahmed Hassan', email: 'a.hassan@apexbank.com', role: 'Dubai Regional Head', department: 'Branch Management', branch_id: 'BR-DXB-06', status: 'Active', rating: 4.7, join_date: '2017-11-05', performance: 94 },
    { id: 'EMP-109', name: 'Rahul Verma', email: 'r.verma@apexbank.com', role: 'Senior Fraud Analyst', department: 'Risk & Compliance', branch_id: 'BR-HYD-05', status: 'Active', rating: 4.5, join_date: '2021-01-15', performance: 92 },
    { id: 'EMP-110', name: 'Meera Iyer', email: 'm.iyer@apexbank.com', role: 'Customer Support Lead', department: 'Operations', branch_id: 'BR-BLR-07', status: 'Active', rating: 4.6, join_date: '2020-06-08', performance: 90 },
    { id: 'EMP-111', name: 'James Morrison', email: 'j.morrison@apexbank.com', role: 'Treasury Manager', department: 'Finance', branch_id: 'BR-NYC-01', status: 'Active', rating: 4.8, join_date: '2016-09-22', performance: 97 },
    { id: 'EMP-112', name: 'Lin Wei', email: 'l.wei@apexbank.com', role: 'Operations Director', department: 'Operations', branch_id: 'BR-SGP-04', status: 'Active', rating: 4.7, join_date: '2018-12-01', performance: 95 },
  ]);
  console.log('  ✓ employees (+8)');

  await upsert(db, 'bank_transactions', [
    { id: 'TXN-98301', customer_id: 'CUST-210', customer_name: 'Priya Sharma', merchant: 'BigBasket Grocery', amount: 3420, tx_type: 'expense', tx_direction: 'expense', category: 'Groceries', status: 'completed', portal: 'customer', transaction_date: '2026-06-22T11:00:00Z' },
    { id: 'TXN-98302', customer_id: 'CUST-422', customer_name: 'Fatima Al-Rashid', merchant: 'Emirates NBD Transfer', amount: 85000, tx_type: 'Transfer', tx_direction: 'expense', category: 'Wire Transfer', status: 'Success', fraud_risk_score: 18, source_branch_id: 'BR-DXB-06', portal: 'super-admin', transaction_date: '2026-06-23T09:15:00Z' },
    { id: 'TXN-98303', customer_id: 'CUST-901', customer_name: 'Kenji Takahashi', merchant: 'Tokyo Stock Exchange', amount: 2500000, tx_type: 'Investment', tx_direction: 'expense', category: 'Securities', status: 'Success', fraud_risk_score: 8, source_branch_id: 'BR-TKY-03', portal: 'super-admin', transaction_date: '2026-06-23T10:30:00Z' },
    { id: 'TXN-98304', customer_id: 'CUST-755', customer_name: 'Carlos Mendez', merchant: 'ATM Withdrawal', amount: 15000, tx_type: 'Withdrawal', tx_direction: 'expense', category: 'ATM', status: 'Suspicious', fraud_risk_score: 76, source_branch_id: 'BR-NYC-01', portal: 'super-admin', transaction_date: '2026-06-23T06:00:00Z' },
    { id: 'tx-admin-003', customer_name: 'Branch Deposits', merchant: 'Hyderabad Branch Deposit', name: 'Hyderabad Branch Deposit', amount: 45000, tx_type: 'Income', tx_direction: 'income', category: 'Deposits', status: 'Completed', recipient: 'Hyderabad Main Branch', icon_name: 'TrendingUp', portal: 'admin', transaction_date: '2026-06-23T12:00:00Z' },
    { id: 'tx-emp-003', sender: 'Apex Bank HQ', recipient: 'Office Supplies Co', amount: 2340, category: 'Operations', status: 'Completed', reference: 'REF-TX-991234', tx_time: '16:45', portal: 'employee', transaction_date: '2026-06-23' },
    { id: 'tx-emp-004', sender: 'Dubai Branch', recipient: 'Security Systems Ltd', amount: 12500, category: 'Infrastructure', status: 'Pending', reference: 'REF-TX-991235', tx_time: '09:30', portal: 'employee', transaction_date: '2026-06-24' },
  ]);
  console.log('  ✓ bank_transactions (+7)');

  await upsert(db, 'bank_loans', [
    { id: 'LOAN-1035', customer_id: 'CUST-210', customer_name: 'Priya Sharma', applicant_name: 'Priya Sharma', company_name: 'Personal', loan_type: 'Home Loan', amount: 3500000, status: 'Pending', purpose: 'Apartment in Gachibowli', duration_months: 240, interest_rate: 8.5, requested_date: '2026-06-20', date_applied: '2026-06-20', risk_score: 20, credit_score: 760, income: 120000, existing_liabilities: 8000, dti: 6.7, risk_rating: 'Low', verification: { kycStatus: true, panCard: true, aadhaarCard: true, bankReconciled: true, employmentCheck: 'Verified' } },
    { id: 'LOAN-1036', customer_id: 'CUST-422', customer_name: 'Fatima Al-Rashid', applicant_name: 'Fatima Al-Rashid', company_name: 'Al-Rashid Holdings', loan_type: 'Commercial Real Estate', amount: 8000000, status: 'Approved', purpose: 'Dubai Marina Office', duration_months: 120, interest_rate: 5.75, requested_date: '2026-05-15', date_applied: '2026-05-15', risk_score: 12, credit_score: 820, income: 450000, existing_liabilities: 120000, dti: 26.7, risk_rating: 'Low', verification: { kycStatus: true, panCard: true, aadhaarCard: true, bankReconciled: true, employmentCheck: 'Verified' } },
    { id: 'LOAN-1037', customer_id: 'CUST-755', customer_name: 'Carlos Mendez', applicant_name: 'Carlos Mendez', company_name: 'Mendez Imports', loan_type: 'SME Working Capital', amount: 250000, status: 'Rejected', purpose: 'Inventory purchase', duration_months: 24, interest_rate: 9.5, requested_date: '2026-06-10', date_applied: '2026-06-10', risk_score: 68, credit_score: 620, income: 45000, existing_liabilities: 35000, dti: 77.8, risk_rating: 'High', decision_reason: 'DTI exceeds threshold', verification: { kycStatus: false, panCard: true, aadhaarCard: false, bankReconciled: false, employmentCheck: 'Pending' } },
  ]);
  console.log('  ✓ bank_loans (+3)');

  await upsert(db, 'bank_cards', [
    { id: 'CARD-4402', customer_id: 'CUST-901', customer_name: 'Kenji Takahashi', cardholder: 'Kenji Takahashi', last4: '3344', credit_limit: 5000000, balance: 125000, status: 'Active', expiry_date: '2028-06', network: 'Visa', card_type: 'Visa Infinite', credit_score: 850 },
    { id: 'CARD-4403', customer_id: 'CUST-422', customer_name: 'Fatima Al-Rashid', cardholder: 'Fatima Al-Rashid', last4: '7788', credit_limit: 1000000, balance: 42000, status: 'Active', expiry_date: '2027-09', network: 'Mastercard', card_type: 'World Elite', credit_score: 830 },
    { id: 'CARD-4404', customer_id: 'CUST-210', customer_name: 'Priya Sharma', cardholder: 'Priya Sharma', last4: '5566', credit_limit: 150000, balance: 8500, status: 'Active', expiry_date: '2028-03', network: 'Visa', card_type: 'Platinum Debit', credit_score: 780 },
  ]);
  console.log('  ✓ bank_cards (+3)');

  await upsert(db, 'fixed_deposits', [
    { id: 'FD-503', customer_name: 'Priya Sharma', amount: 500000, interest_rate: 6.75, duration_months: 36, start_date: '2025-06-01', status: 'Active' },
    { id: 'FD-504', customer_name: 'Fatima Al-Rashid', amount: 2000000, interest_rate: 5.5, duration_months: 24, start_date: '2025-03-15', status: 'Active' },
    { id: 'FD-505', customer_name: 'David Kim', amount: 1500000, interest_rate: 5.85, duration_months: 18, start_date: '2025-09-01', status: 'Active' },
  ]);
  console.log('  ✓ fixed_deposits (+3)');

  await upsert(db, 'fraud_alerts', [
    { id: 'alert-3', source: 'CUST-755', reason: 'Repeated ATM withdrawals near limit', amount: 15000, risk_probability: 76, alert_time: '06:00 AM', status: 'Pending', location: 'Sao Paulo, BR', device_type: 'ATM' },
    { id: 'alert-4', source: 'CUST-1201', reason: 'New account large inbound transfer', amount: 50000, risk_probability: 82, alert_time: '02:15 PM', status: 'Pending', location: 'Chicago, USA', device_type: 'Web' },
    { id: 'alert-5', source: 'CUST-089', reason: 'Cross-border wire to flagged jurisdiction', amount: 890000, risk_probability: 65, alert_time: '11:45 AM', status: 'Pending', location: 'Moscow, RU', device_type: 'Desktop' },
  ]);
  console.log('  ✓ fraud_alerts (+3)');

  await upsert(db, 'inbox_messages', [
    { id: 'MSG-4201', sender_name: 'Admin – Hyderabad Main Branch', employee_id: 'EMP-046', branch_name: 'Hyderabad Main Branch', subject: 'Leave Application Request', content: 'Applying for 3 days Casual Leave from 25–27 June 2026.', preview: 'Applying for 3 days Casual Leave…', message_type: 'Leave Request', message_time: '2026-06-17 09:30 AM', priority: 'High', is_read: false, status: 'Pending' },
    { id: 'MSG-1081', sender_name: 'Yuki Sato', employee_id: 'EMP-108', branch_name: 'Tokyo Neo Skyline', subject: 'Emergency Sick Leave', content: 'Applying for 2 days Sick Leave due to influenza.', preview: 'Applying for 2 days Sick Leave…', message_type: 'Leave Request', message_time: '2026-06-16 11:20 AM', priority: 'Medium', is_read: false, status: 'Pending' },
    { id: 'MSG-3051', sender_name: 'Compliance System Bulletin', employee_id: 'SYSTEM', branch_name: 'Apex Corporate HQ', subject: 'RBI Quarterly Audit Notice', content: 'All branch admins must complete KYC ledgers before June 30.', preview: 'All branch admins must complete…', message_type: 'Announcement', message_time: '2026-06-15 08:00 AM', priority: 'High', is_read: true, status: 'Approved' },
    { id: 'MSG-EMP-003', sender_name: 'Rahul Verma', employee_id: 'EMP-109', branch_name: 'Hyderabad Main Branch', subject: 'Fraud case escalation — CUST-755', content: 'Recommend account freeze pending investigation.', preview: 'Recommend account freeze…', message_type: 'Support', message_time: '2026-06-23 03:00 PM', priority: 'High', is_read: false },
    { id: 'MSG-EMP-004', sender_name: 'Meera Iyer', employee_id: 'EMP-110', branch_name: 'Bangalore Tech Park', subject: 'Customer complaint batch summary', content: '14 open tickets resolved this week across Bangalore region.', preview: '14 open tickets resolved…', message_type: 'Announcement', message_time: '2026-06-23 10:00 AM', priority: 'Low', is_read: true },
  ]);
  console.log('  ✓ inbox_messages (+5)');

  await upsert(db, 'audit_logs', [
    { id: 'LOG-5422', user_email: 'p.menon@apexbank.com', action: 'Hyderabad branch daily reconciliation completed', ip_address: '103.24.18.50', severity: 'Info', created_at: '2026-06-23T08:00:00Z' },
    { id: 'LOG-5423', user_email: 'r.verma@apexbank.com', action: 'Fraud alert raised for CUST-755', ip_address: '103.24.18.51', severity: 'Warning', created_at: '2026-06-23T06:05:00Z' },
    { id: 'LOG-5424', user_email: 'a.hassan@apexbank.com', action: 'Dubai hub SWIFT gateway health check passed', ip_address: '185.220.101.10', severity: 'Info', created_at: '2026-06-23T04:00:00Z' },
  ]);
  console.log('  ✓ audit_logs (+3)');

  await upsert(db, 'support_tickets', [
    { id: 'TKT-313', customer_name: 'Priya Sharma', subject: 'NEFT transfer failed — timeout error', status: 'Open', priority: 'High', ticket_date: '2026-06-23' },
    { id: 'TKT-314', customer_name: 'Olivia Brown', subject: 'Account verification documents rejected', status: 'In Progress', priority: 'Medium', ticket_date: '2026-06-22' },
    { id: 'TKT-315', customer_name: 'Kenji Takahashi', subject: 'Request premium concierge card upgrade', status: 'Open', priority: 'Low', ticket_date: '2026-06-21' },
  ]);
  console.log('  ✓ support_tickets (+3)');

  await upsert(db, 'admin_tasks', [
    { id: 'TSK-03', title: 'Review CUST-755 fraud investigation', status: 'Pending', task_date: '2026-06-23', priority: 'High' },
    { id: 'TSK-04', title: 'Approve Hyderabad branch expansion budget', status: 'Pending', task_date: '2026-06-24', priority: 'Medium' },
    { id: 'TSK-05', title: 'Dubai compliance audit prep', status: 'In Progress', task_date: '2026-06-23', priority: 'High' },
  ]);
  console.log('  ✓ admin_tasks (+3)');

  await upsert(db, 'employee_payments', [
    { id: 'pay-3', vendor: 'Hyderabad Water Board', category: 'Utility', amount: 85, due_date: '30th', autopay: true, color_class: 'bg-teal-500' },
    { id: 'pay-4', vendor: 'Global Insurance Corp', category: 'Insurance', amount: 2800, due_date: '1st', autopay: false, color_class: 'bg-amber-500' },
    { id: 'pay-5', vendor: 'Dubai Data Center', category: 'Infrastructure', amount: 8900, due_date: '15th', autopay: true, color_class: 'bg-indigo-500' },
  ]);
  console.log('  ✓ employee_payments (+3)');

  await upsert(db, 'credit_products', [
    { id: 'cred-3', name: 'Startup Flex Line', rate: 7.8, term: '48 months', status: 'Active', applicants: 67 },
    { id: 'cred-4', name: 'Green Energy Loan', rate: 5.9, term: '60 months', status: 'Active', applicants: 23 },
  ]);
  console.log('  ✓ credit_products (+2)');

  await upsert(db, 'employee_customers', [
    { id: 'cust-emp-3', name: 'Priya Sharma', company: 'Tech Mahindra', account_type: 'Corporate Credit', credit_limit: 200000, balance: 45000, card_number: '4532 **** **** 5566', expiry_date: '03/28', status: 'Active', credit_score: 760 },
    { id: 'cust-emp-4', name: 'Fatima Al-Rashid', company: 'Al-Rashid Holdings', account_type: 'VIP Business Line', credit_limit: 1500000, balance: 320000, card_number: '5109 **** **** 7788', expiry_date: '09/27', status: 'Active', credit_score: 830 },
    { id: 'cust-emp-5', name: 'Kenji Takahashi', company: 'Neo Tokyo Ventures', account_type: 'Corporate Credit', credit_limit: 3000000, balance: 890000, card_number: '4001 **** **** 3344', expiry_date: '06/28', status: 'Active', credit_score: 850 },
    { id: 'cust-emp-6', name: 'Dmitry Volkov', company: 'Ural Gas Corp', account_type: 'Business Line', credit_limit: 5000000, balance: 1200000, card_number: '4532 **** **** 9901', expiry_date: '12/27', status: 'Active', credit_score: 685 },
  ]);
  console.log('  ✓ employee_customers (+4)');

  await upsert(db, 'invoices', [
    { id: 'INV-001', invoice_number: 'APEX-2026-0142', client_name: 'Vance Tech', amount: 45000, issue_date: '2026-06-20', status: 'Outstanding', due_date: '2026-07-20', category: 'Consulting' },
    { id: 'INV-002', invoice_number: 'APEX-2026-0143', client_name: 'Al-Rashid Holdings', amount: 125000, issue_date: '2026-06-18', status: 'Paid', due_date: '2026-07-18', category: 'Advisory' },
    { id: 'INV-003', invoice_number: 'APEX-2026-0144', client_name: 'Neo Tokyo Ventures', amount: 89000, issue_date: '2026-06-15', status: 'Outstanding', due_date: '2026-07-15', category: 'Infrastructure' },
  ]);
  console.log('  ✓ invoices (+3)');

  await upsert(db, 'documents', [
    { id: 'DOC-001', title: 'Q2 Compliance Report', name: 'Q2_Compliance_2026.pdf', doc_type: 'Reports', file_size: '2.4 MB', uploaded_by: 'Sarah Jenkins', status: 'Verified' },
    { id: 'DOC-002', title: 'Hyderabad Branch Lease', name: 'HYD_Lease_Agreement.pdf', doc_type: 'Contracts', file_size: '1.1 MB', uploaded_by: 'Priya Menon', status: 'Verified' },
    { id: 'DOC-003', title: 'Fraud Investigation — CUST-755', name: 'Fraud_CUST755.pdf', doc_type: 'Legal', file_size: '890 KB', uploaded_by: 'Rahul Verma', status: 'Pending Review' },
  ]);
  console.log('  ✓ documents (+3)');

  await upsert(db, 'saving_targets', [
    { id: 'target-loans', name: 'Loans', current_amount: 87000, target_amount: 150000, color: '#a855f7' },
    { id: 'target-deposits', name: 'Deposits', current_amount: 98000, target_amount: 150000, color: '#ec4899' },
  ]);
  console.log('  ✓ saving_targets (updated)');

  await db.from('platform_settings').upsert({
    key: 'admin_dashboard',
    value: { balance: 892000, loans: 87000, interestRate: 5.75 },
    updated_at: new Date().toISOString(),
  });
  console.log('  ✓ platform_settings (updated)');

  const tables = [
    'students', 'employees', 'branches', 'bank_transactions', 'bank_loans',
    'bank_cards', 'fixed_deposits', 'fraud_alerts', 'inbox_messages',
    'audit_logs', 'support_tickets', 'admin_tasks', 'employee_payments',
    'credit_products', 'employee_customers', 'invoices', 'documents', 'saving_targets',
  ];

  console.log('\n── Table row counts ──');
  for (const table of tables) {
    const { count } = await db.from(table).select('*', { count: 'exact', head: true });
    console.log(`  ${table}: ${count ?? 0}`);
  }

  console.log('\n[Apex Bank] Expanded seed complete.');
}

main().catch((e) => {
  console.error('[Apex Bank] Seed failed:', e.message);
  process.exit(1);
});
