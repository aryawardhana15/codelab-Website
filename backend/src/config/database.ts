import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Disable SSL for local/docker PostgreSQL, enable for external (Supabase, etc)
const isLocalDB = process.env.DB_HOST === 'db' || process.env.DB_HOST === 'localhost';

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    dialectOptions: isLocalDB ? {} : {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;
