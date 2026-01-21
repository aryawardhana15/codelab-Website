const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetDb() {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    };

    console.log('Connecting...');
    const conn = await mysql.createConnection(config);
    console.log('Dropping database codelab...');
    await conn.query('DROP DATABASE IF EXISTS codelab');
    console.log('Done.');
    await conn.end();
}

resetDb().catch(console.error);
