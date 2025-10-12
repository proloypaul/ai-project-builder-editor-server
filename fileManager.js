// backend/fileManager.js
const fs = require("fs");
const path = require("path");

function createProjectFromJson(structure, targetPath) {
  function createRecursive(obj, currentPath) {
    Object.entries(obj).forEach(([name, value]) => {
      const newPath = path.join(currentPath, name);

      if (typeof value === "string") {
        fs.mkdirSync(currentPath, { recursive: true });
        fs.writeFileSync(newPath, value, "utf8");
      } else if (typeof value === "object") {
        fs.mkdirSync(newPath, { recursive: true });
        createRecursive(value, newPath);
      }
    });
  }

  fs.mkdirSync(targetPath, { recursive: true });
  createRecursive(structure, targetPath);
}

module.exports = { createProjectFromJson };
