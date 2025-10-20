import fs from "fs";
import path from "path";
import Parser from "tree-sitter";
import JavaScript from "tree-sitter-javascript";

const PROJECT_ROOT =
  "projectStorage/ai-build-projectOne/topmostsourcing-backend";
const OUTPUT_FILE = "phase1-v2-kg.json";

const parser = new Parser();
parser.setLanguage(JavaScript);

// Identify file type by folder name
function getFileType(filePath) {
  if (filePath.includes("/services/")) return "Service";
  if (filePath.includes("/controllers/")) return "Controller";
  if (filePath.includes("/routes/")) return "Route";
  if (filePath.includes("/models/")) return "Model";
  if (filePath.includes("/utils/")) return "Module";
  if (filePath.includes("/config/")) return "Config";
  return "File";
}

// Recursively get .js files
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (file.endsWith(".js")) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

// Extract import targets using Tree-sitter
function extractImports(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  const tree = parser.parse(code);
  const imports = [];

  function walk(node) {
    if (node.type === "import_statement") {
      const sourceNode = node.childForFieldName("source");
      if (sourceNode) {
        imports.push(sourceNode.text.replace(/['"]/g, ""));
      }
    }
    for (let i = 0; i < node.childCount; i++) {
      walk(node.child(i));
    }
  }

  walk(tree.rootNode);
  return imports;
}

// Convert relative import paths to matched files
function resolveImport(file, importPath, allFiles) {
  if (importPath.startsWith(".")) {
    const baseDir = path.dirname(file);
    const absPath = path.resolve(baseDir, importPath);
    const match = allFiles.find((f) => f.startsWith(absPath));
    return match || null;
  }
  const name = path.basename(importPath);
  return allFiles.find((f) => f.includes(name)) || null;
}

// Decide edge type based on your custom logic
function getEdgeType(fromType, toType) {
  if (fromType === "Service" && toType === "Controller") return "depends_on";
  if (fromType === "Controller" && toType === "Route") return "depends_on";
  if (fromType === "Controller" && toType === "Service") return "calls";
  if (fromType === "Route" && toType === "Controller") return "calls";
  if (fromType === "Service" && toType === "Model") return "uses";
  return "imports";
}

function buildKG() {
  const allFiles = getAllFiles(PROJECT_ROOT);
  const nodes = [];
  const edges = [];

  const fileMeta = allFiles.map((file) => ({
    id: path.basename(file, ".js"),
    type: getFileType(file),
    file,
  }));
  nodes.push(
    ...fileMeta.map((f) => ({ id: f.id, type: f.type, file: f.file }))
  );

  fileMeta.forEach((meta) => {
    const imports = extractImports(meta.file);
    imports.forEach((impt) => {
      const targetFile = resolveImport(meta.file, impt, allFiles);
      if (targetFile) {
        const targetMeta = fileMeta.find((f) => f.file === targetFile);
        if (targetMeta) {
          const edgeType = getEdgeType(meta.type, targetMeta.type);
          edges.push({
            from: meta.id,
            to: targetMeta.id,
            type: edgeType,
          });
        }
      }
    });
  });

  return { nodes, edges };
}

const kg = buildKG();
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(kg, null, 2), "utf8");
console.log(`✅ Generated: ${OUTPUT_FILE}`);
