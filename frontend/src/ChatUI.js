// src/ChatUI.js
// This component orchestrates the chat interface, managing messages, input, and document display.
import React, { useState, useRef, useEffect } from 'react';
import './ChatUI.css';
import ChatButton from './components/ChatButton';
import ChatInput from './components/ChatInput';
import DocumentUpload from './components/DocumentUpload';

const ChatUI = () => {
  // State to manage the array of messages displayed in the chat.
  const [messages, setMessages] = useState([
    { sender: 'user', text: 'Hello!' },
    { sender: 'assistant', text: 'Hi there! How can I help you today?' },
  ]);

  // State to manage the text currently being typed by the user.
  const [inputText, setInputText] = useState('');

  // State to hold the content of the uploaded document (initially empty).
  const [documentContent, setDocumentContent] = useState('');

  // State to hold the message about the uploaded document.
  const [uploadMessage, setUploadMessage] = useState('');

  // useRef to create a reference to the chat history div for scrolling.
  const chatHistoryRef = useRef(null);

  // useEffect to scroll to the bottom of the chat history on new messages.
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to handle changes in the user input.
  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  // Function to handle sending a new message.
  const handleSendMessage = () => {
    const trimmedText = inputText.trim();
    if (trimmedText) {
      const newUserMessage = { sender: 'user', text: trimmedText };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setInputText('');
      simulateAIResponse(trimmedText); // Simulate AI response
    }
  };

  // Function to handle key press events in the input (for sending on Enter).
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Function to handle file selection from the DocumentUpload component.
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
      setUploadMessage(
        `File uploaded: <span class="filename">${file.name}</span> - Content will be displayed here after processing.`
      );
      // In a real application, you would send this file to the backend for processing
      // and then update the 'documentContent' state with the processed text.
    } else {
      setUploadMessage(""); // Clear the message if no file is selected
    }
  };
  // Placeholder function to simulate AI response. Replace with actual API call.
  const simulateAIResponse = (userQuery) => {
    const thinkingMessage = { sender: 'assistant', text: 'Thinking...' };
    setMessages((prevMessages) => [...prevMessages, thinkingMessage]);

    setTimeout(() => {
      setMessages((prevMessages) => prevMessages.filter(msg => msg !== thinkingMessage));
      let responseText = '';
      userQuery = userQuery.toLowerCase();
      if (userQuery.includes('summarize')) {
        responseText = "Okay, I can help you with summarization. Please provide the document.";
      } else if (userQuery.includes('question about')) {
        responseText = "Please ask your specific question about the document content.";
      } else if (userQuery.includes('contract')) {
        responseText = "I can help with contract intelligence. What would you like to know?";
      } else {
        responseText = "That's an interesting query! How can I assist you further?";
      }
      const assistantResponseMessage = { sender: 'assistant', text: responseText };
      setMessages((prevMessages) => [...prevMessages, assistantResponseMessage]);
    }, 1500);
  };

  return (
    <div className="chat-container-wrapper">
      {documentContent && (
        <div className="document-column">
          <h3>Document Content</h3>
          <pre>{documentContent}</pre>
        </div>
      )}
      <div className="chat-container">
        <div className="chat-header">
          <h2>AI Assistant</h2>
        </div>
        <div ref={chatHistoryRef} className="chat-history">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}-message`}>
              <div className="message-content">{message.text}</div>
            </div>
          ))}
        </div>
        {uploadMessage && (
          <div
            className="upload-notification"
            dangerouslySetInnerHTML={{ __html: uploadMessage }}
          />
        )}
        <div className="chat-input-area">
          <DocumentUpload onFileChange={handleFileChange} />
          <ChatInput
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
          />
          <ChatButton onClick={handleSendMessage}>Send</ChatButton>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;