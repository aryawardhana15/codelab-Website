
import { register } from './src/services/authService';
import sequelize from './src/config/database';
import User from './src/models/User';

async function test() {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');

        const input = {
            name: 'Test User',
            email: 'aryawardhana1@student.ub.ac.id',
            password: 'password123',
            role: 'pelajar' as 'pelajar'
        };

        console.log('Attempting register...');
        const result = await register(input);
        console.log('Register success:', result);

        // Clean up
        await User.destroy({ where: { email: input.email } });
        console.log('Cleaned up test user');

    } catch (error: any) {
        console.error('Register failed:', error);
        if (error.errors) {
            console.error('Validation errors:', error.errors);
        }
    } finally {
        process.exit();
    }
}

test();
