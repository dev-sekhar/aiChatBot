// server.js
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 5000;

app.use(cors());

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); // Store files in the 'uploads' directory
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
  // In the next steps, we'll process the file here
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
