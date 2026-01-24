/**
 * Setup tables for PostgreSQL
 * Run with: node setup-tables-pg.js
 */

const { Client } = require('pg');
require('dotenv').config();

// Disable SSL for local/docker PostgreSQL
const isLocalDB = process.env.DB_HOST === 'db' || process.env.DB_HOST === 'localhost';

async function setupTables() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: isLocalDB ? false : { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('🔧 Setting up additional tables...');

  try {
    // Levels table
    await client.query(`
      CREATE TABLE IF NOT EXISTS levels (
        id SERIAL PRIMARY KEY,
        level_number INTEGER NOT NULL UNIQUE,
        level_name VARCHAR(100) NOT NULL,
        xp_required INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ levels table created');

    // User Gamification table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_gamification (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        total_xp INTEGER DEFAULT 0,
        current_level INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      )
    `);
    console.log('✅ user_gamification table created');

    // Badges table
    await client.query(`
      CREATE TABLE IF NOT EXISTS badges (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        icon_url VARCHAR(500),
        requirement VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ badges table created');

    // User Badges table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        badge_id INTEGER NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, badge_id)
      )
    `);
    console.log('✅ user_badges table created');

    // Missions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS missions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        type VARCHAR(50) DEFAULT 'daily',
        requirement_type VARCHAR(100),
        requirement_count INTEGER DEFAULT 1,
        xp_reward INTEGER DEFAULT 10,
        badge_reward INTEGER REFERENCES badges(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ missions table created');

    // User Missions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_missions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        mission_id INTEGER NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
        progress INTEGER DEFAULT 0,
        is_completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        reset_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, mission_id)
      )
    `);
    console.log('✅ user_missions table created');

    // XP History table
    await client.query(`
      CREATE TABLE IF NOT EXISTS xp_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        xp_amount INTEGER NOT NULL,
        reason VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ xp_history table created');

    // Notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50),
        title VARCHAR(200),
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ notifications table created');

    // Admin Logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER NOT NULL REFERENCES users(id),
        action VARCHAR(100),
        target_type VARCHAR(50),
        target_id INTEGER,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ admin_logs table created');

    // Forum Reports table (if not exists)
    await client.query(`
      CREATE TABLE IF NOT EXISTS forum_reports (
        id SERIAL PRIMARY KEY,
        reporter_id INTEGER NOT NULL REFERENCES users(id),
        forum_id INTEGER REFERENCES forums(id) ON DELETE CASCADE,
        reply_id INTEGER REFERENCES forum_replies(id) ON DELETE CASCADE,
        reason TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        resolved_at TIMESTAMP,
        resolved_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ forum_reports table created');

    // Insert default levels
    await client.query(`
      INSERT INTO levels (level_number, level_name, xp_required) VALUES
      (1, 'Pemula', 0),
      (2, 'Pelajar', 100),
      (3, 'Penjelajah', 250),
      (4, 'Pencari Ilmu', 500),
      (5, 'Ahli', 1000),
      (6, 'Master', 2000),
      (7, 'Legenda', 5000)
      ON CONFLICT (level_number) DO NOTHING
    `);
    console.log('✅ Default levels inserted');

    // Insert default badges
    await client.query(`
      INSERT INTO badges (id, name, description, requirement) VALUES
      (1, 'First Steps', 'Selesaikan materi pertama', 'Complete 1 material'),
      (2, 'Quiz Master', 'Nilai sempurna di kuis', 'Score 100 on quiz'),
      (3, 'Discussion Hero', 'Buat 10 post forum', 'Create 10 forum posts'),
      (4, 'Course Completer', 'Selesaikan 1 kursus', 'Complete 1 course'),
      (5, 'Speed Learner', 'Selesaikan 5 materi dalam sehari', 'Complete 5 materials in a day'),
      (6, 'Week Warrior', 'Login 7 hari berturut-turut', 'Login 7 days in a row'),
      (7, 'Social Butterfly', 'Dapat 50 likes di forum', 'Receive 50 forum likes'),
      (8, 'Helping Hand', 'Reply 20 kali di forum', 'Reply 20 times in forums'),
      (9, 'Top Scorer', 'Rata-rata nilai 90+ di 5 tugas', 'Average 90+ score on 5 assignments'),
      (10, 'Dedicated Learner', 'Daftar di 5 kursus', 'Enroll in 5 courses')
      ON CONFLICT (id) DO NOTHING
    `);
    console.log('✅ Default badges inserted');

    // Insert default missions
    await client.query(`
      INSERT INTO missions (title, description, type, requirement_type, requirement_count, xp_reward) VALUES
      ('Login Harian', 'Login ke aplikasi', 'daily', 'login', 1, 10),
      ('Belajar Rajin', 'Selesaikan 3 materi hari ini', 'daily', 'complete_material', 3, 30),
      ('Aktif Berdiskusi', 'Buat 1 post forum hari ini', 'daily', 'forum_post', 1, 15),
      ('Pejuang Kuis', 'Selesaikan 2 kuis minggu ini', 'weekly', 'complete_quiz', 2, 50),
      ('Penuntut Ilmu', 'Selesaikan 10 materi minggu ini', 'weekly', 'complete_material', 10, 100)
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Default missions inserted');

    console.log('');
    console.log('🎉 All tables setup successfully!');

  } catch (error) {
    console.error('❌ Error setting up tables:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

setupTables().catch(console.error);
