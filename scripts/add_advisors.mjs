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
  { email: 'pelindung@ltec.id', role: 'Pelindung', division: 'Dewan Kehormatan', pass: 'AdvisorLtec!2026_Board', name: 'Tri Yunita, S.Ag.M.Pd.I' },
  { email: 'penanggungjawab@ltec.id', role: 'Penanggung Jawab', division: 'Dewan Kehormatan', pass: 'AdvisorLtec!2026_Board', name: 'Latip Ihpa S.Kom' },
  { email: 'pembina@ltec.id', role: 'Pembina', division: 'Dewan Kehormatan', pass: 'AdvisorLtec!2026_Board', name: 'Ahmad Subhan S.Kom' }
];

async function main() {
  try {
    await client.connect();

    // Fix constraints
    await client.query('ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check');
    await client.query(`
      ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
      CHECK (role IN ('Ketua Umum', 'Wakil Ketua Umum', 'Sekretaris Umum', 'Bendahara Umum', 'Ketua Divisi', 'Wakil Ketua Divisi', 'Member', 'Pelindung', 'Penanggung Jawab', 'Pembina'));
    `);

    for (const acc of ACCOUNTS) {
      const email = acc.email;
      const pass = acc.pass;
      
      let uid;
      const userCheck = await client.query('SELECT id FROM auth.users WHERE email = $1', [email]);

      if (userCheck.rows.length > 0) {
        uid = userCheck.rows[0].id;
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
        
        await client.query(`
          INSERT INTO auth.identities (
             id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
          ) VALUES (
             gen_random_uuid(), $2::text, $1::uuid, jsonb_build_object('sub', $1::text, 'email', $2::text, 'email_verified', false), 'email', now(), now(), now()
          ) ON CONFLICT DO NOTHING;
        `, [uid, email]);
      }
      
      await client.query(`
        INSERT INTO public.profiles (id, email, full_name, role, division)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE 
        SET role = $4, division = $5, full_name = COALESCE(public.profiles.full_name, $3)
      `, [uid, email, acc.name, acc.role, acc.division]);
      
      console.log(`[SYNCED] ${email} -> Advisor Inserted`);
    }
  } catch(e) {
    console.error("DB Script Error:", e);
  } finally {
    await client.end();
  }
}

main();
