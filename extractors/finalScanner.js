import fs from "fs";
import path from "path";

const IGNORED_FOLDERS = ["node_modules", ".git", "uploads", "dist", "build"];

const ALLOWED_EXTENSIONS = [".js", ".ts", ".mjs"];

export function scanDirectory(rootPath) {
  let files = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip ignored folders
      if (entry.isDirectory()) {
        if (!IGNORED_FOLDERS.includes(entry.name)) {
          walk(fullPath);
        }
      } else {
        // Only accept JS/TS files
        if (ALLOWED_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    }
  }

  walk(rootPath);
  return files;
}
