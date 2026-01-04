const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'codelab_db',
  multipleStatements: true // Important for running schema.sql
};

async function setupDatabase() {
  let connection;
  try {
    console.log('🔌 Connecting to MySQL server...');
    // Connect without database selected first appropriately
    connection = await mysql.createConnection({
      host: DB_CONFIG.host,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      multipleStatements: true
    });

    // 1. Create Database
    console.log(`🔨 Creating database '${DB_CONFIG.database}' if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_CONFIG.database}`);
    await connection.query(`USE ${DB_CONFIG.database}`);

    // 2. Run Schema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
        console.log('📜 Importing schema.sql...');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        // Split and execute statements one by one to avoid some large packet errors or just allow multipleStatements
        // For robustness with simple schema files, multipleStatements is usually fine.
        await connection.query(schemaSql);
        console.log('✅ Schema imported successfully.');
    } else {
        console.log('⚠️ Warning: schema.sql not found at ' + schemaPath);
    }

    // 3. Fix Column: course_id in chats
    console.log('🔧 Checking for missing columns...');
    try {
        const [columns] = await connection.query("SHOW COLUMNS FROM chats LIKE 'course_id'");
        if (columns.length === 0) {
            console.log('   ➕ Adding missing column: course_id to chats table');
            await connection.query('ALTER TABLE chats ADD COLUMN course_id INT NULL');
            // Try to add FK if possible, but might fail if data mismatch, so optional
            try {
                await connection.query('ALTER TABLE chats ADD CONSTRAINT fk_chats_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL');
            } catch (fkError) {
                console.log('   ⚠️ Could not add foreign key for course_id (might already exist or data issue), skipping FK.');
            }
        } else {
            console.log('   ✔️ Column course_id already exists in chats.');
        }
    } catch (err) {
        console.log('   ⚠️ Could not check chats table (maybe it does not exist yet?): ' + err.message);
    }

    // 4. Run Migrations
    const migrationsDir = path.join(__dirname, 'migrations');
    if (fs.existsSync(migrationsDir)) {
        console.log('🚀 Running migrations...');
        const files = fs.readdirSync(migrationsDir).sort();
        for (const file of files) {
            if (file.endsWith('.sql')) {
                console.log(`   ▶️ Executing migration: ${file}`);
                const migrationSql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
                try {
                    await connection.query(migrationSql);
                    console.log(`   ✅ ${file} executed.`);
                } catch (migErr) {
                    console.error(`   ❌ Error executing ${file}: ${migErr.message}`);
                    // Don't stop process, just log
                }
            }
        }
    }

    console.log('\n🎉 Database setup completed!');

  } catch (error) {
    console.error('\n❌ Error setting up database:', error);
  } finally {
    if (connection) await connection.end();
  }
}

setupDatabase();
