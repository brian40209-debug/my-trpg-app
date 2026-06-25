import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: '只允許 POST' });

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // 依照您的要求，強制指定模型為 gemini-2.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const { prompt, history } = req.body;
        const chat = model.startChat({ history: history || [] });
        const result = await chat.sendMessage(prompt);
        
        return res.status(200).json({ reply: result.response.text() });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
