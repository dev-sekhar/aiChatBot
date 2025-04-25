// src/ChatUI.js
// Manages the chat interface, handling messages, user input, document uploads, and interaction with the backend.
import React, { useState, useRef, useEffect } from 'react';
import './ChatUI.css';
import ChatButton from './components/ChatButton';
import ChatInput from './components/ChatInput';
import DocumentUpload from './components/DocumentUpload';

const ChatUI = () => {
  // State to manage the array of messages displayed in the chat. Each message is an object with 'sender' and 'text' properties.
  const [messages, setMessages] = useState([
    { sender: 'user', text: 'Hello!' },
    { sender: 'assistant', text: 'Hi there! How can I help you today?' },
  ]);

  // State to manage the text currently being typed by the user in the input field.
  const [inputText, setInputText] = useState('');

  // State to hold the content of the uploaded document, which will be updated after backend processing.
  const [documentContent, setDocumentContent] = useState('');

  // State to hold the message displayed to the user regarding the document upload status.
  const [uploadMessage, setUploadMessage] = useState('');

  // useRef to create a reference to the chat history div. This allows us to programmatically scroll to the bottom.
  const chatHistoryRef = useRef(null);

  // useEffect hook to scroll to the bottom of the chat history whenever the 'messages' state updates.
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to handle changes in the user input field. Updates the 'inputText' state.
  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  // Function to handle sending a new message. It adds the user's message to the chat and simulates an AI response.
  const handleSendMessage = () => {
    const trimmedText = inputText.trim();
    if (trimmedText) {
      const newUserMessage = { sender: 'user', text: trimmedText };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setInputText('');
      simulateAIResponse(trimmedText); // Simulate AI response
    }
  };

  // Function to handle key press events in the input field. Sends a message when Enter is pressed without Shift.
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevents a new line in the input field
      handleSendMessage();
    }
  };

  // Function to handle file selection from the DocumentUpload component. It reads the file and sends it to the backend.
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
      setUploadMessage(
        `File uploaded: <span class="filename">${file.name}</span> - Uploading...`
      );

      const formData = new FormData();
      formData.append('document', file); // 'document' should match the backend's expected field name

      fetch('http://localhost:5000/api/upload', { // Replace with your actual backend URL if different
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Upload successful:", data);
          setUploadMessage(`File uploaded: <span class="filename">${data.filename}</span> - Successfully processed.`);
          // In a real application, you would process the 'data' received from the backend here.
          // For example, if the backend sends back the extracted text, you would update 'documentContent'.
          // setDocumentContent(data.extractedText);
        })
        .catch((error) => {
          console.error("Upload error:", error);
          setUploadMessage(`Error uploading file: ${error.message}`);
        });
    } else {
      setUploadMessage(""); // Clear the message if no file is selected
    }
  };

  // Placeholder function to simulate AI response based on user input. Replace with actual API calls to a language model.
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
      {/* Conditionally render the document content area if 'documentContent' has data */}
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
        {/* The chat history area, which scrolls to the bottom on new messages */}
        <div ref={chatHistoryRef} className="chat-history">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}-message`}>
              <div className="message-content">{message.text}</div>
            </div>
          ))}
        </div>
        {/* Display the upload status message to the user */}
        {uploadMessage && (
          <div
            className="upload-notification"
            dangerouslySetInnerHTML={{ __html: uploadMessage }}
          />
        )}
        {/* The input area for the user to interact with the chat */}
        <div className="chat-input-area">
          {/* Component for handling document uploads */}
          <DocumentUpload onFileChange={handleFileChange} />
          {/* Component for the text input field */}
          <ChatInput
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
          />
          {/* Button to send the user's message */}
          <ChatButton onClick={handleSendMessage}>Send</ChatButton>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;