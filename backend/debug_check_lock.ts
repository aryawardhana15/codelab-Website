import { getMaterialsByCourse } from './src/services/materialService';
import Course from './src/models/Course';
import User from './src/models/User';
import sequelize from './src/config/database';

async function debug() {
    try {
        const courseId = 2; // From screenshot
        const course = await Course.findByPk(courseId);

        if (!course) {
            console.log('Course not found');
            return;
        }

        console.log(`Course Mentor: ${course.mentor_id}`);

        // Test with a random user ID that is likely NOT the mentor
        // Assuming user IDs: 1, 2, 3...
        // Let's try to pass the mentor ID first to see if it reveals content
        console.log('--- Testing as Mentor ---');
        const materialsMentor = await getMaterialsByCourse(courseId, course.mentor_id);
        const lockedMatMentor = materialsMentor.find(m => m.is_locked);
        if (lockedMatMentor) {
            console.log('Locked Material ID:', lockedMatMentor.id);
            console.log('Content Visible (Mentor)?', lockedMatMentor.content !== null);
        } else {
            console.log('No locked materials found for this course.');
        }

        // Now test as a non-mentor
        console.log('--- Testing as Student (ID: 99999) ---');
        const materialsStudent = await getMaterialsByCourse(courseId, 99999);
        const lockedMatStudent = materialsStudent.find(m => m.is_locked);
        if (lockedMatStudent) {
            console.log('Content Visible (Student)?', lockedMatStudent.content !== null);
            console.log('Is Locked?', lockedMatStudent.is_locked);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

debug();
