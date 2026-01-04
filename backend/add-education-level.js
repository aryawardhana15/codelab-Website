/**
 * Add education_level column to courses table
 * Run with: node add-education-level.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function addColumn() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'codelab'
  });

  console.log('📝 Adding education_level column to courses table...');

  try {
    // Check if column exists
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'courses' AND COLUMN_NAME = 'education_level'`,
      [process.env.DB_NAME || 'codelab']
    );

    if (columns.length > 0) {
      console.log('✅ Column education_level already exists!');
    } else {
      await connection.execute(
        `ALTER TABLE courses ADD COLUMN education_level ENUM('SD', 'SMP', 'SMA', 'Kuliah') NULL AFTER difficulty`
      );
      console.log('✅ Column education_level added successfully!');
    }

    // Also add price column if missing
    const [priceColumns] = await connection.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'courses' AND COLUMN_NAME = 'price'`,
      [process.env.DB_NAME || 'codelab']
    );

    if (priceColumns.length === 0) {
      await connection.execute(
        `ALTER TABLE courses ADD COLUMN price DECIMAL(10,2) DEFAULT 0 AFTER education_level`
      );
      console.log('✅ Column price added successfully!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

addColumn();
