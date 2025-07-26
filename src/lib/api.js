import axios from "axios";

const BASE_URL = "https://rag-chatbot-i95z.onrender.com";

export const askQuestion = async (question) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/ask`, {
      question,
    });
    return response.data.answer;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
