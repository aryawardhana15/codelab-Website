/**
 * Unseed/Clear script for Codelab database
 * Run with: node unseed-data.js
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function unseedDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'codelab'
  });

  console.log('🗑️  Clearing database data...');

  try {
    // Disable foreign key checks temporarily
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    // Clear all data tables (order matters due to foreign keys)
    const tables = [
      'notifications',
      'user_missions',
      'user_badges',
      'xp_history',
      'user_gamification',
      'quiz_answers',
      'submissions',
      'quiz_questions',
      'assignments',
      'material_progress',
      'materials',
      'forum_reports',
      'forum_likes',
      'forum_replies',
      'forums',
      'messages',
      'chats',
      'enrollments',
      'courses'
    ];

    for (const table of tables) {
      await connection.execute(`DELETE FROM ${table}`);
      console.log(`  ✓ Cleared: ${table}`);
    }

    // Clear users except admin
    await connection.execute(`DELETE FROM users WHERE role != 'admin'`);
    console.log('  ✓ Cleared: users (except admin)');

    // Reset admin password
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    await connection.execute(
      `UPDATE users SET password = ? WHERE email = 'admin@codelab.com'`,
      [adminPasswordHash]
    );
    console.log('  ✓ Reset admin password');

    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('');
    console.log('✨ Database cleared successfully!');
    console.log('');
    console.log('📋 Remaining Account:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('| Role    | Email               | Password    |');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('| Admin   | admin@codelab.com   | admin123    |');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('Untuk seed lagi: node seed-data.js');

  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

unseedDatabase().catch(console.error);
