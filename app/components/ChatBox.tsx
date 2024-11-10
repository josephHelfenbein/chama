"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatBoxProps {
  isChatOpen?: boolean;
  toggleChat?: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ isChatOpen = true, toggleChat }) => {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hello! I'm Chama. How can I help you today?" }]);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: userInput },
      { role: "assistant", content: "I'm here to help! What would you like to know?" }, // Placeholder response
    ];

    setMessages(newMessages);
    setUserInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`flex flex-col h-full w-full max-w-xs md:max-w-sm lg:max-w-md bg-white border border-gray-200 ${!isChatOpen ? "hidden" : ""}`}>
      {/* Optional close button for smaller screens */}
      {toggleChat && (
        <div className="lg:hidden p-4 flex justify-end">
          <Button onClick={toggleChat}>Close</Button>
        </div>
      )}

      {/* Messages Section with Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`p-2 rounded-lg ${
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-border flex items-center space-x-2">
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default ChatBox;
