import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
dotenv.config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

const ACCOUNTS = [
  { email: 'ketuaumum@ltec.id', role: 'Ketua Umum', division: 'Pusat', pass: 'KetuaLtec!2026_Admin' },
  { email: 'wakilketua@ltec.id', role: 'Wakil Ketua Umum', division: 'Pusat', pass: 'WakilLtec!2026_Admin' },
  { email: 'sekretaris@ltec.id', role: 'Sekretaris Umum', division: 'Pusat', pass: 'SekretarisLtec!2026_Core' },
  { email: 'bendahara@ltec.id', role: 'Bendahara Umum', division: 'Pusat', pass: 'BendaharaLtec!2026_Core' },
  { email: 'cyber@ltec.id', role: 'Ketua Divisi', division: 'Phoenix (Cyber Security)', pass: 'CyberLeader!2026_PHX' },
  { email: 'cyberwakil@ltec.id', role: 'Wakil Ketua Divisi', division: 'Phoenix (Cyber Security)', pass: 'CyberWakil!2026_PHX' },
  { email: 'sysadmin@ltec.id', role: 'Ketua Divisi', division: 'SysAdmin (ITNSA)', pass: 'SysAdminLeader!2026_IT' },
  { email: 'sysadminwakil@ltec.id', role: 'Wakil Ketua Divisi', division: 'SysAdmin (ITNSA)', pass: 'SysAdminWakil!2026_IT' },
  { email: 'software@ltec.id', role: 'Ketua Divisi', division: 'Coding & Software Dev', pass: 'SoftwareLeader!2026_Dev' },
  { email: 'softwarewakil@ltec.id', role: 'Wakil Ketua Divisi', division: 'Coding & Software Dev', pass: 'SoftwareWakil!2026_Dev' },
  { email: 'network@ltec.id', role: 'Ketua Divisi', division: 'Information (Network Cabling)', pass: 'NetworkLeader!2026_Cab' },
  { email: 'networkwakil@ltec.id', role: 'Wakil Ketua Divisi', division: 'Information (Network Cabling)', pass: 'NetworkWakil!2026_Cab' },
  { email: 'cloud@ltec.id', role: 'Ketua Divisi', division: 'Cloud Computing', pass: 'CloudLeader!2026_AWS' },
  { email: 'cloudwakil@ltec.id', role: 'Wakil Ketua Divisi', division: 'Cloud Computing', pass: 'CloudWakil!2026_AWS' }
];

async function main() {
  try {
    await client.connect();
    await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    // Ensure profiles table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
        email TEXT,
        full_name TEXT,
        role TEXT,
        division TEXT,
        phone_number TEXT,
        photo_url TEXT
      );
    `);

    for (const acc of ACCOUNTS) {
      const email = acc.email;
      const pass = acc.pass;
      
      let uid;
      const userCheck = await client.query('SELECT id FROM auth.users WHERE email = $1', [email]);

      if (userCheck.rows.length > 0) {
        uid = userCheck.rows[0].id;
        // UPDATE Existing Identity explicitly
        await client.query(`
          UPDATE auth.users 
          SET encrypted_password = crypt($2, gen_salt('bf')),
              updated_at = now()
          WHERE id = $1;
        `, [uid, pass]);
        
        // Ensure identities provider is correctly mapped just in case the prior users were misconfigured
        await client.query(`
          UPDATE auth.identities
          SET identity_data = jsonb_build_object('sub', $1::text, 'email', $2::text, 'email_verified', false)
          WHERE user_id = $1::uuid AND provider = 'email';
        `, [uid, email]);

      } else {
        const idRes = await client.query(`
          INSERT INTO auth.users (
            id, instance_id, aud, role, email,
            encrypted_password, email_confirmed_at, 
            raw_app_meta_data, raw_user_meta_data,
            created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
          )
          VALUES (
            gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', $1,
            crypt($2, gen_salt('bf')), now(),
            '{"provider":"email","providers":["email"]}', '{}',
            now(), now(), '', '', '', ''
          )
          RETURNING id;
        `, [email, pass]);
        uid = idRes.rows[0].id;
        
        // Create Identity for new users so Auth doesn't reject them
        await client.query(`
          INSERT INTO auth.identities (
             id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
          ) VALUES (
             gen_random_uuid(), $2::text, $1::uuid, jsonb_build_object('sub', $1::text, 'email', $2::text, 'email_verified', false), 'email', now(), now(), now()
          ) ON CONFLICT DO NOTHING;
        `, [uid, email]);
      }
      
      // Upsert into public.profiles
      await client.query(`
        INSERT INTO public.profiles (id, email, full_name, role, division)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE 
        SET role = $4, division = $5, email = $2
      `, [uid, email, acc.role + ' ' + acc.division, acc.role, acc.division]);
      
      console.log(`[SYNCED] ${email} -> Password Updated Distinctly`);
    }

    console.log("\\nDatabase authentication bridges synchronized perfectly.");
  } catch(e) {
    console.error("DB Script Error:", e);
  } finally {
    await client.end();
  }
}

main();
