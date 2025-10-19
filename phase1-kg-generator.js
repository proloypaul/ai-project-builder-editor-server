import fs from "fs";
import path from "path";

const ROOT_PATH = "projectStorage/ai-build-projectOne/topmostsourcing-backend";
const OUTPUT_FILE = "phase1-kg.json";

const kg = {
  nodes: [],
  edges: [],
};

function normalize(p) {
  return p.replace(/\\/g, "/");
}

function addNode(id, type, filePath) {
  kg.nodes.push({ id, type, file: filePath });
}

function addEdge(from, to, type) {
  kg.edges.push({ from, to, type });
}

function scanDirectory(dirPath, parentId = null) {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  const currentId = normalize(dirPath);
  addNode(currentId, "Folder", currentId);

  if (parentId) addEdge(parentId, currentId, "CONTAINS");

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    const normalized = normalize(fullPath);

    if (item.isDirectory()) {
      scanDirectory(fullPath, currentId);
    } else {
      addNode(normalized, "File", normalized);
      addEdge(currentId, normalized, "CONTAINS");
      extractImports(fullPath, normalized);
    }
  }
}

function extractImports(filePath, normalizedCurrent) {
  if (!filePath.endsWith(".js") && !filePath.endsWith(".mjs")) return;

  const content = fs.readFileSync(filePath, "utf8");

  const patterns = [
    /import\s+.*?from\s+['"](.*?)['"]/g,
    /require\(['"](.*?)['"]\)/g,
    /import\(['"](.*?)['"]\)/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const importedPath = resolveImportPath(filePath, match[1]);
      if (importedPath) {
        addEdge(normalizedCurrent, normalize(importedPath), "IMPORTS");
      }
    }
  }
}

function resolveImportPath(currentFile, importPath) {
  if (!importPath.startsWith(".")) return null;

  const baseDir = path.dirname(currentFile);
  let resolved = path.resolve(baseDir, importPath);

  if (fs.existsSync(resolved) && fs.lstatSync(resolved).isFile()) {
    return resolved;
  }

  const exts = [".js", ".mjs", ".cjs", ".json"];
  for (const ext of exts) {
    if (fs.existsSync(resolved + ext)) return resolved + ext;
  }

  if (fs.existsSync(resolved) && fs.lstatSync(resolved).isDirectory()) {
    for (const ext of exts) {
      const indexFile = path.join(resolved, "index" + ext);
      if (fs.existsSync(indexFile)) return indexFile;
    }
  }
  return null;
}

function generateKG() {
  scanDirectory(ROOT_PATH);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(kg, null, 2), "utf8");
  console.log(`✅ Phase-1 KG generated: ${OUTPUT_FILE}`);
}

generateKG();
