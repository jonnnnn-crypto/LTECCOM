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
    await client.query("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;");
    await client.query("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_url TEXT;");
    console.log("Database schema successfully patched!");
  } catch (err) {
    console.error("Patch error:", err);
  } finally {
    await client.end();
  }
}
main();
