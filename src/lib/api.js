import axios from "axios";

// const BASE_URL = "https://rag-chatbot-i95z.onrender.com";
const BASE_URL = "http://localhost:8000";

export const askQuestion = async (question, sessionID, setSessionID) => {
  try {
    const body = {
      question: question
    };
    const reqestHeaders = {
      'Content-Type': 'application/json',
    };
    if (sessionID) {
      reqestHeaders['session-id'] = sessionID;
    }
    const config = {
      headers: reqestHeaders
    };
    const response = await axios.post(`${BASE_URL}/api/ask`, body, config);

    const data = response.data;

    if (data.session_id && !sessionID) {
      setSessionID(data.session_id);
    }

    return data.answer;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const endSession = async (sessionID) => {
  const reqestHeaders = {
    'Content-Type': 'application/json',
  };
  if (sessionID) {
    reqestHeaders['session-id'] = sessionID;
  }
  const config = {
    headers: reqestHeaders
  };

  try {
    await axios.post(`${BASE_URL}/api/end_session`, null, config);
  }
  catch (error) {
    console.error("API error:", error);
    throw error;
  }
}
