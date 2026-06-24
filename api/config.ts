export default function handler(
  _req: { method?: string },
  res: {
    status: (code: number) => { json: (body: unknown) => void };
    setHeader: (name: string, value: string) => void;
  },
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    res.status(503).json({ error: 'Supabase not configured' });
    return;
  }
  res.status(200).json({ supabaseUrl, supabaseAnonKey });
}
