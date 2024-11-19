import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeTables() {
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'schema/schema.sql'), 'utf-8');
    await client.query(sql);
    console.log('Db tables initialized from schema.sql');
  } catch (err) {
    console.error('Error initializing db tables:', err);
  } finally {
    client.release();
  }
}