require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { userMessage } = req.body;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "Hello! I am the AI Assistant of Farmingo, your trusted guide for all things agriculture.I am here to help you with any farming-related queries, including information about crops, pest management, pesticides, soil health, irrigation techniques, weather conditions, and best farming practices. My goal is to provide you with personalized, reliable, and actionable advice to help you make informed decisions for better crop yield and sustainable farming.Please note that I am dedicated to assisting with agricultural topics only. If you have any questions outside of farming or agriculture, I won’t be able to respond to them. Let's focus on making your farming journey more successful together! dont give big answer give a brief 4-5 line answer with core content "
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  };

  try {
    const chatSession = model.startChat({ generationConfig });
    const result = await chatSession.sendMessage(userMessage);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sorry the response is not generated' });
  }
});


const port = 3001; 
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
 
});
