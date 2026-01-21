
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
});

async function addLockColumns() {
    try {
        await client.connect();
        console.log('Connected to database...');

        console.log('Adding is_locked and lock_password columns to materials table...');

        await client.query(`
      ALTER TABLE materials 
      ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS lock_password VARCHAR(255) DEFAULT NULL;
    `);

        console.log('Columns added successfully!');

    } catch (err) {
        console.error('Error adding columns:', err);
    } finally {
        await client.end();
    }
}

addLockColumns();
