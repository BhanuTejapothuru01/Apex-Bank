import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

export type StudentRow = Record<string, unknown>;
export type DbRow = Record<string, unknown>;

export interface RealtimePayload {
  eventType: string;
  new: DbRow | null;
  old: DbRow | null;
}

export function subscribeToStudent(
  studentId: string,
  onChange: (row: StudentRow) => void
): RealtimeChannel | null {
  return subscribeToTable(
    'students',
    { column: 'id', value: studentId },
    (payload) => {
      const row = (payload.new ?? payload.old) as StudentRow;
      if (row && Object.keys(row).length > 0) onChange(row);
    }
  );
}

export function subscribeToTable(
  table: string,
  filter?: { column: string; value: string },
  onChange?: (payload: RealtimePayload) => void,
  onSubscribed?: () => void
): RealtimeChannel | null {
  if (!supabase) return null;

  const channelName = filter
    ? `${table}-${filter.column}-${filter.value}`
    : `${table}-all`;

  const channel = supabase.channel(channelName);

  const config: {
    event: '*';
    schema: 'public';
    table: string;
    filter?: string;
  } = {
    event: '*',
    schema: 'public',
    table,
  };

  if (filter) {
    config.filter = `${filter.column}=eq.${filter.value}`;
  }

  channel.on('postgres_changes', config, (payload) => {
    onChange?.({
      eventType: payload.eventType,
      new: payload.new as DbRow | null,
      old: payload.old as DbRow | null,
    });
  });

  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') onSubscribed?.();
    if (status === 'CHANNEL_ERROR') {
      console.warn(`[Supabase Realtime] Channel error on ${table}`);
    }
  });

  return channel;
}

export async function fetchStudentById(client: SupabaseClient, studentId: string) {
  const { data, error } = await client.from('students').select('*').eq('id', studentId).single();
  if (error) throw error;
  return data as StudentRow;
}

export async function fetchStudentByEmail(client: SupabaseClient, email: string) {
  const { data, error } = await client
    .from('students')
    .select('*')
    .eq('email_address', email)
    .maybeSingle();
  if (error) throw error;
  return data as StudentRow | null;
}
