
const { Client } = require('pg');
require('dotenv').config();

console.log('--- Debug Connection Infos ---');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('User:', process.env.DB_USER);
console.log('DB:', process.env.DB_NAME);
console.log('Password Length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);
console.log('Password First 3 chars:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.substring(0, 3) : 'NONE');
console.log('------------------------------');

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
});

client.connect()
    .then(() => {
        console.log('✅ Connection SUCCESS!');
        return client.end();
    })
    .catch(err => {
        console.error('❌ Connection FAILED:', err.message);
        if (err.message.includes('Tenant or user not found')) {
            console.log('\n💡 DIAGNOSIS: The Supabase Server REJECTED the Project ID or User.');
            console.log('   Possible reasons:');
            console.log('   1. The Project ID in "DB_USER" (after the dot) does not exist in this Region.');
            console.log('   2. The "DB_HOST" region is wrong (e.g. ap-south-1 vs ap-southeast-1).');
        }
        process.exit(1);
    });
