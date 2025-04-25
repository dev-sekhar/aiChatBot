// server.js
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs"); // Import the file system module

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000; // Use environment port from .env or default to 5000

app.use(cors());

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath =
      process.env.UPLOAD_FOLDER || path.join(__dirname, "uploads"); // Use env var or default relative path
    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// POST route for file upload
app.post("/api/upload", upload.single("document"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  console.log("File uploaded successfully:", req.file);

  // In a real application, you would process the file here (e.g., extract text)
  // and then potentially send a response with the processed data.

  res.json({
    message: "File uploaded successfully!",
    filename: req.file.filename,
  });
});

// Basic route to check if the server is running
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
