
const { Client } = require('pg');

const projectId = 'xntsmgodjanhzbeqspff';
const password = 'CODELABBLABLA';
const user = `postgres.${projectId}`;

const hostsToCheck = [
    'aws-0-ap-southeast-1.pooler.supabase.com', // Singapore
    'aws-0-ap-south-1.pooler.supabase.com',     // Mumbai 0
    'aws-1-ap-south-1.pooler.supabase.com',     // Mumbai 1 (Current)
    'aws-0-us-east-1.pooler.supabase.com',      // US East
    'aws-0-eu-central-1.pooler.supabase.com'    // EU Central
];

async function checkHost(host) {
    const client = new Client({
        connectionString: `postgres://${user}:${password}@${host}:5432/postgres`,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000
    });

    try {
        console.log(`Testing ${host}...`);
        await client.connect();
        console.log(`✅ SUCCESS connecting to ${host}!`);
        await client.end();
        return true;
    } catch (err) {
        console.log(`❌ Failed ${host}: ${err.message}`);
        // If error is password related, it means User Found but Password Wrong -> Progress!
        if (err.message.includes('password authentication failed')) {
            console.log('   => USER FOUND! But password usage is wrong.');
            return true; // We found the region, just ref info is wrong
        }
        return false;
    }
}

async function run() {
    console.log('🕵️ Searching for correct Supabase Region...');
    for (const host of hostsToCheck) {
        if (await checkHost(host)) break;
    }
}

run();
