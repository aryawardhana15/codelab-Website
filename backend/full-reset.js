const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function fullReset() {
  const dbName = process.env.DB_NAME || 'codelab';
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log(`💥 Dropping database '${dbName}'...`);
    await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);
    
    console.log(`🔨 Creating database '${dbName}'...`);
    await connection.query(`CREATE DATABASE ${dbName}`);
    await connection.query(`USE ${dbName}`);

    console.log('📜 Importing schema...');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    if (!fs.existsSync(schemaPath)) {
        throw new Error('Schema file not found at ' + schemaPath);
    }
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSql);

    console.log('✅ Schema imported successfully.');
  } catch (err) {
    console.error('❌ Error during reset:', err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

fullReset();
