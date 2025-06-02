import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory to process
const backgroundDir = path.join(__dirname, '../public/background');

// Process background directory
if (!fs.existsSync(backgroundDir)) {
  console.log(`Directory ${backgroundDir} does not exist, skipping...`);
  process.exit(1);
}

const files = fs.readdirSync(backgroundDir);

files.forEach(file => {
  // Skip if not an image file
  if (!file.match(/\.(jpg|jpeg|png)$/i)) {
    return;
  }

  const inputPath = path.join(backgroundDir, file);
  const outputPath = path.join(backgroundDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

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