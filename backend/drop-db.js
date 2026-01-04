const mysql = require('mysql2/promise');
require('dotenv').config();

async function drop() {
  const dbName = process.env.DB_NAME || 'codelab';
  console.log(`Dropping database ${dbName}...`);
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });
  await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);
  console.log('Database dropped.');
  await connection.end();
}
drop().catch(err => {
  console.error(err);
  process.exit(1);
});
