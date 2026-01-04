const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

async function fixAdminPassword() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME
  });

  // Generate proper bcrypt hash for 'admin123'
  const hash = await bcrypt.hash('admin123', 10);
  
  await conn.execute(
    "UPDATE users SET password = ? WHERE email = 'admin@codelab.com'",
    [hash]
  );
  
  console.log('✅ Admin password updated successfully!');
  console.log('📧 Email: admin@codelab.com');
  console.log('🔑 Password: admin123');
  
  await conn.end();
}

fixAdminPassword().catch(console.error);
