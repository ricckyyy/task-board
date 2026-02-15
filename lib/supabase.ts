// filepath: /home/rt/dev-task-board/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Task } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'set' : 'missing');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'set' : 'missing');
} else {
  console.log('✅ Supabase environment variables configured');
  console.log('Supabase URL:', supabaseUrl);
}

let _supabase: any = null;
if (supabaseUrl && supabaseAnonKey) {
  _supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
} else {
  _supabase = {
    auth: {
      getUser: async () => ({ data: { user: null } }),
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({}),
    },
    from: (_: string) => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ error: null }),
      order: function () { return this; },
      eq: function () { return this; },
      single: function () { return this; },
    }),
  };
}

export const supabase = _supabase;

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

export async function fetchTasks(): Promise<Task[]> {
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('order', { ascending: true });
    if (error) return [];
    return data || [];
  }

  const { data: { user } = { user: null } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
  if (!user) return [];

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('order', { ascending: true });

  if (error) return [];
  return data || [];
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Task | null> {
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    if (error) return null;
    return data;
  }

  const { data: { user } = { user: null } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
  if (!user) return null;

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ ...task, user_id: user.id }])
    .select()
    .single();

  if (error) return null;
  return data;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return data;
}

export async function deleteTask(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) return false;
  return true;
}
