import { requireSupabase, supabase } from '@/lib/supabaseClient';

export async function persistStudentBalance(studentId: string, balance: number): Promise<void> {
  if (!supabase || !studentId || studentId.startsWith('demo-')) return;
  const { error } = await requireSupabase()
    .from('students')
    .update({ balance, updated_at: new Date().toISOString() })
    .eq('id', studentId);
  if (error) console.warn('[Apex Bank] Balance sync failed:', error.message);
}

export async function persistPlatformSetting(
  key: string,
  value: Record<string, unknown>
): Promise<void> {
  if (!supabase) return;
  const { error } = await requireSupabase()
    .from('platform_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) console.warn('[Apex Bank] Settings sync failed:', error.message);
}
