import { useState, useEffect } from "react";
import { askQuestion } from "./lib/api";
import "./Chat.css";

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    startNewSession();
  }, []);

  const startNewSession = () => {
    setMessages([{ sender: "bot", text: "Hi, how can I help you?" }]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const answer = await askQuestion(input);
      const botMsg = { sender: "bot", text: answer };
      setMessages((prev) => [...prev, botMsg, { sender: "divider" }]);
    } catch (error) {
      const errorMsg = {
        sender: "bot",
        text: "Error: " + error.message,
      };
      setMessages((prev) => [...prev, errorMsg, { sender: "divider" }]);
    }

    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: "Hi, how can I help you?" }]);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">RAG Chatbot</div>
      <div className="chat-box">
        {messages.map((msg, idx) =>
          msg.sender === "divider" ? (
            <div key={idx} className="chat-divider">
              --- End of Chat ---
            </div>
          ) : (
            <div key={idx} className={`chat-message ${msg.sender}`}>
              <div className="bubble">{msg.text}</div>
            </div>
          )
        )}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Ask something..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
