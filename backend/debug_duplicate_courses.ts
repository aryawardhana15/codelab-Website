
import path from 'path';
import dotenv from 'dotenv';
// Load env before anything else
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('DB Config:', {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    hasPassword: !!process.env.DB_PASSWORD
});

import sequelize from './src/config/database';

async function checkDuplicates() {
    try {
        await sequelize.authenticate();
        console.log('Database connected');

        // 1. Find the user
        const [users] = await sequelize.query(`SELECT id, name, email FROM users WHERE name LIKE '%Andi Pratama%'`);
        const user = (users as any[])[0];

        if (!user) {
            console.log('User "Andi Pratama" not found.');
            return;
        }

        console.log(`User found: ${user.name} (ID: ${user.id})`);

        // 2. Check Enrollments for this user
        const [enrollments] = await sequelize.query(`SELECT id, user_id, course_id, enrolled_at FROM enrollments WHERE user_id = ${user.id}`);
        console.log('Enrollments:', JSON.stringify(enrollments, null, 2));

        // 3. Check Courses details for these enrollments
        if ((enrollments as any[]).length > 0) {
            const courseIds = (enrollments as any[]).map(e => e.course_id).join(',');
            const [courses] = await sequelize.query(`SELECT id, title, mentor_id FROM courses WHERE id IN (${courseIds})`);
            console.log('Courses:', JSON.stringify(courses, null, 2));
        }

        // 4. Run the exact query used in the service to see what it returns
        const [serviceResult] = await sequelize.query(
            `SELECT 
              c.id as course_id,
              c.title,
              e.id as enrollment_id,
              e.user_id
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            JOIN users u ON c.mentor_id = u.id
            WHERE e.user_id = ${user.id}
            ORDER BY e.enrolled_at DESC`
        );
        console.log('Service Query Result (Simplified):', JSON.stringify(serviceResult, null, 2));


    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

checkDuplicates();
