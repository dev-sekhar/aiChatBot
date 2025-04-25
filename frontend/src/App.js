// This is the main App component that renders the ChatUI.
import React from "react";
import ChatUI from "./ChatUI"; // Import the ChatUI component
import "./App.css"; // Import your CSS styles

function App() {
  return (
    <div className="App">
      <ChatUI />
    </div>
  );
}

export default App;
