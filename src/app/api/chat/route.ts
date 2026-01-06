import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'

// Inisialisasi Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// System prompt - PERSONALITY BOT
const SYSTEM_PROMPT = `Kamu adalah asisten virtual bernama Akbar Maulana Bot.
Kamu adalah AI assistant yang ramah dan helpful untuk website portfolio Akbar Maulana.

Tentang Akbar Maulana:
- Seorang siswa SMK yang sedang magang di Ashari Tech
- Sedang belajar web development dengan Next.js
- Hobi: Memasak, bermain game, dan berenang
- Skill: HTML, CSS, JavaScript, React, Next.js, Tailwind CSS, dan Google GenAI
- Tempat Tanggal Lahir: Makassar, 23 April 2007
- Umur : 19 tahun
- Alamat: Makassar, Indonesia

Cara kamu menjawab:
- Gunakan bahasa Indonesia yang santai tapi sopan
- Jawab dengan singkat dan jelas (maksimal 2-3 paragraf)
- Kalau ditanya tentang hal teknis, jelaskan dengan sederhana
- Kalau ditanya hal yang tidak kamu tahu, bilang dengan jujur
- Tambahkan emoji sesekali untuk membuat percakapan lebih friendly 😊
- GUNAKAN Markdown formatting seperti **bold**, *italic*, list, dan [link](url) jika diperlukan agar jawaban lebih mudah dibaca.
- JIKA memberikan kode, gunakan block code Markdown dengan bahasa yang sesuai.

Kamu TIDAK boleh:
- Menjawab pertanyaan yang tidak pantas
- Berpura-pura menjadi orang lain
- Memberikan informasi pribadi yang sensitif`

export async function POST(request: NextRequest) {
    try {
        const { message, history } = await request.json()

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        const conversationHistory =
            history?.map((msg: { role: string; content: string }) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
            })) || []

        // Gunakan unified SDK pattern (@google/genai)
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                {
                    role: 'model',
                    parts: [{ text: 'Baik, saya mengerti instruksi Anda. Silakan sampaikan pesan Anda.' }],
                },
                ...conversationHistory,
                {
                    role: 'user',
                    parts: [{ text: message }],
                },
            ],
        })

        // .text adalah accessor property (bukan method) di library ini
        const aiResponse = response.text || 'Maaf, saya tidak bisa memberikan jawaban saat ini.'

        return NextResponse.json({
            success: true,
            message: aiResponse,
        })
    } catch (error) {
        console.error('Gemini API Error:', error)

        let errorMessage = 'Gagal mendapatkan response dari AI. Coba lagi nanti.'
        let status = 500

        if (error instanceof Error && error.message.includes('API key')) {
            errorMessage = 'API key tidak valid. Periksa konfigurasi server.'
            status = 401
        }

        return NextResponse.json({ error: errorMessage }, { status })
    }
}

export async function GET() {
  return NextResponse.json({
    message: "API chat aktif (GET OK)",
  })
}