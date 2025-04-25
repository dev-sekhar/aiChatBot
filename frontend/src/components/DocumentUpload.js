// src/components/DocumentUpload.js
import React from "react";
import "./DocumentUpload.css";
import { FiPaperclip } from "react-icons/fi"; // Import the paperclip icon

const DocumentUpload = ({ onFileChange }) => {
  const iconColor = "#706e6d"; // Choose your desired color (e.g., blue)

  return (
    <div className="document-upload">
      <label htmlFor="file-upload" className="upload-icon-label">
        <FiPaperclip size={24} color={iconColor} />{" "}
        {/* Set the color using the color prop */}
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={onFileChange}
        style={{ display: "none" }} // Still hide the default input
      />
    </div>
  );
};

export default DocumentUpload;
