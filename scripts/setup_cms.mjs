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

    // Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        date TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS gallery (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS divisions_info (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        quota INTEGER DEFAULT 0,
        requirements TEXT
      );

      CREATE TABLE IF NOT EXISTS testimonials (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT,
        content TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);

    // Setup basic RLS (Application Layer will handle strict Role auth)
    await client.query(`
      ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
      ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
      ALTER TABLE divisions_info ENABLE ROW LEVEL SECURITY;
      ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Public reads achievements" ON achievements;
      CREATE POLICY "Public reads achievements" ON achievements FOR SELECT USING (true);
      DROP POLICY IF EXISTS "Auth writes achievements" ON achievements;
      CREATE POLICY "Auth writes achievements" ON achievements FOR ALL USING (auth.role() = 'authenticated');

      DROP POLICY IF EXISTS "Public reads gallery" ON gallery;
      CREATE POLICY "Public reads gallery" ON gallery FOR SELECT USING (true);
      DROP POLICY IF EXISTS "Auth writes gallery" ON gallery;
      CREATE POLICY "Auth writes gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');

      DROP POLICY IF EXISTS "Public reads divisions_info" ON divisions_info;
      CREATE POLICY "Public reads divisions_info" ON divisions_info FOR SELECT USING (true);
      DROP POLICY IF EXISTS "Auth writes divisions_info" ON divisions_info;
      CREATE POLICY "Auth writes divisions_info" ON divisions_info FOR ALL USING (auth.role() = 'authenticated');

      DROP POLICY IF EXISTS "Public reads testimonials" ON testimonials;
      CREATE POLICY "Public reads testimonials" ON testimonials FOR SELECT USING (true);
      DROP POLICY IF EXISTS "Auth writes testimonials" ON testimonials;
      CREATE POLICY "Auth writes testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
    `);

    // Seed Divisions
    await client.query(`
      INSERT INTO divisions_info (id, name, quota, description) VALUES
      ('phoenix', 'Phoenix (Cyber Security)', 15, 'Fokus pada keamanan siber, penetration testing, dan pertahanan infrastruktur jaringan digital.'),
      ('sysadmin', 'SysAdmin (ITNSA)', 20, 'Manajemen server, konfigurasi sistem operasi tingkat lanjut, dan operasional layanan data center.'),
      ('software', 'Coding & Software Dev', 25, 'Pengembangan aplikasi modern, web development, dan rekayasa perangkat lunak algoritmik.'),
      ('network', 'Information (Network Cabling)', 30, 'Desain arsitektur jaringan fisik, instalasi infrastruktur fiber optik, dan standarisasi kabel.'),
      ('cloud', 'Cloud Computing', 15, 'Arsitektur komputasi awan, virtualisasi, dan penyebaran aplikasi terukur berskala global.')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Seed Testimonials
    await client.query(`
      INSERT INTO testimonials (name, role, content, image_url) VALUES 
      ('Reza Aditiya', 'Alumni 2023 - Cloud Engineer', 'LTEC adalah kawah candradimuka sesungguhnya. Disini saya tidak hanya belajar coding, tapi cara berpikir terstruktur untuk memecahkan masalah berskala besar.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop'),
      ('Siti Nurhaliza', 'Anggota Aktif - SysAdmin', 'Fasilitas server riil dan mentor yang berdedikasi membuat pemahaman saya tentang jaringan meningkat pesat hanya dalam 6 bulan pertama.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop')
      ON CONFLICT DO NOTHING;
    `);
    
    // Seed Achievements
    await client.query(`
      INSERT INTO achievements (title, date, description, image_url) VALUES
      ('Juara 1 LKS Web Technologies Nasional', 'Okt 2023', 'Mewakili provinsi Lampung dan meraih medali emas pada kompetisi kemahiran siswa bergengsi tingkat nasional di ajang Web Technologies.', 'https://images.unsplash.com/photo-1561489404-4712ce17b81b?q=80&w=800&auto=format&fit=crop'),
      ('Medali Perak Cyber Security', 'Agt 2023', 'Menempati posisi kedua pada kompetisi penetrasi jaringan antar instansi se-Sumatera.', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop')
      ON CONFLICT DO NOTHING;
    `);

    // Seed Gallery
    await client.query(`
      INSERT INTO gallery (title, category, image_url) VALUES 
      ('Workshop Keamanan Jaringan', 'Workshop', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop'),
      ('Persiapan LKS 2024', 'Kompetisi', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop'),
      ('Instalasi Server Baru LTEC', 'Infrastruktur', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop'),
      ('Kunjungan Industri Telkom', 'Kunjungan', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop')
      ON CONFLICT DO NOTHING;
    `);

    console.log("CMS Tables, RLS, and Demos initialized successfully!");
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
main();
