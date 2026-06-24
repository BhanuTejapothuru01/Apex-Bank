import 'dotenv/config';
import { execSync } from 'child_process';

function run(label: string, cmd: string) {
  console.log(`\n[Apex Bank] ${label}…`);
  try {
    execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
  } catch {
    console.warn(`[Apex Bank] ${label} skipped or failed — see messages above.`);
  }
}

async function main() {
  console.log('[Apex Bank] Realtime bootstrap\n');

  if (process.env.SUPABASE_DB_URL || process.env.DATABASE_URL) {
    run('Applying database schema', 'npm run db:setup');
  } else {
    console.log(`No SUPABASE_DB_URL in .env — apply schema manually:
  https://supabase.com/dashboard/project/lbkfakhzknokxftxczbm/sql/new
  Paste: supabase/schema.sql\n`);
  }

  run('Seeding Teja customer + Auth', 'npm run db:seed-teja');
  run('Verifying connection', 'npm run db:check');

  console.log('\n[Apex Bank] Realtime is ready when db:check passes.');
  console.log('Open two browser tabs — edit data in Supabase Table Editor and watch Live badges update.');
}

main();
