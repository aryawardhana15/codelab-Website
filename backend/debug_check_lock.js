const { getMaterialsByCourse } = require('./src/services/materialService');
const { User, Course, Material } = require('./src/models');
const sequelize = require('./src/config/database');

async function debug() {
    try {
        // 1. Find a course
        const course = await Course.findByPk(2); // Assuming course ID 2 from screenshot
        if (!course) {
            console.log("Course 2 not found. Trying to find any course...");
            const anyCourse = await Course.findOne();
            if (!anyCourse) {
                console.log("No courses found.");
                return;
            }
            console.log(`Analyzing Course ID: ${anyCourse.id}`);
            // recursively call or update id
        } else {
            console.log(`Analyzing Course ID: ${course.id}, Mentor ID: ${course.mentor_id}`);
        }

        // 2. Find a user who is NOT the mentor
        // We need to assume a user ID. Let's list some users.
        const users = await User.findAll({ limit: 5 });
        console.log("Users:", users.map(u => ({ id: u.id, name: u.name, role: u.role })));

        const mentorId = course ? course.mentor_id : 1;
        const studentUser = users.find(u => u.id !== mentorId);

        if (!studentUser) {
            console.log("No student user found different from mentor.");
        } else {
            console.log(`Testing as Student User: ${studentUser.id} (${studentUser.name})`);

            // 3. Call service
            // Note: materialService uses TS exports, this JS script might fail if not compiled or using ts-node.
            // Since we are in JS environment, we might need to rely on the build output or just mock it.
            // Actually, I can't easily import TS files in this JS script without ts-node.
            // I should use `npx ts-node debug_material_lock.ts`
        }
    } catch (err) {
        console.error(err);
    }
}

// Since I cannot easily run TS code from here without setup, I will rely on "run_command" with ts-node if available,
// or I will just look at the code logic again.
