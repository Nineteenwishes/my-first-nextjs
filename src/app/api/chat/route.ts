import { GoogleGenAI, Type } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import { generateImage } from '@/lib/image-generator'

// Inisialisasi Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

// System prompt - PERSONALITY BOT dengan kemampuan generate gambar
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

PENTING: Kamu memiliki kemampuan untuk MEMBUAT GAMBAR! 🎨
- Jika user meminta kamu membuat/generate/buat/gambar/gambarkan sesuatu, gunakan tool generate_image
- Jelaskan dulu apa yang akan kamu buat, lalu gunakan tool
- Contoh respons: "Baik, saya akan membuatkan gambar [deskripsi] untuk kamu!"
- Buat prompt gambar dalam bahasa Inggris yang detail untuk hasil terbaik

Kamu TIDAK boleh:
- Menjawab pertanyaan yang tidak pantas
- Berpura-pura menjadi orang lain
- Memberikan informasi pribadi yang sensitif`

// Definisi Tool untuk generate gambar
const imageGenerationTool = {
    functionDeclarations: [
        {
            name: 'generate_image',
            description: 'Generate gambar berdasarkan deskripsi dari user. Gunakan tool ini ketika user meminta untuk membuat, generate, buat, atau menggambar sesuatu.',
            parameters: {
                type: Type.OBJECT,
                properties: {
                    prompt: {
                        type: Type.STRING,
                        description: 'Deskripsi detail gambar yang ingin dibuat dalam bahasa Inggris. Contoh: "a cute orange cat wearing a small blue hat, digital art style, high quality"',
                    },
                },
                required: ['prompt'],
            },
        },
    ],
}

// Keyword patterns untuk mendeteksi permintaan gambar
const IMAGE_REQUEST_PATTERNS = [
    /buatkan?\s+(gambar|foto|image)/i,
    /generate\s+(gambar|foto|image)/i,
    /buat\s+(gambar|foto|image)/i,
    /gambarkan/i,
    /create\s+(an?\s+)?(image|picture|photo)/i,
    /draw\s+(me\s+)?(a|an)?/i,
    /tolong\s+gambar/i,
    /minta\s+gambar/i,
]

// Fungsi untuk mengekstrak prompt gambar dari pesan user
function extractImagePrompt(message: string): string {
    // Remove common Indonesian request phrases and convert to English-friendly prompt
    let prompt = message
        .replace(/buatkan?\s+(gambar|foto|image)\s*/i, '')
        .replace(/generate\s+(gambar|foto|image)\s*/i, '')
        .replace(/buat\s+(gambar|foto|image)\s*/i, '')
        .replace(/gambarkan\s*/i, '')
        .replace(/tolong\s*/i, '')
        .replace(/dong\s*/i, '')
        .replace(/ya\s*/i, '')
        .trim()

    // If prompt is still in Indonesian, keep it but add style hints
    if (prompt) {
        return `${prompt}, high quality, detailed, digital art style`
    }
    return 'a beautiful artistic image, high quality'
}

// Cek apakah pesan adalah permintaan gambar
function isImageRequest(message: string): boolean {
    return IMAGE_REQUEST_PATTERNS.some(pattern => pattern.test(message))
}

export async function POST(request: NextRequest) {
    try {
        const { message, history } = await request.json()

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        // FALLBACK: Deteksi permintaan gambar secara langsung via keywords
        // Ini berguna saat Gemini API rate limited
        if (isImageRequest(message)) {
            console.log('🎨 Direct image request detected, using fallback mode')
            const imagePrompt = extractImagePrompt(message)
            console.log('📝 Extracted prompt:', imagePrompt)

            try {
                const imageData = await generateImage(imagePrompt)

                if (imageData) {
                    return NextResponse.json({
                        success: true,
                        message: `Ini dia gambar yang kamu minta! 🎨`,
                        image: imageData,
                        imagePrompt: imagePrompt,
                    })
                } else {
                    return NextResponse.json({
                        success: true,
                        message: 'Maaf, saya tidak bisa membuat gambar saat ini. Coba lagi ya! 😅',
                    })
                }
            } catch (imageError) {
                console.error('❌ Image generation failed:', imageError)
                return NextResponse.json({
                    success: true,
                    message: 'Maaf, terjadi kesalahan saat membuat gambar. Coba lagi nanti ya! 🙏',
                })
            }
        }

        // Build conversation history (10 pesan terakhir)
        const conversationHistory =
            history?.slice(-10).map((msg: { role: string; content: string }) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
            })) || []

        // Generate response dengan tools
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
                { role: 'model', parts: [{ text: 'Baik, saya mengerti instruksi Anda. Silakan sampaikan pesan Anda.' }] },
                ...conversationHistory,
                { role: 'user', parts: [{ text: message }] },
            ],
            config: {
                tools: [imageGenerationTool],
            },
        })

        // Cek apakah AI mau pakai tool (function call)
        const functionCalls = response.functionCalls

        if (functionCalls && functionCalls.length > 0) {
            const functionCall = functionCalls[0]

            if (functionCall.name === 'generate_image') {
                const imagePrompt = functionCall.args?.prompt as string
                console.log('🎨 AI requested image generation with prompt:', imagePrompt)

                try {
                    // Generate gambar menggunakan helper
                    const imageData = await generateImage(imagePrompt)

                    if (imageData) {
                        return NextResponse.json({
                            success: true,
                            message: `Ini dia gambar yang kamu minta! 🎨`,
                            image: imageData,
                            imagePrompt: imagePrompt,
                        })
                    } else {
                        return NextResponse.json({
                            success: true,
                            message: 'Maaf, saya tidak bisa membuat gambar saat ini. Coba lagi ya! 😅',
                        })
                    }
                } catch (error) {
                    console.error('❌ Image generation failed:', error)
                    return NextResponse.json({
                        success: true,
                        message: 'Maaf, terjadi kesalahan saat membuat gambar. Coba lagi nanti ya! 🙏',
                    })
                }
            }
        }

        // Response text biasa (tanpa tool call)
        const textResponse = response.text || 'Maaf, saya tidak bisa memberikan jawaban saat ini.'

        return NextResponse.json({
            success: true,
            message: textResponse,
        })

    } catch (error: any) {
        console.error('❌ Chat API Error:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))

        let errorMessage = 'Gagal mendapatkan response dari AI. Coba lagi nanti.'
        let status = 500

        // Handle specific error types
        if (error?.status === 429) {
            errorMessage = 'API rate limit terlampaui. Tunggu beberapa saat dan coba lagi.'
            status = 429
        } else if (error?.status === 503) {
            errorMessage = 'Layanan AI sedang tidak tersedia. Coba lagi nanti.'
            status = 503
        } else if (error instanceof Error && error.message.includes('API key')) {
            errorMessage = 'API key tidak valid. Periksa konfigurasi server.'
            status = 401
        }

        return NextResponse.json({ error: errorMessage }, { status })
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'API chat aktif (GET OK) - dengan kemampuan generate gambar 🎨',
    })
}