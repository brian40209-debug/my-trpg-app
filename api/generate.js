// api/generate.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 初始化 Gemini API，確保您的環境變數中已設定 GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
  // 僅允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, history } = req.body;

  try {
    // 使用模型 (建議使用 gemini-1.5-flash 或 gemini-1.5-pro)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 啟動對話會話 (包含之前的歷史紀錄)
    const chat = model.startChat({
      history: history || [],
    });

    // 發送玩家的動作
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    // 回傳 AI 的回應給前端
    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "無法連接至 AI 引擎" });
  }
};