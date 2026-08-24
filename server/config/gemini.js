const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

let genAI = null;
if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(apiKey);
}

const getGeminiModel = (modelName = 'gemini-1.5-flash') => {
  if (!genAI) {
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      genAI = new GoogleGenerativeAI(apiKey);
    } else {
      return null;
    }
  }
  return genAI.getGenerativeModel({ model: modelName });
};

module.exports = {
  getGeminiModel
};
