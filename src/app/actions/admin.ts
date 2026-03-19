'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { notifyRegistration, notifyAccepted } from './whatsapp';

export async function getRecruitmentStatus() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('system_settings').select('recruitment_open').eq('id', 1).single();
    return data?.recruitment_open ?? false;
  } catch {
    return false;
  }
}

export async function toggleRecruitment() {
  const supabase = await createClient();
  const current = await getRecruitmentStatus();
  await supabase.from('system_settings').update({ recruitment_open: !current }).eq('id', 1);
  revalidatePath('/rekrutmen');
  revalidatePath('/admin/dashboard');
  return !current;
}

export async function login(email: string, password: string) {
  let isSuccess = false;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error || !data.user) {
      return { success: false, error: 'Kredensial tidak valid' };
    }
    isSuccess = true;
  } catch (e: any) {
    return { success: false, error: 'Koneksi database gagal (cek URL/Key)' };
  }

  if (isSuccess) {
    redirect('/admin/dashboard');
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin');
}

export async function getSession() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    // Fetch Extended Profile including roles
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!profile) return null;

    return {
      id: user.id,
      email: profile.email,
      role: profile.role,
      division: profile.division,
      name: profile.full_name
    };
  } catch (e) {
    return null;
  }
}

// === NEW RECRUITMENT FUNCTIONS ===

export async function submitRegistration(formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const division = formData.get('division') as string;
  const motivation = formData.get('motivation') as string;

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('registrations').insert({
      full_name: fullName,
      email,
      phone_number: phone,
      division_choice: division,
      motivation
    });

    if (error) return { success: false, error: error.message };

    // Fire & Forget WA Notification
    notifyRegistration(phone, fullName, division);

    return { success: true };
  } catch (e: any) {
    return { success: false, error: 'Gagal menghubungi database' };
  }
}

export async function getRegistrations() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export async function updateRegistrationStatus(id: string, phone: string, name: string, division: string, status: 'accepted' | 'rejected') {
  try {
    const supabase = await createClient();
    await supabase.from('registrations').update({ status }).eq('id', id);
    
    if (status === 'accepted') {
      // Need to find the Ketua & Wakil profiles for this division to send their numbers via WA
      const { data: leaders } = await supabase.from('profiles')
        .select('role, full_name, phone_number')
        .eq('division', division)
        .in('role', ['Ketua Divisi', 'Wakil Ketua Divisi']);

      const ketua = leaders?.find(l => l.role === 'Ketua Divisi');
      const wakil = leaders?.find(l => l.role === 'Wakil Ketua Divisi');

      if (ketua) {
        notifyAccepted(
          phone, 
          name, 
          division, 
          ketua.full_name, 
          ketua.phone_number || '-', 
          wakil?.full_name || '', 
          wakil?.phone_number || null
        );
      }
    }

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// === NEW PROFILES MANAGEMENT FUNCTIONS ===

export async function getProfiles() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('profiles').select('*').order('role', { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

export async function updateOwnProfile(updates: any) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase.from('profiles').update(updates).eq('id', session.user.id);
    if (error) throw error;
    
    revalidatePath('/admin/dashboard');
    revalidatePath('/divisi');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateProfileAdmin(id: string, updates: any) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('profiles').update(updates).eq('id', id);
    if (error) throw error;
    
    revalidatePath('/admin/dashboard');
    revalidatePath('/divisi');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
