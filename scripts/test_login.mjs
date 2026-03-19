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
    console.log("Profile Found:", profileData);
  }
}

test();
