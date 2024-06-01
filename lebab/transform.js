// npm install -g lebab
// node transform.js

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src'); // Change 'src' to your directory

function transformFile(filePath) {
  //const command = `lebab --transform let --transform arrow --transform template --replace ${filePath}`;
  const command = `lebab --transform template --replace ${filePath}`;
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error transforming file ${filePath}: ${err.message}`);
      return;
    }
    if (stderr) {
      console.warn(`Warnings for file ${filePath}: ${stderr}`);
    }
    console.log(`Transformed file ${filePath}`);
  });
}

function transformDirectory(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.error(`Unable to scan directory: ${err}`);
    }
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        transformDirectory(filePath); // Recursively transform subdirectories
      } else if (file.endsWith('.js')) { // Adjust file extension as needed
        transformFile(filePath);
      }
    });
  });
}

transformDirectory(directoryPath);
