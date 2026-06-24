import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, requireSupabase } from '@/lib/supabaseClient';
import { subscribeToTable, type DbRow } from '@/lib/realtime';
import { persistPlatformSetting } from '@/lib/db/sync';

export function useSupabaseSetting<T extends Record<string, unknown>>(
  key: string,
  fallback: T
): {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
  connected: boolean;
  persist: (next: T) => Promise<void>;
} {
  const [value, setValue] = useState<T>(fallback);
  const [connected, setConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const client = requireSupabase();
        const { data, error } = await client
          .from('platform_settings')
          .select('value')
          .eq('key', key)
          .maybeSingle();
        if (error && error.code !== 'PGRST205') throw error;
        if (data?.value && typeof data.value === 'object') {
          setValue({ ...fallback, ...(data.value as T) });
          setConnected(true);
        }
      } catch (err) {
        console.warn(`[Supabase] platform_settings/${key}:`, err);
      }
    };

    void load();

    if (!supabase) return;

    channelRef.current = subscribeToTable(
      'platform_settings',
      { column: 'key', value: key },
      (payload) => {
        const row = (payload.new ?? payload.old) as DbRow;
        if (row?.value && typeof row.value === 'object') {
          setValue({ ...fallback, ...(row.value as T) });
        }
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
  }, [key]);

  const persist = useCallback(
    async (next: T) => {
      setValue(next);
      await persistPlatformSetting(key, next);
      setConnected(true);
    },
    [key]
  );

  return { value, setValue, connected, persist };
}
