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
    await client.query(`ALTER TABLE divisions_info ADD COLUMN IF NOT EXISTS whatsapp_group_link TEXT;`);
    console.log("whatsapp_group_link Column added successfully!");
  } catch(e) {
    console.error("Pg query failed: ", e);
  } finally {
    await client.end();
  }
}
main();
