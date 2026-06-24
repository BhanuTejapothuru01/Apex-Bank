import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const USER = {
  customer_id: 'APEX-TEJA-001',
  full_name: 'Teja Pothurubhanu',
  email_address: '24691a3317@mits.ac.in',
  mobile_number: '9876543211',
  password: 'Teja@602142',
  account_number: 'APEX1000002469',
  account_type: 'Premium Savings',
  kyc_status: 'Verified',
  balance: 142450.75,
  city: 'Hyderabad',
  state: 'Telangana',
  risk_profile: 'Low',
  risk_score: 18,
  customer_status: 'Active',
  verified: true,
  branch_id: 'BR-NYC-01',
  customer_type: 'Retail',
  join_date: '2024-01-15',
};

async function ensureAuthUser(admin: ReturnType<typeof createClient>) {
  const email = USER.email_address;

  const { data: listed, error: listError } = await admin.auth.admin.listUsers();
  if (listError) {
    console.warn('[Apex Bank] Auth list skipped:', listError.message);
    return null;
  }

  const existing = listed.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (existing) {
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      password: USER.password,
      email_confirm: true,
      user_metadata: {
        full_name: USER.full_name,
        customer_id: USER.customer_id,
        provider: 'email',
      },
    });
    if (error) {
      console.warn('[Apex Bank] Auth update failed:', error.message);
      return null;
    }
    console.log('[Apex Bank] ✓ Supabase Auth user updated:', email);
    return data.user?.id ?? existing.id;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: USER.password,
    email_confirm: true,
    user_metadata: {
      full_name: USER.full_name,
      customer_id: USER.customer_id,
      provider: 'email',
    },
  });

  if (error) {
    console.warn('[Apex Bank] Auth create failed:', error.message);
    return null;
  }

  console.log('[Apex Bank] ✓ Supabase Auth user created:', email);
  return data.user?.id ?? null;
}

async function seedStudentProfile(admin: ReturnType<typeof createClient>, authUserId: string | null) {
  const { data: existing } = await admin
    .from('students')
    .select('id')
    .eq('email_address', USER.email_address)
    .maybeSingle();

  let studentId = existing?.id as string | undefined;

  if (studentId) {
    const { error } = await admin.from('students').update(USER).eq('id', studentId);
    if (error) throw error;
    console.log('[Apex Bank] ✓ Updated students row:', USER.email_address);
  } else {
    const { data, error } = await admin.from('students').insert(USER).select('id').single();
    if (error) throw error;
    studentId = data.id;
    console.log('[Apex Bank] ✓ Created students row:', USER.email_address);
  }

  if (authUserId && studentId) {
    await admin
      .from('students')
      .update({ customer_id: USER.customer_id })
      .eq('id', studentId);
  }

  await admin.from('bank_cards').upsert([
    {
      id: 'card-teja-debit',
      student_id: studentId,
      customer_name: USER.full_name,
      cardholder: USER.full_name,
      last4: '9024',
      credit_limit: 2000,
      daily_limit: 2000,
      expiry_date: '08/29',
      network: 'Visa',
      card_type: 'Visa Platinum Debit',
      credit_score: 815,
      status: 'Active',
    },
    {
      id: 'card-teja-credit',
      student_id: studentId,
      customer_name: USER.full_name,
      cardholder: USER.full_name,
      last4: '8842',
      credit_limit: 2500,
      daily_limit: 2500,
      expiry_date: '11/30',
      network: 'Mastercard',
      card_type: 'Credit Card',
      credit_score: 790,
      status: 'Active',
    },
  ]);

  await admin.from('savings_vaults').upsert([
    {
      id: 'vault-teja-1',
      student_id: studentId,
      name: 'Paris Holiday 2026',
      target_amount: 8500,
      current_amount: 6200,
      category: 'Travel',
    },
    {
      id: 'vault-teja-2',
      student_id: studentId,
      name: 'Emergency Fund',
      target_amount: 25000,
      current_amount: 18000,
      category: 'Finance',
    },
  ]);

  return studentId;
}

async function main() {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('[Apex Bank] Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
  }

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  console.log('[Apex Bank] Provisioning Supabase Auth + customer profile…\n');

  const authUserId = await ensureAuthUser(admin);

  try {
    const studentId = await seedStudentProfile(admin, authUserId);
    console.log('[Apex Bank]   Student ID:', studentId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('Could not find the table')) {
      console.log('\n[Apex Bank] Auth user is ready, but students table is missing.');
      console.log('Run supabase/schema.sql in SQL Editor, then run this script again.');
    } else {
      console.error('[Apex Bank] Students seed failed:', message);
    }
  }

  console.log('\n── Login (Customer portal) ──');
  console.log('Email:    24691a3317@mits.ac.in');
  console.log('Password: Teja@602142');
  console.log('Works via: Supabase Auth + students table');
}

main().catch((err) => {
  console.error('[Apex Bank]', err.message);
  process.exit(1);
});
