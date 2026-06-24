-- Apex Bank — full Supabase schema (all portals + realtime)
-- Run via: npm run db:setup   OR paste in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/lbkfakhzknokxftxczbm/sql/new

create extension if not exists "pgcrypto";

-- ── Shared trigger ──
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Branches ──
create table if not exists public.branches (
  id text primary key,
  name text not null,
  manager text,
  location text,
  total_deposits numeric(14, 2) default 0,
  active_accounts integer default 0,
  rating numeric default 0,
  status text default 'Operational',
  created_at timestamptz not null default now()
);

-- ── Students / Customers (landing + customer + super-admin) ──
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  customer_id text unique,
  full_name text not null,
  email_address text unique not null,
  mobile_number text,
  password text not null,
  pan_number text,
  account_type text default 'Savings Account',
  account_number text unique,
  ifsc_code text default 'APEX0001234',
  branch_name text default 'Apex Bank Headquarters',
  kyc_status text default 'Pending',
  city text,
  state text,
  gender text,
  date_of_birth date,
  balance numeric(14, 2) default 50000,
  risk_profile text default 'Low',
  risk_score integer default 0,
  customer_status text default 'Active',
  verified boolean default true,
  branch_id text references public.branches(id),
  customer_type text default 'Retail',
  join_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists students_email_idx on public.students (email_address);
create index if not exists students_mobile_idx on public.students (mobile_number);
create index if not exists students_customer_id_idx on public.students (customer_id);

drop trigger if exists students_updated_at on public.students;
create trigger students_updated_at
  before update on public.students
  for each row execute function public.set_updated_at();

-- ── Employees ──
create table if not exists public.employees (
  id text primary key,
  name text not null,
  email text unique,
  role text,
  department text,
  branch_id text references public.branches(id),
  status text default 'Active',
  rating numeric default 0,
  join_date date,
  performance integer default 0,
  password text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists employees_updated_at on public.employees;
create trigger employees_updated_at
  before update on public.employees
  for each row execute function public.set_updated_at();

-- ── Bank transactions (all portals) ──
create table if not exists public.bank_transactions (
  id text primary key,
  student_id uuid references public.students(id) on delete set null,
  customer_id text,
  customer_name text,
  merchant text,
  sender text,
  recipient text,
  name text,
  amount numeric not null default 0,
  tx_type text,
  tx_direction text,
  category text,
  tag text,
  status text default 'completed',
  notes text,
  reference text,
  tx_time text,
  fraud_risk_score integer default 0,
  source_branch_id text,
  icon_name text,
  portal text default 'customer',
  transaction_date timestamptz default now(),
  created_at timestamptz not null default now()
);

create index if not exists bank_transactions_student_idx on public.bank_transactions (student_id);
create index if not exists bank_transactions_portal_idx on public.bank_transactions (portal);

-- ── Loans ──
create table if not exists public.bank_loans (
  id text primary key,
  student_id uuid references public.students(id) on delete set null,
  customer_id text,
  customer_name text,
  applicant_name text,
  company_name text,
  loan_type text,
  purpose text,
  amount numeric not null default 0,
  status text default 'Pending',
  duration_months integer,
  term_years integer,
  interest_rate numeric default 0,
  requested_date date,
  date_applied date,
  risk_score integer default 0,
  credit_score integer default 0,
  income numeric default 0,
  existing_liabilities numeric default 0,
  dti numeric default 0,
  risk_rating text,
  decision_reason text,
  verification jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists bank_loans_updated_at on public.bank_loans;
create trigger bank_loans_updated_at
  before update on public.bank_loans
  for each row execute function public.set_updated_at();

-- ── Cards ──
create table if not exists public.bank_cards (
  id text primary key,
  student_id uuid references public.students(id) on delete cascade,
  customer_id text,
  customer_name text,
  cardholder text,
  card_number text,
  last4 text,
  credit_limit numeric default 0,
  balance numeric default 0,
  status text default 'Active',
  expiry_date text,
  network text default 'Visa',
  is_virtual boolean default false,
  is_frozen boolean default false,
  daily_limit numeric default 2000,
  contactless_enabled boolean default true,
  color_type text default 'classic-pink',
  card_type text,
  credit_score integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists bank_cards_updated_at on public.bank_cards;
create trigger bank_cards_updated_at
  before update on public.bank_cards
  for each row execute function public.set_updated_at();

-- ── Savings vaults ──
create table if not exists public.savings_vaults (
  id text primary key,
  student_id uuid references public.students(id) on delete cascade,
  name text not null,
  target_amount numeric default 0,
  current_amount numeric default 0,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists savings_vaults_updated_at on public.savings_vaults;
create trigger savings_vaults_updated_at
  before update on public.savings_vaults
  for each row execute function public.set_updated_at();

-- ── Fixed deposits ──
create table if not exists public.fixed_deposits (
  id text primary key,
  customer_name text,
  amount numeric default 0,
  interest_rate numeric default 0,
  duration_months integer default 12,
  start_date date,
  status text default 'Active',
  created_at timestamptz not null default now()
);

-- ── Fraud alerts ──
create table if not exists public.fraud_alerts (
  id text primary key,
  source text,
  reason text,
  amount numeric default 0,
  risk_probability integer default 0,
  alert_time text,
  status text default 'Pending',
  location text,
  device_type text,
  created_at timestamptz not null default now()
);

-- ── Invoices ──
create table if not exists public.invoices (
  id text primary key,
  invoice_number text,
  client_name text,
  amount numeric default 0,
  issue_date date,
  status text default 'Outstanding',
  due_date text,
  category text,
  items jsonb default '[]',
  created_at timestamptz not null default now()
);

-- ── Documents ──
create table if not exists public.documents (
  id text primary key,
  title text,
  name text,
  doc_type text,
  file_size text,
  file_extension text default 'pdf',
  uploaded_by text,
  uploaded_at timestamptz default now(),
  status text default 'Verified',
  created_at timestamptz not null default now()
);

-- ── Inbox messages (employee + super-admin) ──
create table if not exists public.inbox_messages (
  id text primary key,
  sender_name text,
  employee_id text,
  branch_name text,
  subject text,
  content text,
  preview text,
  message_type text,
  message_time text,
  priority text default 'Medium',
  avatar_color text default 'bg-pink-500',
  is_read boolean default false,
  is_archived boolean default false,
  status text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

-- ── Audit logs ──
create table if not exists public.audit_logs (
  id text primary key,
  user_email text,
  action text not null,
  ip_address text,
  severity text default 'Info',
  created_at timestamptz not null default now()
);

-- ── Support tickets ──
create table if not exists public.support_tickets (
  id text primary key,
  customer_name text,
  subject text,
  status text default 'Open',
  priority text default 'Medium',
  ticket_date date,
  created_at timestamptz not null default now()
);

-- ── Admin tasks ──
create table if not exists public.admin_tasks (
  id text primary key,
  title text not null,
  status text default 'Pending',
  task_date date,
  priority text default 'Medium',
  created_at timestamptz not null default now()
);

-- ── Employee payments ──
create table if not exists public.employee_payments (
  id text primary key,
  vendor text,
  category text,
  amount numeric default 0,
  due_date text,
  autopay boolean default false,
  color_class text default 'bg-pink-500',
  created_at timestamptz not null default now()
);

-- ── Credit products ──
create table if not exists public.credit_products (
  id text primary key,
  name text,
  rate numeric default 0,
  term text,
  status text default 'Active',
  applicants integer default 0,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

-- ── Employee portal customer cards ──
create table if not exists public.employee_customers (
  id text primary key,
  name text,
  company text,
  account_type text,
  credit_limit numeric default 0,
  balance numeric default 0,
  card_number text,
  expiry_date text,
  cvv text default '***',
  avatar_color text default 'bg-pink-500',
  status text default 'Active',
  credit_score integer default 700,
  aml_check text default 'Cleared',
  id_check text default 'Verified',
  incorp_check text default 'Verified',
  created_at timestamptz not null default now()
);

-- ── Saving targets (admin portal) ──
create table if not exists public.saving_targets (
  id text primary key,
  name text not null,
  current_amount numeric default 0,
  target_amount numeric default 0,
  color text default '#ec4899',
  created_at timestamptz not null default now()
);

-- ── Platform settings (admin metrics) ──
create table if not exists public.platform_settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- ── RLS (demo — open read/write) ──
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'students','branches','employees','bank_transactions','bank_loans','bank_cards',
    'savings_vaults','fixed_deposits','fraud_alerts','invoices','documents',
    'inbox_messages','audit_logs','support_tickets','admin_tasks','employee_payments',
    'credit_products','employee_customers','saving_targets','platform_settings'
  ]
  loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('drop policy if exists allow_all on public.%I', tbl);
    execute format('create policy allow_all on public.%I for all using (true) with check (true)', tbl);
  end loop;
end $$;

-- ── Realtime on all tables ──
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'students','branches','employees','bank_transactions','bank_loans','bank_cards',
    'savings_vaults','fixed_deposits','fraud_alerts','invoices','documents',
    'inbox_messages','audit_logs','support_tickets','admin_tasks','employee_payments',
    'credit_products','employee_customers','saving_targets','platform_settings'
  ]
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', tbl);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;

-- ══════════════════════════════════════
-- SEED DATA
-- ══════════════════════════════════════

insert into public.branches (id, name, manager, location, total_deposits, active_accounts, rating, status) values
  ('BR-NYC-01', 'New York Wall St. Flagship', 'Donald Vance', 'New York, USA', 458900000, 8490, 4.8, 'Operational'),
  ('BR-ZH-01', 'Zurich Elite Vault', 'Maximilian Kael', 'Zurich, Switzerland', 1250320000, 1250, 4.9, 'Operational'),
  ('BR-LDN-02', 'London Square Premium', 'Alistair Sterling', 'London, UK', 624500000, 4920, 4.7, 'Operational'),
  ('BR-TKY-03', 'Tokyo Neo Skyline', 'Masami Tanaka', 'Tokyo, Japan', 512400000, 3150, 4.8, 'Operational'),
  ('BR-SGP-04', 'Singapore Wharf Hub', 'Lawrence Wong', 'Singapore', 842100000, 5820, 4.6, 'Operational')
on conflict (id) do nothing;

insert into public.students (
  customer_id, full_name, email_address, mobile_number, password,
  account_number, account_type, kyc_status, balance, city, state,
  risk_profile, risk_score, customer_status, verified, branch_id, customer_type, join_date
) values
  ('APEX-DEMO-001', 'Demo Customer', 'customer@apexbank.com', '9876543210', 'customer123',
   'APEX1000000001', 'Premium Savings', 'Verified', 125000, 'Hyderabad', 'Telangana',
   'Low', 12, 'Active', true, 'BR-NYC-01', 'Retail', '2021-04-12'),
  ('CUST-802', 'Alistair Sterling', 'a.sterling@sterlingholdings.com', '+1 (555) 019-2831', 'demo123',
   'APEX8800000001', 'VIP Savings', 'Verified', 14250320.50, 'Zurich', 'Switzerland',
   'Low', 12, 'Active', true, 'BR-ZH-01', 'VIP', '2021-04-12'),
  ('CUST-415', 'Elena Rostova', 'elena.rostova@cybernet.io', '+44 7700 900077', 'demo123',
   'APEX8800000002', 'Corporate', 'Verified', 4890200.00, 'London', 'UK',
   'Medium', 45, 'Active', true, 'BR-LDN-02', 'VIP', '2022-09-18'),
  ('CUST-293', 'Marcus Vance', 'marcus.vance@vancetech.com', '+1 (555) 014-9988', 'demo123',
   'APEX8800000003', 'Corporate', 'Verified', 850020.00, 'New York', 'USA',
   'High', 78, 'Active', true, 'BR-NYC-01', 'Corporate', '2023-11-05'),
  ('CUST-104', 'Amara Diop', 'amara.diop@africadawn.org', '+33 6 1234 5678', 'demo123',
   'APEX8800000004', 'Savings', 'Pending', 12450.00, 'London', 'UK',
   'Critical', 92, 'Frozen', false, 'BR-LDN-02', 'Retail', '2024-05-10'),
  ('APEX-TEJA-001', 'Teja Pothurubhanu', '24691a3317@mits.ac.in', '9876543211', 'Teja@602142',
   'APEX1000002469', 'Premium Savings', 'Verified', 142450.75, 'Hyderabad', 'Telangana',
   'Low', 18, 'Active', true, 'BR-NYC-01', 'Retail', '2024-01-15')
on conflict (email_address) do update set
  password = excluded.password,
  full_name = excluded.full_name,
  balance = excluded.balance,
  kyc_status = excluded.kyc_status,
  customer_status = excluded.customer_status,
  updated_at = now();

insert into public.employees (id, name, email, role, department, branch_id, status, rating, join_date, performance) values
  ('EMP-001', 'Sarah Jenkins', 's.jenkins@apexbank.com', 'Senior Compliance Officer', 'Risk & Compliance', 'BR-NYC-01', 'Active', 4.8, '2018-02-15', 96),
  ('EMP-014', 'Maximilian Kael', 'm.kael@apexbank.com', 'Zurich Branch Manager', 'Branch Management', 'BR-ZH-01', 'Active', 4.9, '2015-08-10', 98),
  ('EMP-045', 'Vikram Naidu', 'v.naidu@apexbank.com', 'Lead Security Architect', 'Cybersecurity', 'BR-NYC-01', 'Active', 4.7, '2020-11-01', 94),
  ('EMP-092', 'Chloe Dupont', 'c.dupont@apexbank.com', 'Senior Loan Underwriter', 'Lending', 'BR-LDN-02', 'Active', 4.5, '2021-06-18', 91),
  ('EMP-108', 'Yuki Sato', 'y.sato@apexbank.com', 'Aesthetic UX Lead / IT Admin', 'Information Technology', 'BR-TKY-03', 'Active', 4.9, '2019-10-05', 97)
on conflict (id) do nothing;

insert into public.bank_transactions (id, customer_id, customer_name, merchant, amount, tx_type, tx_direction, category, status, fraud_risk_score, source_branch_id, portal, transaction_date) values
  ('TXN-98219', 'CUST-802', 'Alistair Sterling', 'Offshore Settlement', 1500000, 'Transfer', 'expense', 'Offshore Settlement', 'Success', 14, 'BR-ZH-01', 'super-admin', '2026-06-11T08:12:00Z'),
  ('TXN-98218', 'CUST-104', 'Amara Diop', 'ATM Fast Withdraw', 9800, 'Withdrawal', 'expense', 'ATM Fast Withdraw', 'Suspicious', 89, 'BR-LDN-02', 'super-admin', '2026-06-11T07:44:00Z'),
  ('tx-1', null, null, 'Blossom Boutiques Ltd', 320.50, 'expense', 'expense', 'Fashion', 'completed', 0, null, 'customer', '2026-06-10T14:32:00Z'),
  ('tx-2', null, null, 'Rosewood Fine Dining', 175.00, 'expense', 'expense', 'Dining', 'completed', 0, null, 'customer', '2026-06-09T19:15:00Z'),
  ('tx-emp-1', null, null, null, 120, 'Transfer', 'expense', 'Utility', 'Completed', 0, null, 'employee', '2026-06-12')
on conflict (id) do nothing;

insert into public.bank_loans (id, customer_id, customer_name, applicant_name, company_name, loan_type, amount, status, purpose, duration_months, interest_rate, requested_date, date_applied, risk_score, credit_score, income, existing_liabilities, dti, risk_rating, verification) values
  ('LOAN-1029', 'CUST-293', 'Marcus Vance', 'Marcus Vance', 'Vance Tech', 'Commercial Expansion Loan', 750000, 'Approved', 'Tech R&D Expansion', 36, 4.85, '2026-06-01', '2026-06-01', 32, 810, 380000, 65000, 17.1, 'Low', '{"kycStatus":true,"panCard":true,"aadhaarCard":true,"bankReconciled":true,"employmentCheck":"Verified"}'),
  ('LOAN-1030', 'CUST-089', 'Dmitry Volkov', 'Dmitry Volkov', 'Ural Gas', 'Working Capital', 5000000, 'Pending', 'Maritime Transport', 60, 6.25, '2026-06-08', '2026-06-08', 79, 685, 145000, 45000, 31.0, 'Medium', '{"kycStatus":true,"panCard":true,"aadhaarCard":false,"bankReconciled":true,"employmentCheck":"Pending"}'),
  ('loan-1', null, 'Andrew Sterling', 'Andrew Sterling', 'Kyros Lab Holdings', 'Commercial Expansion Loan', 150000, 'Pending', 'Commercial Expansion', 60, 6.25, '2026-06-12', '2026-06-12', 20, 810, 380000, 65000, 17.1, 'Low', '{"kycStatus":true,"panCard":true,"aadhaarCard":true,"bankReconciled":true,"employmentCheck":"Verified"}')
on conflict (id) do nothing;

insert into public.bank_cards (id, customer_id, customer_name, cardholder, card_number, last4, credit_limit, balance, status, expiry_date, network, is_virtual, is_frozen, daily_limit, card_type, credit_score) values
  ('CARD-4401', 'CUST-802', 'Alistair Sterling', 'Alistair Sterling', '4001 8829 0192 4821', '4821', 2000000, 85200, 'Active', '2029-12', 'Visa', false, false, 50000, 'Visa Platinum', 815),
  ('card-debit', null, 'Demo Customer', 'Demo Customer', '**** **** **** 9024', '9024', 2000, 0, 'Active', '08/29', 'Visa', false, false, 2000, 'Visa Platinum Debit', 815),
  ('card-1', null, 'Demo Customer', 'Demo Customer', '**** **** **** 8842', '8842', 2500, 0, 'Active', '11/30', 'Mastercard', false, false, 2500, 'Credit Card', 790)
on conflict (id) do nothing;

insert into public.savings_vaults (id, name, target_amount, current_amount, category) values
  ('vault-1', 'Paris Holiday 2026', 8500, 6200, 'Travel'),
  ('vault-2', 'Electric SUV Deposit', 15000, 12500, 'Automotive'),
  ('vault-3', 'Emergency Fund', 25000, 18000, 'Finance')
on conflict (id) do nothing;

insert into public.fixed_deposits (id, customer_name, amount, interest_rate, duration_months, start_date, status) values
  ('FD-501', 'Alistair Sterling', 5000000, 5.25, 24, '2025-01-10', 'Active'),
  ('FD-502', 'Kenji Takahashi', 10000000, 5.75, 36, '2024-06-15', 'Active')
on conflict (id) do nothing;

insert into public.fraud_alerts (id, source, reason, amount, risk_probability, alert_time, status, location, device_type) values
  ('alert-1', 'CUST-104', 'Multiple rapid ATM withdrawals', 9800, 89, '07:44 AM', 'Pending', 'London, UK', 'Mobile'),
  ('alert-2', 'CUST-415', 'Unusual crypto transfer pattern', 120000, 74, '10:30 PM', 'Pending', 'London, UK', 'Desktop')
on conflict (id) do nothing;

insert into public.inbox_messages (id, sender_name, employee_id, branch_name, subject, content, preview, message_type, message_time, priority, is_read, status) values
  ('MSG-4201', 'Admin – Hyderabad Main Branch', 'EMP-046', 'Hyderabad Main Branch', 'Leave Application Request', 'Applying for 3 days Casual Leave from 25–27 June 2026.', 'Applying for 3 days Casual Leave…', 'Leave Request', '2026-06-17 09:30 AM', 'High', false, 'Pending'),
  ('MSG-1081', 'Yuki Sato', 'EMP-108', 'Tokyo Neo Skyline', 'Emergency Sick Leave', 'Applying for 2 days Sick Leave due to influenza.', 'Applying for 2 days Sick Leave…', 'Leave Request', '2026-06-16 11:20 AM', 'Medium', false, 'Pending'),
  ('MSG-3051', 'Compliance System Bulletin', 'SYSTEM', 'Apex Corporate HQ', 'RBI Quarterly Audit Notice', 'All branch admins must complete KYC ledgers before June 30.', 'All branch admins must complete…', 'Announcement', '2026-06-15 08:00 AM', 'High', true, 'Approved')
on conflict (id) do nothing;

insert into public.bank_transactions (id, customer_id, customer_name, merchant, name, amount, tx_type, tx_direction, category, status, recipient, icon_name, portal, transaction_date) values
  ('tx-adm-1', null, null, 'Payroll Disbursement', 'Payroll Disbursement', 42000, 'Transfer', 'expense', 'Payroll', 'Completed', 'Operations Team', 'ReceiptText', 'admin', '2026-06-12T09:00:00Z'),
  ('tx-adm-2', null, null, 'Treasury Deposit', 'Treasury Deposit', 85000, 'Transfer', 'income', 'Treasury', 'Completed', 'Apex Holdings', 'TrendingUp', 'admin', '2026-06-11T14:30:00Z'),
  ('tx-adm-3', null, null, 'Loan Servicing Fee', 'Loan Servicing Fee', 3200, 'Transfer', 'income', 'Loans', 'Completed', 'Marcus Vance', 'TrendingUp', 'admin', '2026-06-10T11:15:00Z')
on conflict (id) do nothing;

insert into public.audit_logs (id, user_email, action, ip_address, severity, created_at) values
  ('LOG-5421', 'khanamsayeemakousar@gmail.com', 'System Session Initialized', '192.168.1.144', 'Info', '2026-06-11T08:35:10Z'),
  ('LOG-5420', 's.jenkins@apexbank.com', 'KYC Application Rejected [CUST-104]', '10.0.4.32', 'Warning', '2026-06-11T08:14:22Z')
on conflict (id) do nothing;

insert into public.support_tickets (id, customer_name, subject, status, priority, ticket_date) values
  ('TKT-312', 'Marcus Vance', 'Wire Transfer Limit Boost Review', 'In Progress', 'High', '2026-06-11'),
  ('TKT-311', 'Elena Rostova', 'MFA Token Reset', 'Open', 'High', '2026-06-10')
on conflict (id) do nothing;

insert into public.admin_tasks (id, title, status, task_date, priority) values
  ('TSK-01', 'Verify CUST-089 Pending documents', 'Pending', '2026-06-11', 'High'),
  ('TSK-02', 'Approve London Branch Performance Report', 'Completed', '2026-06-11', 'Medium')
on conflict (id) do nothing;

insert into public.employee_payments (id, vendor, category, amount, due_date, autopay, color_class) values
  ('pay-1', 'Apex Electricity', 'Utility', 120, '28th', true, 'bg-emerald-500'),
  ('pay-2', 'Premium Cloud Server', 'Infrastructure', 450, '28th', true, 'bg-indigo-500')
on conflict (id) do nothing;

insert into public.credit_products (id, name, rate, term, status, applicants) values
  ('cred-1', 'SME Growth Line', 6.5, '36 months', 'Active', 42),
  ('cred-2', 'Premium Personal Loan', 8.2, '24 months', 'Active', 128)
on conflict (id) do nothing;

insert into public.employee_customers (id, name, company, account_type, credit_limit, balance, card_number, expiry_date, status, credit_score) values
  ('cust-emp-1', 'Andrew Sterling', 'Kyros Lab Holdings', 'Corporate Credit', 500000, 142000, '4532 **** **** 8821', '08/29', 'Active', 810),
  ('cust-emp-2', 'Elwood Vance', 'Vance Dynamics', 'Business Line', 250000, 89000, '5109 **** **** 4421', '11/30', 'Active', 685)
on conflict (id) do nothing;

insert into public.saving_targets (id, name, current_amount, target_amount, color) values
  ('target-loans', 'Loans', 43000, 100000, '#a855f7'),
  ('target-deposits', 'Deposits', 56000, 120000, '#ec4899')
on conflict (id) do nothing;

insert into public.platform_settings (key, value) values
  ('admin_dashboard', '{"balance":562000,"loans":43000,"interestRate":5.5}')
on conflict (key) do nothing;

-- Link demo customer cards/vaults/transactions to demo student
do $$
declare
  demo_id uuid;
  teja_id uuid;
begin
  select id into demo_id from public.students where email_address = 'customer@apexbank.com' limit 1;
  if demo_id is not null then
    update public.bank_cards set student_id = demo_id where id in ('card-debit','card-1') and student_id is null;
    update public.savings_vaults set student_id = demo_id where student_id is null;
    update public.bank_transactions set student_id = demo_id where portal = 'customer' and student_id is null;
  end if;

  select id into teja_id from public.students where email_address = '24691a3317@mits.ac.in' limit 1;
  if teja_id is not null then
    insert into public.bank_cards (id, student_id, customer_name, cardholder, last4, credit_limit, daily_limit, expiry_date, network, card_type, credit_score, status) values
      ('card-teja-debit', teja_id, 'Teja Pothurubhanu', 'Teja Pothurubhanu', '9024', 2000, 2000, '08/29', 'Visa', 'Visa Platinum Debit', 815, 'Active'),
      ('card-teja-credit', teja_id, 'Teja Pothurubhanu', 'Teja Pothurubhanu', '8842', 2500, 2500, '11/30', 'Mastercard', 'Credit Card', 790, 'Active')
    on conflict (id) do update set student_id = excluded.student_id;

    insert into public.savings_vaults (id, student_id, name, target_amount, current_amount, category) values
      ('vault-teja-1', teja_id, 'Paris Holiday 2026', 8500, 6200, 'Travel'),
      ('vault-teja-2', teja_id, 'Emergency Fund', 25000, 18000, 'Finance')
    on conflict (id) do update set student_id = excluded.student_id;

    update public.bank_transactions set student_id = teja_id
      where portal = 'customer' and student_id is null and id in ('tx-1', 'tx-2');
  end if;
end $$;
