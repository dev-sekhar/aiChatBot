// src/components/ChatInput.js
import React from 'react';
import './ChatInput.css'; // Import input-specific styles

const ChatInput = ({ value, onChange, onKeyDown, placeholder }) => {
  return (
    <textarea
      id="user-input"
      className="chat-input"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
    />
  );
};

export default ChatInput;