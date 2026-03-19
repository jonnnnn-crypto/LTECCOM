import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
dotenv.config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    await client.connect();
    // Re-ensure RLS
    await client.query(`
        DROP POLICY IF EXISTS "Public read access to profiles" ON profiles;
        DROP POLICY IF EXISTS "Ketum Waketum can update profiles" ON profiles;
        DROP POLICY IF EXISTS "User can update own profile" ON profiles;

        CREATE POLICY "Public read access to profiles" ON profiles FOR SELECT USING (true);
        
        CREATE POLICY "Ketum Waketum can update profiles" ON profiles FOR UPDATE USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Ketua Umum', 'Wakil Ketua Umum'))
        );
        
        CREATE POLICY "User can update own profile" ON profiles FOR UPDATE USING (
            id = auth.uid()
        );
    `);
    console.log("RLS Policies for profiles have been established!");
  } catch (err) {
    console.error("Patch error:", err);
  } finally {
    await client.end();
  }
}
main();
