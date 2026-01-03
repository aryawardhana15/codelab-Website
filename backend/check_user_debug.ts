
import User from './src/models/User';
import sequelize from './src/config/database';

async function check() {
    try {
        await sequelize.authenticate();
        console.log('Database connected');
        const email = 'aryawardhana1@student.ub.ac.id';
        const user = await User.findOne({ where: { email } });
        if (user) {
            console.log('User found:', JSON.stringify(user.toJSON(), null, 2));
        } else {
            console.log('User not found in database.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

check();
