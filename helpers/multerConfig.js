const multer = require("multer");
const path = require("path");

// Set storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the destination folder where uploaded files will be saved
    cb(null, path.join(__dirname, "../public/uploads/")); // Path to the uploads folder in the root directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

// Create multer instance with specified storage
const upload = multer({ storage });

module.exports = upload;
