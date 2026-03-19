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
    console.log('Connecting to Supabase Database...');
    await client.connect();

    console.log('Creating recruitment_timeline table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS recruitment_timeline (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        step_number INTEGER NOT NULL,
        title TEXT NOT NULL,
        date_range TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      );
      
      -- Seed defaults if empty
      INSERT INTO recruitment_timeline (step_number, title, date_range, description)
      SELECT 1, 'Pendaftaran Online', '10 - 20 Juli 2026', 'Isi formulir pendaftaran melalui tautan resmi kami.'
      WHERE NOT EXISTS (SELECT 1 FROM recruitment_timeline WHERE step_number = 1);

      INSERT INTO recruitment_timeline (step_number, title, date_range, description)
      SELECT 2, 'Seleksi Berkas & Wawancara', '22 - 25 Juli 2026', 'Tim instruktur akan meninjau motivasi dan minat.'
      WHERE NOT EXISTS (SELECT 1 FROM recruitment_timeline WHERE step_number = 2);

      INSERT INTO recruitment_timeline (step_number, title, date_range, description)
      SELECT 3, 'Bootcamp Calon Anggota', '1 - 5 Agustus 2026', 'Pengenalan dasar-dasar teknologi, logika pemrograman.'
      WHERE NOT EXISTS (SELECT 1 FROM recruitment_timeline WHERE step_number = 3);

      INSERT INTO recruitment_timeline (step_number, title, date_range, description)
      SELECT 4, 'Pengumuman Resmi', '10 Agustus 2026', 'Selamat bergabung di keluarga besar Liwa Tech.'
      WHERE NOT EXISTS (SELECT 1 FROM recruitment_timeline WHERE step_number = 4);
    `);

    console.log('Creating division_members table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS division_members (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        division TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Anggota',
        batch_year TEXT NOT NULL,
        photo_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      );
    `);

    console.log('Applying RLS Rules...');
    await client.query(`
      ALTER TABLE recruitment_timeline ENABLE ROW LEVEL SECURITY;
      ALTER TABLE division_members ENABLE ROW LEVEL SECURITY;

      -- public read
      DROP POLICY IF EXISTS "Public read timeline" ON recruitment_timeline;
      CREATE POLICY "Public read timeline" ON recruitment_timeline FOR SELECT USING (true);
      
      DROP POLICY IF EXISTS "Public read members" ON division_members;
      CREATE POLICY "Public read members" ON division_members FOR SELECT USING (true);

      -- Admin write timeline (any auth user can theoretically write on DB level, but ServerAction enforces constraint)
      DROP POLICY IF EXISTS "Admin write timeline" ON recruitment_timeline;
      CREATE POLICY "Admin write timeline" ON recruitment_timeline FOR ALL USING (
        auth.role() = 'authenticated'
      );

      DROP POLICY IF EXISTS "Admin write members" ON division_members;
      CREATE POLICY "Admin write members" ON division_members FOR ALL USING (
        auth.role() = 'authenticated'
      );
    `);

    console.log('Phase 11 Tables setup complete.');
  } catch (e) {
    console.error('Fatal Error:', e);
  } finally {
    await client.end();
  }
}

main();
