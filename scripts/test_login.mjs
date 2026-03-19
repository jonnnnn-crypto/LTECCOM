import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  console.log("Attempting Login...");
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'ketuaumum@ltec.id',
    password: 'KetuaLtec!2026_Admin'
  });

  if (authErr) {
    console.error("Auth Error:", authErr);
    return;
  }
  
  console.log("Login Success! User ID:", authData.user.id);
  
  console.log("Fetching Profile...");
  const { data: profileData, error: profileErr } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();
  
  if (profileErr) {
    console.error("Profile Error:", profileErr);
  } else {
    console.log("Profile Found:", profileData.full_name);
    
    // Test UPDATE
    console.log("Testing UPDATE profiles...");
    const { error: updErr } = await supabase.from('profiles').update({ phone_number: '08123456789' }).eq('id', authData.user.id);
    if (updErr) {
      console.error("Update Error:", updErr);
    } else {
      console.log("Update SUCCESS! So RLS is not blocking profiles.");
    }
    
    // Test UPDATE gallery
    console.log("Testing INSERT gallery...");
    const { error: galErr } = await supabase.from('gallery').insert({ title: 'Test', category: 'Test', image_url: 'test' });
    if (galErr) {
      console.error("Gallery Insert Error:", galErr);
    } else {
      console.log("Gallery Insert SUCCESS!");
    }
  }
}

test();
