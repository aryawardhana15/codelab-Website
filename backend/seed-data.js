/**
 * Seed script for Codelab database
 * Run with: node seed-data.js
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'codelab'
  });

  console.log('🌱 Starting database seed...');

  try {
    // Generate bcrypt password hash
    const passwordHash = await bcrypt.hash('password123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    // =====================
    // USERS
    // =====================
    console.log('👤 Seeding users...');
    
    // Update admin password
    await connection.execute(
      `UPDATE users SET password = ? WHERE email = 'admin@codelab.com'`,
      [adminPasswordHash]
    );

    // Insert mentor users
    const mentors = [
      ['Budi Santoso', 'budi@mentor.com', passwordHash, 'mentor', 'Mentor berpengalaman di bidang Programming', null, null, 'Programming, Web Development, Python', '5 tahun mengajar programming', true],
      ['Siti Nurhaliza', 'siti@mentor.com', passwordHash, 'mentor', 'Ahli Matematika dan Fisika', null, null, 'Matematika, Fisika, Kalkulus', '8 tahun mengajar di SMA', true],
      ['Ahmad Dahlan', 'ahmad@mentor.com', passwordHash, 'mentor', 'Guru Bahasa Inggris profesional', null, null, 'Bahasa Inggris, TOEFL, IELTS', '10 tahun pengalaman', true]
    ];

    for (const mentor of mentors) {
      await connection.execute(
        `INSERT IGNORE INTO users (name, email, password, role, bio, photo_url, cv_url, expertise, experience, is_verified) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        mentor
      );
    }

    // Insert pelajar users
    const pelajars = [
      ['Andi Pratama', 'andi@pelajar.com', passwordHash, 'pelajar', 'Siswa SMA kelas 12', true],
      ['Dewi Lestari', 'dewi@pelajar.com', passwordHash, 'pelajar', 'Mahasiswi semester 3', true],
      ['Fajar Ramadhan', 'fajar@pelajar.com', passwordHash, 'pelajar', 'Siswa SMK jurusan RPL', true],
      ['Syauqi', 'syauqi@pelajar.com', passwordHash, 'pelajar', 'Developer enthusiast', true]
    ];

    for (const pelajar of pelajars) {
      await connection.execute(
        `INSERT IGNORE INTO users (name, email, password, role, bio, is_verified) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        pelajar
      );
    }

    // Get user IDs
    const [userRows] = await connection.execute('SELECT id, email, role FROM users');
    const users = {};
    userRows.forEach(u => users[u.email] = { id: u.id, role: u.role });

    // =====================
    // COURSES
    // =====================
    console.log('📚 Seeding courses...');
    
    const courses = [
      [users['budi@mentor.com']?.id, 'Dasar-dasar Programming Python', 'Pelajari pemrograman Python dari nol hingga mahir. Cocok untuk pemula yang ingin memulai karir di dunia programming.', 'Programming', 'beginner', null, true],
      [users['budi@mentor.com']?.id, 'Web Development dengan JavaScript', 'Kuasai JavaScript untuk membangun website interaktif dan modern. Pelajari DOM, Event, dan ES6+.', 'Programming', 'intermediate', null, true],
      [users['siti@mentor.com']?.id, 'Matematika SMA: Trigonometri', 'Materi trigonometri lengkap untuk siswa SMA. Meliputi fungsi trigonometri, identitas, dan penerapannya.', 'Matematika', 'intermediate', null, true],
      [users['siti@mentor.com']?.id, 'Fisika Dasar: Mekanika', 'Pelajari konsep dasar mekanika fisika meliputi gerak, gaya, dan energi.', 'Fisika', 'beginner', null, true],
      [users['ahmad@mentor.com']?.id, 'English for Beginners', 'Kursus Bahasa Inggris untuk pemula. Fokus pada grammar dasar dan vocabulary sehari-hari.', 'Bahasa Inggris', 'beginner', null, true],
      [users['ahmad@mentor.com']?.id, 'TOEFL Preparation', 'Persiapan tes TOEFL dengan latihan intensif di semua section: Reading, Listening, Speaking, Writing.', 'Bahasa Inggris', 'advanced', null, true]
    ];

    for (const course of courses) {
      if (course[0]) {
        await connection.execute(
          `INSERT IGNORE INTO courses (mentor_id, title, description, category, difficulty, thumbnail_url, is_published) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          course
        );
      }
    }

    // Get course IDs
    const [courseRows] = await connection.execute('SELECT id, title, mentor_id FROM courses');

    // =====================
    // MATERIALS
    // =====================
    console.log('📖 Seeding materials...');
    
    for (const course of courseRows) {
      const materialCount = 5;
      for (let i = 1; i <= materialCount; i++) {
        await connection.execute(
          `INSERT IGNORE INTO materials (course_id, title, description, content, order_index) 
           VALUES (?, ?, ?, ?, ?)`,
          [
            course.id,
            `Materi ${i}: Bagian ${i}`,
            `Deskripsi untuk materi ${i} dari kursus ${course.title}`,
            `<h2>Materi ${i}</h2><p>Ini adalah konten pembelajaran untuk materi ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><h3>Poin Penting</h3><ul><li>Poin pertama yang perlu dipahami</li><li>Poin kedua yang penting</li><li>Poin ketiga untuk diingat</li></ul>`,
            i
          ]
        );
      }
    }

    // =====================
    // ENROLLMENTS
    // =====================
    console.log('📝 Seeding enrollments...');
    
    // Enroll pelajar to courses
    const pelajarIds = Object.values(users).filter(u => u.role === 'pelajar').map(u => u.id);
    
    for (const pelajarId of pelajarIds) {
      // Enroll in first 3 courses
      for (let i = 0; i < Math.min(3, courseRows.length); i++) {
        await connection.execute(
          `INSERT IGNORE INTO enrollments (user_id, course_id) VALUES (?, ?)`,
          [pelajarId, courseRows[i].id]
        );
      }
    }

    // =====================
    // MATERIAL PROGRESS
    // =====================
    console.log('✅ Seeding material progress...');
    
    const [materialRows] = await connection.execute('SELECT id, course_id FROM materials ORDER BY course_id, order_index');
    
    // Complete some materials for first pelajar
    if (pelajarIds.length > 0) {
      const firstPelajar = pelajarIds[0];
      let count = 0;
      for (const material of materialRows) {
        if (count < 8) { // Complete first 8 materials
          await connection.execute(
            `INSERT IGNORE INTO material_progress (user_id, material_id, is_completed, completed_at) 
             VALUES (?, ?, true, NOW())`,
            [firstPelajar, material.id]
          );
          count++;
        }
      }
    }

    // =====================
    // USER GAMIFICATION
    // =====================
    console.log('🎮 Seeding gamification data...');
    
    for (const pelajarId of pelajarIds) {
      const xp = Math.floor(Math.random() * 500) + 50;
      const level = xp < 100 ? 1 : xp < 250 ? 2 : xp < 500 ? 3 : 4;
      
      await connection.execute(
        `INSERT INTO user_gamification (user_id, total_xp, current_level) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE total_xp = VALUES(total_xp), current_level = VALUES(current_level)`,
        [pelajarId, xp, level]
      );
    }

    // =====================
    // XP HISTORY
    // =====================
    console.log('📊 Seeding XP history...');
    
    const xpReasons = [
      'complete_material', 'complete_course', 'submit_assignment', 
      'forum_post', 'mission_completed', 'perfect_quiz'
    ];
    
    for (const pelajarId of pelajarIds) {
      for (let i = 0; i < 10; i++) {
        const reason = xpReasons[Math.floor(Math.random() * xpReasons.length)];
        const xpAmount = [5, 10, 15, 20, 25, 50][Math.floor(Math.random() * 6)];
        
        await connection.execute(
          `INSERT INTO xp_history (user_id, xp_amount, reason, created_at) 
           VALUES (?, ?, ?, DATE_SUB(NOW(), INTERVAL ? DAY))`,
          [pelajarId, xpAmount, reason, Math.floor(Math.random() * 30)]
        );
      }
    }

    // =====================
    // USER BADGES
    // =====================
    console.log('🏆 Seeding user badges...');
    
    const [badgeRows] = await connection.execute('SELECT id FROM badges');
    
    for (const pelajarId of pelajarIds) {
      // Give each pelajar 2-3 random badges
      const numBadges = Math.floor(Math.random() * 2) + 2;
      const shuffledBadges = badgeRows.sort(() => 0.5 - Math.random()).slice(0, numBadges);
      
      for (const badge of shuffledBadges) {
        await connection.execute(
          `INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)`,
          [pelajarId, badge.id]
        );
      }
    }

    // =====================
    // USER MISSIONS
    // =====================
    console.log('🎯 Seeding user missions...');
    
    // Insert a specific uncompleted mission for testing
    await connection.execute(
      `INSERT INTO missions (title, description, type, requirement_type, requirement_count, xp_reward, badge_reward) 
       VALUES ('Misi Eksplorasi', 'Jelajahi fitur aplikasi ini sebanyak 5 kali', 'daily', 'login', 5, 50, NULL)
       ON DUPLICATE KEY UPDATE title=title`
    );

    const [missionRows] = await connection.execute('SELECT id, title, type FROM missions');
    
    for (const pelajarId of pelajarIds) {
      for (const mission of missionRows) {
        let isCompleted = Math.random() > 0.5;
        let progress = isCompleted ? 100 : Math.floor(Math.random() * 80);
        
        // Force "Misi Eksplorasi" to be uncompleted and 0 progress
        if (mission.title === 'Misi Eksplorasi') {
          isCompleted = false;
          progress = 0;
        }

        await connection.execute(
          `INSERT INTO user_missions (user_id, mission_id, progress, is_completed, completed_at) 
           VALUES (?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE progress = VALUES(progress), is_completed = VALUES(is_completed), completed_at = VALUES(completed_at)`,
          [pelajarId, mission.id, progress, isCompleted, isCompleted ? new Date() : null]
        );
      }
    }

    console.log('');
    console.log('✨ Database seeded successfully!');
    console.log('');
    console.log('📋 Test Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('| Role    | Email               | Password    |');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('| Admin   | admin@codelab.com   | admin123    |');
    console.log('| Mentor  | budi@mentor.com     | password123 |');
    console.log('| Mentor  | siti@mentor.com     | password123 |');
    console.log('| Mentor  | ahmad@mentor.com    | password123 |');
    console.log('| Pelajar | andi@pelajar.com    | password123 |');
    console.log('| Pelajar | dewi@pelajar.com    | password123 |');
    console.log('| Pelajar | fajar@pelajar.com   | password123 |');
    console.log('| Pelajar | syauqi@pelajar.com  | password123 |');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

seedDatabase().catch(console.error);
