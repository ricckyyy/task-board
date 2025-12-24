import { createClient } from '@supabase/supabase-js';
import { Task } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'set' : 'missing');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'set' : 'missing');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

// タスクを全取得（ログインユーザーのみ）
export async function fetchTasks(): Promise<Task[]> {
  const isDevelopment = process.env.NODE_ENV === 'development';
  console.log('fetchTasks called, isDevelopment:', isDevelopment);
  
  // 開発環境では認証なしで全件取得
  if (isDevelopment) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }

    console.log('Fetched tasks:', data);
    return data || [];
  }
  
  // 本番環境では認証必須
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  return data || [];
}

// タスクを作成
export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Task | null> {
  const isDevelopment = process.env.NODE_ENV === 'development';
  console.log('createTask called, isDevelopment:', isDevelopment);
  console.log('task data:', task);
  
  // 開発環境では認証なしで作成
  if (isDevelopment) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return null;
    }

    console.log('Created task:', data);
    return data;
  }
  
  // 本番環境では認証必須
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ ...task, user_id: user.id }])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    return null;
  }

  return data;
}

// タスクを更新
export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    return null;
  }

  return data;
}

// タスクを削除
export async function deleteTask(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    return false;
  }

  return true;
}