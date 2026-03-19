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
    console.log("Connected to PostgreSQL. Updating constraint...");
    
    await client.query(`
      ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_status_check;
    `);
    
    console.log("Old constraint dropped. Injecting new constraint allowing 'interview'...");
    
    await client.query(`
      ALTER TABLE registrations ADD CONSTRAINT registrations_status_check CHECK (status IN ('pending', 'interview', 'accepted', 'rejected'));
    `);

    console.log("Constraint successfully updated! 'interview' is now a valid status.");

  } catch (e) {
    console.error('Fatal Database Error:', e.message);
  } finally {
    await client.end();
  }
}

main();
