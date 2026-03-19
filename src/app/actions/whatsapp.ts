'use server';
import { createClient } from '@/lib/supabase/server';

export async function sendWhatsApp(phone: string, message: string) {
  try {
    const supabase = await createClient();
    // Fetch WhatsApp API credentials from settings table
    const { data: settings } = await supabase.from('system_settings').select('wa_api_key, wa_api_url').eq('id', 1).single();
    
    const TOKEN = settings?.wa_api_key || 'zCvpmi9fjxwhyKxTqt22';
    const URL = settings?.wa_api_url || 'https://api.fonnte.com/send';

    if (!TOKEN) {
      console.log("[MOCK WA API] Missing keys. Would send:", { phone, message });
      return { success: false, reason: "No API Keys configured" };
    }

    const params = new URLSearchParams();
    params.append('target', phone);
    params.append('message', message);

    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Authorization": TOKEN
      },
      body: params
    });

    console.log("[WA API SUCCESS]", await res.text());
    return { success: true };
  } catch (error) {
    console.error("[WA API ERROR]", error);
    return { success: false, error };
  }
}

export async function notifyRegistration(phone: string, name: string, division: string) {
  const msg = `Halo ${name},\n\nTerima kasih telah mendaftar di LIWA TECH EXCELLENT COMMUNITY untuk divisi *${division}*.\nBerkas Anda sedang dalam antrean seleksi oleh Ketua Divisi kami. Kami akan menghubungi Anda jika Anda lolos ke tahap berikutnya!\n\nSalam,\nAdmin LTEC`;
  await sendWhatsApp(phone, msg);
}

export async function notifyInterview(phone: string, name: string, division: string, ketuaNama: string, ketuaPhone: string, wakilNama: string, wakilPhone: string | null) {
  let contactInfo = `- Ketua Divisi (${ketuaNama}): ${ketuaPhone}`;
  if (wakilNama && wakilPhone) {
    contactInfo += `\n- Wakil Ketua (${wakilNama}): ${wakilPhone}`;
  }

  const msg = `🎉 SELAMAT ${name.toUpperCase()}! 🎉\n\nBerkas pendaftaran Anda dinyatakan LOLOS seleksi awal untuk divisi *${division}*.\n\nAnda berhak melanjutkan ke Tahap Wawancara. Silakan segera hubungi Pimpinan Divisi Anda di bawah ini untuk mengatur jadwal wawancara:\n${contactInfo}\n\nJadilah hebat dan sukses selalu!`;
  await sendWhatsApp(phone, msg);
}

export async function notifyFinalAcceptance(phone: string, name: string, division: string) {
  const msg = `🎉 SELAMAT ${name.toUpperCase()}! 🎉\n\nAnda resmi lulus Wawancara dan SAH menjadi anggota tetap divisi *${division}* di LIWA TECH EXCELLENT COMMUNITY.\n\nSelamat bergabung di keluarga besar kami dan mari berkarya bersama!`;
  await sendWhatsApp(phone, msg);
}
