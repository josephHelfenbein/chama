"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatBox = () => {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hello I'm Chama! How can I help you today?" }]);
  const [userInput, setUserInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false); // Track chatbox visibility on smaller screens
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

  // Toggle function for the chatbox on smaller screens
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      {/* Button for small screens to toggle chat visibility */}
      <div className="lg:hidden p-4">
        <Button onClick={toggleChat}>{isChatOpen ? "Close Chat" : "Open Chat"}</Button>
      </div>

      {/* ChatBox - Visible only on large screens or when toggled open on smaller screens */}
      {(isChatOpen || window.innerWidth >= 1024) && (
        <div className="flex flex-col h-[60vh] lg:h-[60vh] w-full max-w-xs md:max-w-sm lg:max-w-md bg-white border border-gray-200 rounded-lg lg:rounded-none lg:border-l">
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
      )}
    </div>
  );
};

export default ChatBox;
