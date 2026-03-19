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
    console.log("Connected to PG. Attempting to bulk delete registrations...");
    
    // First let's check how many there are
    const { rows: countRows } = await client.query('SELECT COUNT(*) FROM registrations');
    console.log(`Current registrations count: ${countRows[0].count}`);

    // Let's attempt to delete
    if (parseInt(countRows[0].count) > 0) {
      const { rowCount } = await client.query('DELETE FROM registrations');
      console.log(`Deleted ${rowCount} rows successfully from PG layer.`);
    } else {
      console.log('No rows to delete. This means the DB is already empty!');
    }

  } catch (e) {
    console.error('Fatal Database Error:', e.message);
  } finally {
    await client.end();
  }
}

main();
