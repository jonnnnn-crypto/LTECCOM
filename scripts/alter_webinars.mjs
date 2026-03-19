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
    await client.query(`ALTER TABLE webinar_events ADD COLUMN IF NOT EXISTS registration_start TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE webinar_events ADD COLUMN IF NOT EXISTS registration_end TIMESTAMPTZ;`);
    console.log("Success! Added registration_start and registration_end to webinar_events!");
  } catch(e) {
    console.error("Pg query failed: ", e);
  } finally {
    await client.end();
  }
}
main();
