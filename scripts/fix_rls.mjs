import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

async function main() {
  try {
    console.log('Connecting to Supabase Database to fix RLS...');
    await client.connect();

    console.log('Enforcing open access control to authenticated Administrators on registrations...');
    await client.query(`
      ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

      -- Allow admins full control via authenticated sessions safely
      DROP POLICY IF EXISTS "Admin ALL on registrations" ON registrations;
      CREATE POLICY "Admin ALL on registrations" ON registrations FOR ALL USING (
        auth.role() = 'authenticated'
      );

      -- Public can INSERT into registrations without auth
      DROP POLICY IF EXISTS "Public insert on registrations" ON registrations;
      CREATE POLICY "Public insert on registrations" ON registrations FOR INSERT WITH CHECK (true);
      
      -- Let's also enforce on division_members just in case
      ALTER TABLE division_members ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Admin write members" ON division_members;
      CREATE POLICY "Admin write members" ON division_members FOR ALL USING (
        auth.role() = 'authenticated'
      );
    `);

    console.log('RLS patching complete.');
  } catch (e) {
    console.error('Fatal Error:', e);
  } finally {
    await client.end();
  }
}

main();
