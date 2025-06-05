// scripts/convert-to-webp.js
import { execFile } from "child_process";
import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import cwebp from "cwebp-bin"; // ✅ pakai path dari modul ini

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = path.join(__dirname, "../public/icons");

try {
  const files = await readdir(directory);
  const pngFiles = files.filter(file => file.endsWith(".png"));

  pngFiles.forEach(file => {
    const inputPath = path.join(directory, file);
    const outputName = file.replace(".png", ".webp");
    const outputPath = path.join(directory, outputName);

    execFile(cwebp, [inputPath, "-o", outputPath], (error, stdout, stderr) => {
      if (error) {
        console.error(`Error converting ${file}:`, stderr);
      } else {
        console.log(`Converted ${file} -> ${outputName}`);
      }
    });
  });
} catch (err) {
  console.error("Failed to read directory:", err);
}
