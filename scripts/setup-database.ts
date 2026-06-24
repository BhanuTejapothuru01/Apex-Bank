import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import postgres from 'postgres';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, '../supabase/schema.sql');

async function main() {
  let dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

  if (!dbUrl && process.env.SUPABASE_DB_PASSWORD && process.env.VITE_SUPABASE_URL) {
    const ref = process.env.VITE_SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    const encoded = encodeURIComponent(process.env.SUPABASE_DB_PASSWORD);
    if (ref) {
      dbUrl = `postgresql://postgres:${encoded}@db.${ref}.supabase.co:5432/postgres`;
    }
  }

  if (!dbUrl) {
    console.error(`
[Apex Bank] SUPABASE_DB_URL is not set.

1. Open Supabase Dashboard → Project Settings → Database
2. Copy the "URI" connection string (Session pooler)
3. Add to .env:  SUPABASE_DB_URL=postgresql://postgres.[ref]:[YOUR-PASSWORD]@...

Or paste supabase/schema.sql into the SQL Editor:
https://supabase.com/dashboard/project/lbkfakhzknokxftxczbm/sql/new
`);
    process.exit(1);
  }

  const sql = fs.readFileSync(schemaPath, 'utf8');
  const db = postgres(dbUrl, { ssl: 'require', max: 1 });

  try {
    console.log('[Apex Bank] Applying schema…');
    await db.unsafe(sql);
    console.log('[Apex Bank] Schema applied successfully.');
  } finally {
    await db.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error('[Apex Bank] Setup failed:', err.message);
  console.error('\nFallback: paste supabase/schema.sql into Supabase SQL Editor.');
  process.exit(1);
});
