const fs = require('fs');
const path = require('path');

// Define the upload directories
const uploadDirs = [
  path.join(process.cwd(), 'public', 'uploads'),
  path.join(process.cwd(), 'public', 'uploads', 'products'),
];

// Create directories if they don't exist
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});

console.log('Upload directories setup complete!'); 