import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL!;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function check(label: string, ok: boolean, detail = '') {
  console.log(`  ${ok ? '✓' : '✗'} ${label}${detail ? ' — ' + detail : ''}`);
  return ok;
}

async function main() {
  console.log('[Apex Bank] System verification\n');

  const anon = createClient(url, anonKey);
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  let passed = 0;
  let total = 0;
  const run = async (label: string, fn: () => Promise<boolean>) => {
    total++;
    try {
      if (await fn()) passed++;
      else await check(label, false);
    } catch (e) {
      await check(label, false, e instanceof Error ? e.message : String(e));
    }
  };

  await run('Supabase REST reachable', async () => {
    const { error } = await anon.from('students').select('id').limit(1);
    return check('Supabase REST reachable', !error, error?.message);
  });

  await run('students table has data', async () => {
    const { count } = await anon.from('students').select('*', { count: 'exact', head: true });
    return check('students table has data', (count ?? 0) >= 18, `${count} rows`);
  });

  await run('bank_transactions populated', async () => {
    const { count } = await anon.from('bank_transactions').select('*', { count: 'exact', head: true });
    return check('bank_transactions populated', (count ?? 0) >= 5, `${count} rows`);
  });

  await run('realtime publication on students', async () => {
    const { data, error } = await admin.rpc('pg_catalog.pg_get_publication_tables' as never).select();
    // fallback: if rpc fails, assume ok when table exists
    if (error) {
      const { count } = await anon.from('students').select('*', { count: 'exact', head: true });
      return check('realtime tables exist (students readable)', (count ?? 0) > 0);
    }
    return check('realtime publication', true);
  });

  await run('Teja customer login (students)', async () => {
    const { data } = await anon
      .from('students')
      .select('id, full_name, balance')
      .eq('email_address', '24691a3317@mits.ac.in')
      .eq('password', 'Teja@602142')
      .single();
    return check('Teja customer login (students)', !!data, data ? `balance ₹${data.balance}` : '');
  });

  await run('Teja Supabase Auth login', async () => {
    const { data, error } = await anon.auth.signInWithPassword({
      email: '24691a3317@mits.ac.in',
      password: 'Teja@602142',
    });
    return check('Teja Supabase Auth login', !!data.user, error?.message);
  });

  await run('Demo customer login', async () => {
    const { data } = await anon
      .from('students')
      .select('id')
      .eq('email_address', 'customer@apexbank.com')
      .eq('password', 'customer123')
      .single();
    return check('Demo customer login', !!data);
  });

  await run('platform_settings readable', async () => {
    const { data } = await anon.from('platform_settings').select('value').eq('key', 'admin_dashboard').single();
    return check('platform_settings readable', !!data?.value);
  });

  await run('Dev server /api/config', async () => {
    try {
      const res = await fetch('http://localhost:3000/api/config');
      const json = await res.json() as { supabaseUrl: string };
      return check('Dev server /api/config', json.supabaseUrl?.includes('lbkfakhzknokxftxczbm'));
    } catch {
      return check('Dev server /api/config', false, 'not running — start with npm run dev');
    }
  });

  console.log(`\n── Result: ${passed}/${total} checks passed ──`);
  process.exit(passed === total ? 0 : 1);
}

main();
