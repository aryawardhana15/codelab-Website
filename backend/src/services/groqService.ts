import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
console.log('Groq Service Init - API Key present:', !!apiKey);

const groq = new Groq({
    apiKey: apiKey || 'dummy_key'
});

export const generateQuestion = async (context: string) => {
    try {
        if (!apiKey) {
            throw new Error('GROQ_API_KEY is missing in environment variables');
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `Anda adalah asisten pengajar AI yang ahli. Tugas Anda adalah membuat SATU pertanyaan latihan (essay singkat atau koding) berdasarkan materi yang diberikan.
          
          Kriteria pertanyaan:
          1. Harus relevan dengan konten materi.
          2. Mendorong pemahaman mendalam, bukan sekadar hafalan.
          3. Jika materi teknis/koding, berikan soal koding sederhana atau studi kasus.
          4. Gunakan Bahasa Indonesia yang baik dan benar.
          5. BERIKAN PERTANYAAN YANG BERVARIASI setiap kali diminta. Cobalah menanyakan aspek detail yang berbeda atau studi kasus yang unik dari materi.
          
          Output hanya teks pertanyaannya saja, tanpa preambule.`
                },
                {
                    role: 'user',
                    content: `Materi:\n${context}\n\nBuatkan satu pertanyaan latihan untuk materi ini. (Variasi acak id: ${Math.random()})`
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.9,
        });

        return completion.choices[0]?.message?.content || 'Gagal membuat pertanyaan.';
    } catch (error) {
        console.error('Groq API Error:', error);
        throw new Error('Gagal menghubungi layanan AI');
    }
};

export const evaluateAnswer = async (question: string, answer: string, context: string) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `Anda adalah asisten pengajar AI. Tugas Anda adalah menilai jawaban siswa terhadap pertanyaan yang diberikan berdasarkan materi.
          
          Berikan output dalam format JSON persis seperti ini:
          {
            "score": number, // Nilai 0-100
            "feedback": "string", // Penjelasan singkat kenapa benar/salah
            "correctAnswer": "string" // Jawaban ideal atau contoh jawaban yang benar
          }
          
          Jangan tambahkan markdown block seperti \`\`\`json. Cukup raw JSON string saja.`
                },
                {
                    role: 'user',
                    content: `Materi Reference:\n${context}\n\nPertanyaan:\n${question}\n\nJawaban Siswa:\n${answer}\n\nNilai jawaban tersebut.`
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
        });

        const content = completion.choices[0]?.message?.content || '{}';
        try {
            // Clean potential markdown code blocks if the model ignores the system prompt
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanContent);
        } catch (e) {
            console.error("Failed to parse AI response", content);
            return {
                score: 0,
                feedback: "Gagal memproses penilaian AI. Silakan coba lagi.",
                correctAnswer: "-"
            };
        }

    } catch (error) {
        console.error('Groq API Error:', error);
        throw new Error('Gagal menghubungi layanan AI');
    }
};
