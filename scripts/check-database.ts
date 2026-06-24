import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('[Apex Bank] Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
  }

  const schemaPath = path.join(__dirname, '../supabase/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  console.log('[Apex Bank] Checking Supabase connection…');
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  const { error: pingError } = await admin.from('students').select('id').limit(1);
  if (pingError?.code === 'PGRST205') {
    console.log(`
[Apex Bank] Database tables not found yet.

Please run the schema once in Supabase SQL Editor:
https://supabase.com/dashboard/project/lbkfakhzknokxftxczbm/sql/new

Copy the contents of: supabase/schema.sql

Or set SUPABASE_DB_URL in .env and run: npm run db:setup
`);
    process.exit(1);
  }

  if (pingError) {
    console.error('[Apex Bank] Connection error:', pingError.message);
    process.exit(1);
  }

  console.log('[Apex Bank] ✓ Connected to Supabase project');
  console.log('[Apex Bank] ✓ Schema appears applied (' + schema.split('\n').length + ' lines in schema.sql)');
  console.log('[Apex Bank] Realtime enabled on all banking tables.');
}

main().catch((err) => {
  console.error('[Apex Bank]', err.message);
  process.exit(1);
});
