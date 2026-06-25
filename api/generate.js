const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: '只允許 POST' });

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // 【關鍵修正】改用 gemini-1.5-flash-latest，這通常能解決 404 問題
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const { prompt, history } = req.body;
        const chat = model.startChat({ history: history || [] });
        const result = await chat.sendMessage(prompt);
        const responseText = result.response.text();

        return res.status(200).json({ reply: responseText });
    } catch (error) {
        console.error("Gemini API 處理失敗:", error);
        return res.status(500).json({ error: error.message });
    }
}
