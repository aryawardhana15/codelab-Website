/**
 * Script untuk membuat file .env
 * Jalankan dengan: node setup-env.js
 */

const fs = require('fs');
const path = require('path');

const envContent = `PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=hafiz1180
DB_NAME=codelab_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ File .env berhasil dibuat!');
  console.log('📝 Konfigurasi database:');
  console.log('   - Database: codelab_db');
  console.log('   - User: root');
  console.log('   - Password: hafiz1180');
  console.log('\n🚀 Sekarang Anda bisa menjalankan: npm run dev');
} catch (error) {
  console.error('❌ Error membuat file .env:', error.message);
  console.log('\n📝 Silakan buat file .env secara manual dengan konten:');
  console.log(envContent);
}

