'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getSession } from './admin';

// SECURITY: Reusable authorization check for Admin CMS writes
async function verifySuperAdmin() {
  const session = await getSession();
  if (!session) return { authorized: false, error: 'Unauthorized login state' };
  if (session.role !== 'Ketua Umum' && session.role !== 'Wakil Ketua Umum') {
    return { authorized: false, error: 'Akses Ditolak. Tabel CMS ini hanya dikendalikan Ketua/Wakil Ketua Umum.' };
  }
  return { authorized: true, error: null };
}

// ============================================
// GALLERIES
// ============================================

export async function getGallery() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    return data || [];
  } catch { return []; }
}

export async function saveGalleryItem(id: string | null, payload: { title: string, category: string, image_url: string }) {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) return { success: false, error: auth.error };

  const supabase = await createClient();
  let error;
  if (id) {
    ({ error } = await supabase.from('gallery').update(payload).eq('id', id));
  } else {
    ({ error } = await supabase.from('gallery').insert(payload));
  }
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/galeri');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteGalleryItem(id: string) {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) return { success: false, error: auth.error };
  const supabase = await createClient();
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  revalidatePath('/galeri');
  revalidatePath('/admin/dashboard');
  return { success: !error, error: error?.message };
}


// ============================================
// ACHIEVEMENTS
// ============================================

export async function getAchievements() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('achievements').select('*').order('created_at', { ascending: false });
    return data || [];
  } catch { return []; }
}

export async function saveAchievement(id: string | null, payload: { title: string, date: string, description: string, image_url: string }) {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) return { success: false, error: auth.error };

  const supabase = await createClient();
  let error;
  if (id) {
    ({ error } = await supabase.from('achievements').update(payload).eq('id', id));
  } else {
    ({ error } = await supabase.from('achievements').insert(payload));
  }
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/prestasi');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteAchievement(id: string) {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) return { success: false, error: auth.error };
  const supabase = await createClient();
  const { error } = await supabase.from('achievements').delete().eq('id', id);
  revalidatePath('/prestasi');
  revalidatePath('/admin/dashboard');
  return { success: !error, error: error?.message };
}

// ============================================
// DIVISIONS INFO (QUOTAS & DESCRIPTION)
// ============================================

export async function getDivisionsInfo() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('divisions_info').select('*').order('id', { ascending: true });
    return data || [];
  } catch { return []; }
}

export async function saveDivisionInfo(id: string, payload: { name: string, quota: number, description: string }) {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) return { success: false, error: auth.error };

  const supabase = await createClient();
  const { error } = await supabase.from('divisions_info').update(payload).eq('id', id);
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/divisi');
  revalidatePath('/rekrutmen');
  revalidatePath('/admin/dashboard');
  return { success: true };
}


// ============================================
// TESTIMONIALS
// ============================================

export async function getTestimonials() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    return data || [];
  } catch { return []; }
}

export async function saveTestimonial(id: string | null, payload: { name: string, role: string, content: string, image_url: string }) {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) return { success: false, error: auth.error };

  const supabase = await createClient();
  let error;
  if (id) {
    ({ error } = await supabase.from('testimonials').update(payload).eq('id', id));
  } else {
    ({ error } = await supabase.from('testimonials').insert(payload));
  }
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/tentang');
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) return { success: false, error: auth.error };
  const supabase = await createClient();
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  revalidatePath('/tentang');
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: !error, error: error?.message };
}
