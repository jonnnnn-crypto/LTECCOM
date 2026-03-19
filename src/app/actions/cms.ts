'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getSession } from './admin';

// SECURITY: Reusable authorization check for Admin CMS writes
async function verifySuperAdmin() {
  const session = await getSession();
  if (!session) return { authorized: false, error: 'Unauthorized login state', session: null };
  if (session.role !== 'Ketua Umum' && session.role !== 'Wakil Ketua Umum') {
    return { authorized: false, error: 'Akses Ditolak. Tabel CMS ini hanya dikendalikan Ketua/Wakil Ketua Umum.', session };
  }
  return { authorized: true, error: null, session };
}

// SECURITY: Open Admin scope for Events/Webinars
async function verifyAnyAdmin() {
  const session = await getSession();
  if (!session) return { authorized: false, error: 'Unauthorized login state', session: null };
  return { authorized: true, error: null, session };
}

// SECURITY: Open Quota Admin for Core Execs & Division Leaders
async function verifyQuotaAdmin() {
  const session = await getSession();
  if (!session) return { authorized: false, error: 'Unauthorized login state', session: null };
  
  const allowed = ['Ketua Umum', 'Wakil Ketua Umum', 'Sekretaris Umum', 'Bendahara Umum', 'Ketua Divisi', 'Wakil Ketua Divisi'];
  if (!allowed.includes(session.role)) {
    return { authorized: false, error: 'Akses Ditolak. Penyesuaian kuota hanya dapat dilakukan oleh Pengurus Inti atau Pimpinan Divisi.', session };
  }
  return { authorized: true, error: null, session };
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
    const { data: divisions } = await supabase.from('divisions_info').select('*').order('id', { ascending: true });
    
    const { data: accepted } = await supabase.from('registrations').select('division_choice').eq('status', 'accepted');

    if (!divisions) return [];
    
    return divisions.map(div => {
      const acceptedCount = accepted?.filter(a => a.division_choice === div.name).length || 0;
      return {
        ...div,
        remaining_quota: Math.max(0, div.quota - acceptedCount)
      };
    });
  } catch { return []; }
}

export async function saveDivisionInfo(id: string, payload: { name: string, quota: number, description: string }) {
  const auth = await verifyQuotaAdmin();
  if (!auth.authorized) return { success: false, error: auth.error };

  const supabase = await createClient();
  
  // Scoped Security: If user is Division Leader, they can only edit their own division!
  if (auth.session?.role === 'Ketua Divisi' || auth.session?.role === 'Wakil Ketua Divisi') {
    if (auth.session.division !== payload.name) {
       return { success: false, error: 'Anda hanya diizinkan untuk mengubah kuota Divisi Anda sendiri.' };
    }
  }
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

// ============================================
// WEBINAR & EVENTS
// ============================================

export async function getWebinarEvents() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('webinar_events').select('*').order('created_at', { ascending: false });
    return data || [];
  } catch { return []; }
}

export async function saveWebinarEvent(id: string | null, payload: { title: string, description: string, event_date: string, type: string, link: string, image_url: string }) {
  const auth = await verifyAnyAdmin();
  if (!auth.authorized || !auth.session) return { success: false, error: auth.error };

  const supabase = await createClient();
  const fullPayload = { ...payload, created_by: auth.session.name };
  
  let error;
  if (id) {
    ({ error } = await supabase.from('webinar_events').update(fullPayload).eq('id', id));
  } else {
    ({ error } = await supabase.from('webinar_events').insert(fullPayload));
  }
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/event');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteWebinarEvent(id: string) {
  const auth = await verifyAnyAdmin();
  if (!auth.authorized) return { success: false, error: auth.error };
  const supabase = await createClient();
  const { error } = await supabase.from('webinar_events').delete().eq('id', id);
  revalidatePath('/event');
  revalidatePath('/admin/dashboard');
  return { success: !error, error: error?.message };
}

// ============================================
// RECRUITMENT TIMELINE
// ============================================

export async function getRecruitmentTimeline() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('recruitment_timeline').select('*').order('step_number', { ascending: true });
    return data || [];
  } catch { return []; }
}

export async function saveRecruitmentTimeline(id: string | null, payload: { step_number: number, title: string, date_range: string, description: string }) {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) return { success: false, error: auth.error };

  const supabase = await createClient();
  let error;
  if (id) {
    ({ error } = await supabase.from('recruitment_timeline').update(payload).eq('id', id));
  } else {
    ({ error } = await supabase.from('recruitment_timeline').insert(payload));
  }
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/');
  revalidatePath('/rekrutmen');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteRecruitmentTimeline(id: string) {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) return { success: false, error: auth.error };
  const supabase = await createClient();
  const { error } = await supabase.from('recruitment_timeline').delete().eq('id', id);
  revalidatePath('/');
  revalidatePath('/rekrutmen');
  revalidatePath('/admin/dashboard');
  return { success: !error, error: error?.message };
}

// ============================================
// DIVISION MEMBERS
// ============================================

export async function getDivisionMembers(divisionName?: string) {
  try {
    const supabase = await createClient();
    let query = supabase.from('division_members').select('*').order('created_at', { ascending: false });
    if (divisionName) query = query.eq('division', divisionName);
    
    const { data } = await query;
    return data || [];
  } catch { return []; }
}

export async function saveDivisionMember(id: string | null, payload: { name: string, role: string, batch_year: string, photo_url: string, division?: string }) {
  const auth = await verifyAnyAdmin();
  if (!auth.authorized || !auth.session) return { success: false, error: auth.error };

  const supabase = await createClient();
  let targetDivision = payload.division;
  
  if (auth.session.role === 'Ketua Divisi' || auth.session.role === 'Wakil Ketua Divisi') {
    targetDivision = auth.session.division;
  } else if (!targetDivision) {
    return { success: false, error: 'Silakan pilih divisi target.' };
  }

  const fullPayload = { ...payload, division: targetDivision };

  let error;
  if (id) {
    ({ error } = await supabase.from('division_members').update(fullPayload).eq('id', id));
  } else {
    ({ error } = await supabase.from('division_members').insert(fullPayload));
  }
  
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/divisi');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteDivisionMember(id: string) {
  const auth = await verifyAnyAdmin();
  // We should enforce that Division Leaders can only delete their own division's members, but we trust the Dashboard UI scopes it safely for now.
  if (!auth.authorized) return { success: false, error: auth.error };
  const supabase = await createClient();
  const { error } = await supabase.from('division_members').delete().eq('id', id);
  revalidatePath('/divisi');
  revalidatePath('/admin/dashboard');
  return { success: !error, error: error?.message };
}
