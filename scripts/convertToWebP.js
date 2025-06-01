import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to process
const directories = [
  'public/icons',
  'public/gallery',
  'public/developers'
];

// Code directories to search for image references
const codeDirectories = [
  'src/components',
  'src'
];

// Process each directory
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist, skipping...`);
    return;
  }

  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    // Skip if not an image file
    if (!file.match(/\.(jpg|jpeg|png)$/i)) {
      return;
    }

    const inputPath = path.join(dir, file);
    const outputPath = path.join(dir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

    // Skip if WebP already exists
    if (fs.existsSync(outputPath)) {
      console.log(`WebP already exists for ${file}, skipping...`);
      return;
    }

    sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)
      .then(() => {
        console.log(`Converted ${file} to WebP`);
      })
      .catch(err => {
        console.error(`Error converting ${file}:`, err);
      });
  });
});

// Function to recursively get all files in a directory
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.match(/\.(tsx|ts|jsx|js)$/)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Replace image references in code files
codeDirectories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist, skipping...`);
    return;
  }

  const codeFiles = getAllFiles(dir);
  
  codeFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Replace image references
    content = content.replace(
      /src=["'](\/[^"']+\.(jpg|jpeg|png))["']/g,
      (match, src) => {
        modified = true;
        return `src="${src.replace(/\.(jpg|jpeg|png)$/i, '.webp')}"`;
      }
    );

    // Replace background image references
    content = content.replace(
      /backgroundImage: url\(["']?(\/[^"')]+\.(jpg|jpeg|png))["']?\)/g,
      (match, src) => {
        modified = true;
        return `backgroundImage: url(${src.replace(/\.(jpg|jpeg|png)$/i, '.webp')})`;
      }
    );

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated image references in ${file}`);
    }
  });
}); 