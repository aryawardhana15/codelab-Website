/**
 * Seed script for Codelab database (PostgreSQL version)
 * Run with: node seed-data-pg.js
 */

const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Disable SSL for local/docker PostgreSQL
const isLocalDB = process.env.DB_HOST === 'db' || process.env.DB_HOST === 'localhost';

async function seedDatabase() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: isLocalDB ? false : { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('🌱 Starting database seed...');

  try {
    // Generate bcrypt password hash
    const passwordHash = await bcrypt.hash('password123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    // =====================
    // USERS
    // =====================
    console.log('👤 Seeding users...');
    
    // Insert admin accounts
    const admins = [
      ['Admin', 'admin@codelab.com', adminPasswordHash, 'admin', true],
      ['Arya Wardhana', 'aryawardhana1@student.ub.ac.id', adminPasswordHash, 'admin', true],
      ['Syauqi', 'syauqi.imd@gmail.com', adminPasswordHash, 'admin', true]
    ];

    for (const admin of admins) {
      await client.query(`
        INSERT INTO users (name, email, password, role, is_verified) 
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO UPDATE SET password = $3, role = 'admin'
      `, admin);
    }

    // Insert mentor users
    const mentors = [
      ['Budi Santoso', 'budi@mentor.com', passwordHash, 'mentor', 'Mentor berpengalaman di bidang Programming', 'Programming, Web Development, Python', '5 tahun mengajar programming', true],
      ['Siti Nurhaliza', 'siti@mentor.com', passwordHash, 'mentor', 'Ahli Matematika dan Fisika', 'Matematika, Fisika, Kalkulus', '8 tahun mengajar di SMA', true],
      ['Ahmad Dahlan', 'ahmad@mentor.com', passwordHash, 'mentor', 'Guru Bahasa Inggris profesional', 'Bahasa Inggris, TOEFL, IELTS', '10 tahun pengalaman', true]
    ];

    for (const mentor of mentors) {
      await client.query(`
        INSERT INTO users (name, email, password, role, bio, expertise, experience, is_verified) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (email) DO NOTHING
      `, mentor);
    }

    // Insert pelajar users
    const pelajars = [
      ['Andi Pratama', 'andi@pelajar.com', passwordHash, 'pelajar', 'Siswa SMA kelas 12', true],
      ['Dewi Lestari', 'dewi@pelajar.com', passwordHash, 'pelajar', 'Mahasiswi semester 3', true],
      ['Fajar Ramadhan', 'fajar@pelajar.com', passwordHash, 'pelajar', 'Siswa SMK jurusan RPL', true],
      ['Syauqi', 'syauqi@pelajar.com', passwordHash, 'pelajar', 'Developer enthusiast', true]
    ];

    for (const pelajar of pelajars) {
      await client.query(`
        INSERT INTO users (name, email, password, role, bio, is_verified) 
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
      `, pelajar);
    }

    // Get user IDs
    const userResult = await client.query('SELECT id, email, role FROM users');
    const users = {};
    userResult.rows.forEach(u => users[u.email] = { id: u.id, role: u.role });

    // =====================
    // COURSES
    // =====================
    console.log('📚 Seeding courses...');
    
    const courses = [
      [users['budi@mentor.com']?.id, 'Dasar-dasar Programming Python', 'Pelajari pemrograman Python dari nol hingga mahir.', 'Programming', 'beginner', true],
      [users['budi@mentor.com']?.id, 'Web Development dengan JavaScript', 'Kuasai JavaScript untuk membangun website interaktif.', 'Programming', 'intermediate', true],
      [users['siti@mentor.com']?.id, 'Matematika SMA: Trigonometri', 'Materi trigonometri lengkap untuk siswa SMA.', 'Matematika', 'intermediate', true],
      [users['siti@mentor.com']?.id, 'Fisika Dasar: Mekanika', 'Pelajari konsep dasar mekanika fisika.', 'Fisika', 'beginner', true],
      [users['ahmad@mentor.com']?.id, 'English for Beginners', 'Kursus Bahasa Inggris untuk pemula.', 'Bahasa Inggris', 'beginner', true],
      [users['ahmad@mentor.com']?.id, 'TOEFL Preparation', 'Persiapan tes TOEFL dengan latihan intensif.', 'Bahasa Inggris', 'advanced', true]
    ];

    for (const course of courses) {
      if (course[0]) {
        await client.query(`
          INSERT INTO courses (mentor_id, title, description, category, difficulty, is_published) 
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING
        `, course);
      }
    }

    // Get course IDs
    const courseResult = await client.query('SELECT id, title, mentor_id FROM courses');

    // =====================
    // MATERIALS
    // =====================
    console.log('📖 Seeding materials...');
    
    for (const course of courseResult.rows) {
      for (let i = 1; i <= 5; i++) {
        await client.query(`
          INSERT INTO materials (course_id, title, description, content, order_index) 
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT DO NOTHING
        `, [
          course.id,
          `Materi ${i}: Bagian ${i}`,
          `Deskripsi untuk materi ${i}`,
          `<h2>Materi ${i}</h2><p>Konten pembelajaran untuk materi ${i}.</p>`,
          i
        ]);
      }
    }

    // =====================
    // ENROLLMENTS
    // =====================
    console.log('📝 Seeding enrollments...');
    
    const pelajarIds = Object.values(users).filter(u => u.role === 'pelajar').map(u => u.id);
    
    for (const pelajarId of pelajarIds) {
      for (let i = 0; i < Math.min(3, courseResult.rows.length); i++) {
        await client.query(`
          INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [pelajarId, courseResult.rows[i].id]);
      }
    }

    console.log('');
    console.log('✨ Database seeded successfully!');
    console.log('');
    console.log('📋 Test Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('| Role    | Email                           | Password    |');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('| Admin   | admin@codelab.com               | admin123    |');
    console.log('| Admin   | aryawardhana1@student.ub.ac.id  | admin123    |');
    console.log('| Admin   | syauqi.imd@gmail.com            | admin123    |');
    console.log('| Mentor  | budi@mentor.com                 | password123 |');
    console.log('| Mentor  | siti@mentor.com                 | password123 |');
    console.log('| Mentor  | ahmad@mentor.com                | password123 |');
    console.log('| Pelajar | andi@pelajar.com                | password123 |');
    console.log('| Pelajar | dewi@pelajar.com                | password123 |');
    console.log('| Pelajar | fajar@pelajar.com               | password123 |');
    console.log('| Pelajar | syauqi@pelajar.com              | password123 |');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

seedDatabase().catch(console.error);
