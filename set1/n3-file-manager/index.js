// Full Name: Liezelle Mangunay
// Section: IV-BSIT C
// Activity Code: N3 - File Manager with fs and path
// Date: November 25, 2026

const fs = require('fs');
const path = require('path');

const filesDir = path.join(__dirname, 'files');

// Ensure the 'files' subfolder exists
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true });
}

const command = process.argv[2] ? process.argv[2].toLowerCase() : null;
const fileName = process.argv[3];
const content = process.argv.slice(4).join(' ');

function getSafeFilePath(name) {
  const cleanName = path.basename(name);
  return path.join(filesDir, cleanName);
}

switch (command) {
  case 'create': {
    if (!fileName || !content) {
      console.log('Error: Usage -> node index.js create <filename> "<content>"');
      break;
    }
    const filePath = getSafeFilePath(fileName);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Created "${path.basename(filePath)}" in ${filesDir}`);
    break;
  }

  case 'read': {
    if (!fileName) {
      console.log('Error: Usage -> node index.js read <filename>');
      break;
    }
    const filePath = getSafeFilePath(fileName);
    if (!fs.existsSync(filePath)) {
      console.log(`Error: Cannot read "${path.basename(filePath)}" because it does not exist.`);
      break;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    console.log(`--- Contents of ${path.basename(filePath)} ---`);
    console.log(data);
    break;
  }

  case 'update': {
    if (!fileName || !content) {
      console.log('Error: Usage -> node index.js update <filename> "<additional text>"');
      break;
    }
    const filePath = getSafeFilePath(fileName);
    if (!fs.existsSync(filePath)) {
      console.log(`Error: Cannot update "${path.basename(filePath)}" because it does not exist.`);
      break;
    }
    fs.appendFileSync(filePath, `\n${content}`, 'utf8');
    console.log(`Updated "${path.basename(filePath)}" with appended text.`);
    break;
  }

  case 'delete': {
    if (!fileName) {
      console.log('Error: Usage -> node index.js delete <filename>');
      break;
    }
    const filePath = getSafeFilePath(fileName);
    if (!fs.existsSync(filePath)) {
      console.log(`Error: Cannot delete "${path.basename(filePath)}" because it does not exist.`);
      break;
    }
    fs.unlinkSync(filePath);
    console.log(`Deleted "${path.basename(filePath)}" successfully.`);
    break;
  }

  case 'list': {
    const items = fs.readdirSync(filesDir);
    if (items.length === 0) {
      console.log('The files folder is currently empty.');
      break;
    }
    console.log(`=== Files in ${filesDir} (${items.length} total) ===\n`);
    items.forEach((item, index) => {
      const fullPath = path.join(filesDir, item);
      const stats = fs.statSync(fullPath);
      if (stats.isFile()) {
        const name = path.basename(fullPath);
        const ext = path.extname(fullPath) || '(no extension)';
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        console.log(`${index + 1}. File Name : ${name}`);
        console.log(`   Extension : ${ext}`);
        console.log(`   Full Path : ${fullPath}`);
        console.log(`   Contents  : ${fileContent}\n`);
      }
    });
    break;
  }

  default:
    console.log('Unknown command. Available commands:');
    console.log('  node index.js create <filename> "<content>"');
    console.log('  node index.js read <filename>');
    console.log('  node index.js update <filename> "<text>"');
    console.log('  node index.js delete <filename>');
    console.log('  node index.js list');
}