
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';

// Load .env explicitly from the current directory
dotenv.config({ path: path.join(__dirname, '.env') });

const apiKey = process.env.GROQ_API_KEY;
console.log('Testing Groq connection...');
console.log('API Key present:', !!apiKey);
if (apiKey) {
    console.log('API Key starts with:', apiKey.substring(0, 5) + '...');
}

const groq = new Groq({
    apiKey: apiKey
});

async function test() {
    try {
        console.log('Sending request to Groq...');
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: 'Hello, are you working?'
                }
            ],
            model: 'llama-3.3-70b-versatile',
        });
        console.log('Success!');
        console.log('Response:', completion.choices[0]?.message?.content);
    } catch (error: any) {
        console.error('Groq Test Error:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

test();
