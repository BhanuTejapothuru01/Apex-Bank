import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, requireSupabase } from '@/lib/supabaseClient';
import { subscribeToTable } from '@/lib/realtime';

export type DbRow = Record<string, unknown>;

export interface UseSupabaseTableOptions<T> {
  table: string;
  mapRow: (row: DbRow) => T;
  fallback: T[];
  idKey?: keyof T & string;
  orderColumn?: string;
  filter?: { column: string; value: string };
  enabled?: boolean;
}

export interface UseSupabaseTableResult<T> {
  data: T[];
  setData: Dispatch<SetStateAction<T[]>>;
  connected: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  upsert: (row: DbRow) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

function mergeRow<T>(
  items: T[],
  mapped: T,
  idKey: keyof T & string,
  event: 'INSERT' | 'UPDATE' | 'DELETE'
): T[] {
  const id = mapped[idKey];
  if (event === 'DELETE') {
    return items.filter((item) => item[idKey] !== id);
  }
  const idx = items.findIndex((item) => item[idKey] === id);
  if (idx === -1) return [mapped, ...items];
  const next = [...items];
  next[idx] = mapped;
  return next;
}

export function useSupabaseTable<T>(
  options: UseSupabaseTableOptions<T>
): UseSupabaseTableResult<T> {
  const {
    table,
    mapRow,
    fallback,
    idKey = 'id' as keyof T & string,
    orderColumn = 'created_at',
    filter,
    enabled = true,
  } = options;

  const [data, setData] = useState<T[]>(fallback);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const fetchRows = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      const client = requireSupabase();
      let query = client.from(table).select('*').order(orderColumn, { ascending: false });
      if (filter) {
        query = query.eq(filter.column, filter.value);
      }
      const { data: rows, error: fetchError } = await query;
      if (fetchError) {
        if (fetchError.code === 'PGRST205') {
          setError('Database tables not set up — run supabase/schema.sql');
          return;
        }
        throw fetchError;
      }
      setData((rows ?? []).map((row) => mapRow(row as DbRow)));
      setConnected(true);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Database fetch failed';
      setError(message);
      console.warn(`[Supabase] ${table}:`, message);
    } finally {
      setLoading(false);
    }
  }, [enabled, table, mapRow, orderColumn, filter?.column, filter?.value]);

  useEffect(() => {
    if (!enabled) return;

    fetchRows();

    if (!supabase) return;

    channelRef.current = subscribeToTable(
      table,
      filter,
      (payload) => {
        const event = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
        const row = (payload.new ?? payload.old) as DbRow;
        if (!row || Object.keys(row).length === 0) return;
        const mapped = mapRow(row);
        setData((prev) => mergeRow(prev, mapped, idKey, event));
        setConnected(true);
      },
      () => setConnected(true)
    );

    return () => {
      if (channelRef.current && supabase) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [enabled, table, fetchRows, mapRow, idKey, filter?.column, filter?.value]);

  const upsert = useCallback(
    async (row: DbRow) => {
      const client = requireSupabase();
      const { error: upsertError } = await client.from(table).upsert(row);
      if (upsertError) throw upsertError;
    },
    [table]
  );

  const remove = useCallback(
    async (id: string) => {
      const client = requireSupabase();
      const { error: deleteError } = await client.from(table).delete().eq('id', id);
      if (deleteError) throw deleteError;
    },
    [table]
  );

  return { data, setData, connected, loading, error, refresh: fetchRows, upsert, remove };
}
