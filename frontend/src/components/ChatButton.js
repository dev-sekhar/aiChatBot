// src/components/ChatButton.js
import React from "react";
import "./ChatButton.css"; // Import button-specific styles

const ChatButton = ({ onClick, children }) => {
  return (
    <button className="chat-button" onClick={onClick}>
      {children}
    </button>
  );
};

export default ChatButton;
