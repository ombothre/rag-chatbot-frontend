import { useState, useEffect, useRef } from "react";
import { askQuestion } from "./lib/api"; // Assuming this is your API call function
import ReactMarkdown from "react-markdown";
import "./Chat.css";

// SVG Icon for the send button
const SendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white"/>
  </svg>
);

// A simple component for the typing indicator
const TypingIndicator = () => (
  <div className="chat-message bot">
    <div className="avatar">🤖</div>
    <div className="bubble typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
);


function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll down when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Effect to start a new session on initial load
  useEffect(() => {
    startNewSession();
  }, []);

  const startNewSession = () => {
    setMessages([{ 
      sender: "bot", 
      text: "Hi there! I'm a RAG-powered chatbot. How can I assist you today?" 
    }]);
    setInput("");
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const answer = await askQuestion(input);
      const botMsg = { sender: "bot", text: answer };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = {
        sender: "bot",
        text: "Sorry, something went wrong. Please try again.",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Modern RAG Chatbot</h2>
        <button className="new-chat-btn" onClick={startNewSession}>New Chat</button>
      </div>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender} ${msg.isError ? 'error' : ''}`}>
            <div className="avatar">{msg.sender === "bot" ? "🤖" : "👤"}</div>
            <div className="bubble">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Ask a question..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

export default Chat;