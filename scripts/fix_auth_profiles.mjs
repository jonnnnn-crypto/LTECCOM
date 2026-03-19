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
  { email: 'ketuaumum@ltec.id', role: 'Ketua Umum', division: 'Pusat' },
  { email: 'wakilketua@ltec.id', role: 'Wakil Ketua Umum', division: 'Pusat' },
  { email: 'sekretaris@ltec.id', role: 'Sekretaris Umum', division: 'Pusat' },
  { email: 'bendahara@ltec.id', role: 'Bendahara Umum', division: 'Pusat' },
  { email: 'cyber@ltec.id', role: 'Ketua Divisi', division: 'Phoenix (Cyber Security)' },
  { email: 'cyberwakil@ltec.id', role: 'Wakil Ketua Divisi', division: 'Phoenix (Cyber Security)' },
  { email: 'sysadmin@ltec.id', role: 'Ketua Divisi', division: 'SysAdmin (ITNSA)' },
  { email: 'sysadminwakil@ltec.id', role: 'Wakil Ketua Divisi', division: 'SysAdmin (ITNSA)' },
  { email: 'software@ltec.id', role: 'Ketua Divisi', division: 'Coding & Software Dev' },
  { email: 'softwarewakil@ltec.id', role: 'Wakil Ketua Divisi', division: 'Coding & Software Dev' },
  { email: 'network@ltec.id', role: 'Ketua Divisi', division: 'Information (Network Cabling)' },
  { email: 'networkwakil@ltec.id', role: 'Wakil Ketua Divisi', division: 'Information (Network Cabling)' },
  { email: 'cloud@ltec.id', role: 'Ketua Divisi', division: 'Cloud Computing' },
  { email: 'cloudwakil@ltec.id', role: 'Wakil Ketua Divisi', division: 'Cloud Computing' }
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
      
      let uid;
      const userCheck = await client.query('SELECT id FROM auth.users WHERE email = $1', [email]);

      if (userCheck.rows.length > 0) {
        uid = userCheck.rows[0].id;
        await client.query(`
          UPDATE auth.users 
          SET encrypted_password = crypt('LTEC2026!Secured', gen_salt('bf'))
          WHERE id = $1
        `, [uid]);
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
            crypt('LTEC2026!Secured', gen_salt('bf')), now(),
            '{"provider":"email","providers":["email"]}', '{}',
            now(), now(), '', '', '', ''
          )
          RETURNING id;
        `, [email]);
        uid = idRes.rows[0].id;
      }
      
      // Upsert into public.profiles to ensure it never returns null for getSession
      await client.query(`
        INSERT INTO public.profiles (id, email, full_name, role, division)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE 
        SET role = $4, division = $5, email = $2
      `, [uid, email, acc.role + ' ' + acc.division, acc.role, acc.division]);
      
      console.log(`[SYNCED] ${email} -> Password: LTEC2026!Secured`);
    }

    // Attempt to drop any generic triggers forcing generic profiles just to be safe
    // But since we just upserted above, it's fine.
    
    console.log("Database authentication bridges synchronized perfectly.");
  } catch(e) {
    console.error("DB Script Error:", e);
  } finally {
    await client.end();
  }
}

main();
