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
    await client.connect();
    console.log("Connected to PostgreSQL. Updating constraints...");
    
    await client.query(`
      ALTER TABLE webinar_events ALTER COLUMN event_date DROP NOT NULL;
    `);
    console.log("Constraint 'event_date' successfully updated! Allowed to be NULL.");

    try {
      await client.query(`ALTER TABLE webinar_events ALTER COLUMN registration_start DROP NOT NULL;`);
      console.log("Constraint 'registration_start' successfully updated!");
    } catch { console.log("Column 'registration_start' might not exist or is already nullable."); }

    try {
      await client.query(`ALTER TABLE webinar_events ALTER COLUMN registration_end DROP NOT NULL;`);
      console.log("Constraint 'registration_end' successfully updated!");
    } catch { console.log("Column 'registration_end' might not exist or is already nullable."); }

  } catch (e) {
    console.error('Fatal Database Error:', e.message);
  } finally {
    await client.end();
  }
}

main();
