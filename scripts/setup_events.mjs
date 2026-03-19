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

    // 1. Wipe all existing Demo CMS Data
    await client.query(`
      TRUNCATE TABLE achievements, gallery, testimonials RESTART IDENTITY CASCADE;
      UPDATE divisions_info SET quota = 0;
    `);
    console.log("Demo data eradicated and quotas reset to 0.");

    // 2. Create the Webinar/Event table
    await client.query(`
      CREATE TABLE IF NOT EXISTS webinar_events (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        event_date TEXT NOT NULL,
        type TEXT NOT NULL,
        link TEXT,
        image_url TEXT,
        created_by TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);
    console.log("Table 'webinar_events' created successfully.");

    // 3. Setup Basic RLS Layer
    await client.query(`
      ALTER TABLE webinar_events ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Public read access to webinar_events" ON webinar_events;
      CREATE POLICY "Public read access to webinar_events" ON webinar_events FOR SELECT USING (true);
      
      DROP POLICY IF EXISTS "Auth write access to webinar_events" ON webinar_events;
      CREATE POLICY "Auth write access to webinar_events" ON webinar_events FOR ALL USING (auth.role() = 'authenticated');
    `);
    
    console.log("Webinar constraints initialized successfully.");
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
main();
