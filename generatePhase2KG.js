/**
 * generatePhase2KG.js
 * Node.js ES modules (ES6) - Phase 2 Knowledge Graph generator
 *
 * Usage:
 *   node generatePhase2KG.js
 *
 * Output:
 *   - phase2-kg.json (merged Phase1 + Phase2 nodes & edges)
 *
 * Note: Install dependencies:
 *   npm install tree-sitter tree-sitter-javascript tree-sitter-typescript
 */

import fs from "fs";
import path from "path";
import Parser from "tree-sitter";
import JavaScript from "tree-sitter-javascript";
// Correct import for tree-sitter-typescript
import pkg from "tree-sitter-typescript";
const { typescript, tsx } = pkg;

// === CONFIG ===
const ROOT_PATH = "projectStorage/ai-build-projectOne/topmostsourcing-backend";
const PHASE1_FILE = "phase1-kg.json";
const OUTPUT_FILE = "phase2-kg.json";
const ALLOWED_EXTS = [".js", ".mjs", ".cjs", ".ts", ".tsx"];

// === UTILITIES ===
function normalize(p) {
  return p.replace(/\\/g, "/");
}

function readJSONSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    return null;
  }
}

function writeJSON(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), "utf8");
}

function addUniqueNode(kg, node) {
  const key = `${node.id}:::${node.type}`;
  if (!kg._nodeSet) kg._nodeSet = new Set();
  if (!kg._nodeSet.has(key)) {
    kg.nodes.push(node);
    kg._nodeSet.add(key);
  }
}
function addUniqueEdge(kg, edge) {
  const key = `${edge.from}:::${edge.to}:::${edge.type}`;
  if (!kg._edgeSet) kg._edgeSet = new Set();
  if (!kg._edgeSet.has(key)) {
    kg.edges.push(edge);
    kg._edgeSet.add(key);
  }
}

// === PHASE1 LOADING or SCAN FALLBACK ===
function defaultPhase1Scan(rootPath) {
  // Minimal Phase1 scanner (folder+file+imports) — used only if phase1 file not present.
  const kg = { nodes: [], edges: [] };

  function scan(dir, parent = null) {
    const normalizedDir = normalize(dir);
    addUniqueNode(kg, {
      id: normalizedDir,
      type: "Folder",
      file: normalizedDir,
    });
    if (parent)
      addUniqueEdge(kg, { from: parent, to: normalizedDir, type: "CONTAINS" });

    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const it of items) {
      const full = path.join(dir, it.name);
      const normFull = normalize(full);
      if (it.isDirectory()) {
        scan(full, normalizedDir);
      } else {
        addUniqueNode(kg, { id: normFull, type: "File", file: normFull });
        addUniqueEdge(kg, {
          from: normalizedDir,
          to: normFull,
          type: "CONTAINS",
        });
        // Try to extract imports for JS-like
        if (ALLOWED_EXTS.includes(path.extname(it.name))) {
          const imports = extractImportPathsSimple(full);
          for (const imp of imports) {
            const resolved = resolveImportPath(full, imp);
            if (resolved)
              addUniqueEdge(kg, {
                from: normFull,
                to: normalize(resolved),
                type: "IMPORTS",
              });
          }
        }
      }
    }
  }

  scan(rootPath, null);
  return kg;
}

// fallback simple import parser (regex)
function extractImportPathsSimple(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const patterns = [
      /import\s+.*?from\s+['"](.*?)['"]/g,
      /require\(['"](.*?)['"]\)/g,
      /import\(['"](.*?)['"]\)/g,
    ];
    const out = new Set();
    for (const p of patterns) {
      let m;
      while ((m = p.exec(content)) !== null) {
        out.add(m[1]);
      }
    }
    return [...out];
  } catch (e) {
    return [];
  }
}

function resolveImportPath(currentFile, importPath) {
  if (!importPath.startsWith(".")) return null;
  const baseDir = path.dirname(currentFile);
  let resolved = path.resolve(baseDir, importPath);
  const exts = [".js", ".mjs", ".cjs", ".ts", ".tsx", ".json"];
  if (fs.existsSync(resolved) && fs.lstatSync(resolved).isFile())
    return resolved;
  for (const e of exts) {
    if (fs.existsSync(resolved + e)) return resolved + e;
  }
  if (fs.existsSync(resolved) && fs.lstatSync(resolved).isDirectory()) {
    for (const e of exts) {
      const idx = path.join(resolved, "index" + e);
      if (fs.existsSync(idx)) return idx;
    }
  }
  return null;
}

// === TREE-SITTER SETUP ===
const parser = new Parser();
// default language is JavaScript
parser.setLanguage(JavaScript);

// A helper to parse and safely walk nodes
function parseSource(filePath, source) {
  // Switch language by extension
  const ext = path.extname(filePath).toLowerCase();
  try {
    if (ext === ".ts") {
      parser.setLanguage(typescript);
    } else if (ext === ".tsx") {
      parser.setLanguage(tsx);
    } else {
      parser.setLanguage(JavaScript);
    }
  } catch (e) {
    // If setLanguage fails for some reason, fallback to JS parser
    try {
      parser.setLanguage(JavaScript);
    } catch (e2) {}
  }
  try {
    return parser.parse(source);
  } catch (e) {
    return null;
  }
}

// small helper to traverse tree-sitter nodes
function walkTree(node, cb) {
  if (!node) return;
  cb(node);
  for (let i = 0; i < node.namedChildCount; i++) {
    const child = node.namedChild(i);
    if (child) walkTree(child, cb);
  }
}

// read file with fallback
function readFileSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch (e) {
    return "";
  }
}

// === EXTRACTION LOGIC ===
function extractCodeLevelKG(phase1KG) {
  // Build file list from phase1 nodes
  const fileNodes = phase1KG.nodes.filter((n) => n.type === "File");
  const filePaths = fileNodes.map((n) => n.file);

  const kg = { nodes: [], edges: [] };

  // Index existing phase1 nodes/edges into addUnique helpers to avoid dupes
  const merged = { nodes: [], edges: [] };
  merged.nodes = phase1KG.nodes.slice();
  merged.edges = phase1KG.edges.slice();
  // initialize sets
  merged._nodeSet = new Set(phase1KG.nodes.map((n) => `${n.id}:::${n.type}`));
  merged._edgeSet = new Set(
    phase1KG.edges.map((e) => `${e.from}:::${e.to}:::${e.type}`)
  );

  // helper to create internal IDs for code-level nodes
  const nodeId = (file, localName, kind) =>
    `${normalize(file)}::${kind}::${localName}`;

  // Map file -> declared functions/classes for quick resolution
  const fileDeclared = {}; // filePath -> { functions: Set, classes: Set, exports: Set }

  // First pass: parse files and collect declarations
  for (const file of filePaths) {
    const ext = path.extname(file).toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) continue;
    const src = readFileSafe(file);
    const tree = parseSource(file, src);
    fileDeclared[file] = {
      functions: new Set(),
      classes: new Set(),
      methods: new Set(),
      exports: new Set(),
    };

    if (!tree) {
      // fallback regex: function declarations
      const fnRegex = /function\s+([a-zA-Z0-9_$]+)\s*\(/g;
      let m;
      while ((m = fnRegex.exec(src)) !== null) {
        fileDeclared[file].functions.add(m[1]);
      }
      const clsRegex = /class\s+([a-zA-Z0-9_$]+)/g;
      while ((m = clsRegex.exec(src)) !== null) {
        fileDeclared[file].classes.add(m[1]);
      }
      continue;
    }

    const root = tree.rootNode;

    walkTree(root, (node) => {
      // function_declaration
      if (node.type === "function_declaration") {
        const idNode =
          typeof node.childForFieldName === "function"
            ? node.childForFieldName("name")
            : null;
        let name =
          (idNode && idNode.text) ||
          (node.child(0) && node.child(0).text) ||
          null;
        if (name) fileDeclared[file].functions.add(name);
      }

      // lexical_declaration like: const foo = () => {}
      if (
        node.type === "lexical_declaration" ||
        node.type === "variable_declaration"
      ) {
        // find variable declarators
        for (let i = 0; i < node.namedChildCount; i++) {
          const declarator = node.namedChild(i);
          if (!declarator) continue;
          if (declarator.type === "variable_declarator") {
            const id =
              typeof declarator.childForFieldName === "function"
                ? declarator.childForFieldName("name")
                : declarator.child(0);
            const init =
              typeof declarator.childForFieldName === "function"
                ? declarator.childForFieldName("value")
                : declarator.child(1);
            const name = id && id.text;
            if (init && name) {
              if (
                init.type === "arrow_function" ||
                init.type === "function" ||
                init.type === "function_expression"
              ) {
                fileDeclared[file].functions.add(name);
              }
            }
          }
        }
      }

      // class_declaration
      if (node.type === "class_declaration") {
        const nameNode =
          typeof node.childForFieldName === "function"
            ? node.childForFieldName("name")
            : null;
        const name =
          (nameNode && nameNode.text) ||
          (node.child(1) && node.child(1).text) ||
          null;
        if (name) fileDeclared[file].classes.add(name);

        // methods inside class
        const body =
          typeof node.childForFieldName === "function"
            ? node.childForFieldName("body")
            : null;
        if (body) {
          for (let i = 0; i < body.namedChildCount; i++) {
            const method = body.namedChild(i);
            if (method && method.type === "method_definition") {
              const methodNameNode =
                typeof method.childForFieldName === "function"
                  ? method.childForFieldName("name")
                  : null;
              const mname =
                (methodNameNode && methodNameNode.text) ||
                (method.child(0) && method.child(0).text);
              if (mname) fileDeclared[file].methods.add(`${name}.${mname}`);
            }
          }
        }
      }

      // export_statement / export_clause
      if (node.type === "export_statement" || node.type === "export_clause") {
        const text = node.text || "";
        // crude extraction of exported identifiers
        const exportRegex =
          /export\s+(?:default\s+)?(?:class|function)?\s*([A-Za-z0-9_$]+)/;
        const m = exportRegex.exec(text);
        if (m && m[1]) fileDeclared[file].exports.add(m[1]);
        // named exports like: export { a, b as c }
        const namedRegex = /export\s*{\s*([^}]+)\s*}/;
        const mn = namedRegex.exec(text);
        if (mn && mn[1]) {
          mn[1].split(",").forEach((s) => {
            const id = s.split("as")[0].trim();
            if (id) fileDeclared[file].exports.add(id);
          });
        }
      }

      // module.exports = { ... } or exports.foo = ...
      if (node.type === "assignment_expression") {
        const left = node.child(0);
        if (
          left &&
          left.text &&
          (left.text.startsWith("module.exports") ||
            left.text.startsWith("exports."))
        ) {
          const rightText = node.child(2) ? node.child(2).text : "";
          const names = rightText.match(/[A-Za-z0-9_$]+/g) || [];
          names.forEach((n) => fileDeclared[file].exports.add(n));
        }
      }
    });
  } // end first pass

  // Create code-level nodes from declarations
  for (const [file, decl] of Object.entries(fileDeclared)) {
    const normalizedFile = normalize(file);
    // ensure file node exists (should from phase1)
    addUniqueNode(merged, {
      id: normalizedFile,
      type: "File",
      file: normalizedFile,
    });

    // Functions
    for (const fn of decl.functions) {
      const id = nodeId(file, fn, "Function");
      addUniqueNode(merged, {
        id,
        type: "Function",
        name: fn,
        file: normalizedFile,
      });
      addUniqueEdge(merged, { from: normalizedFile, to: id, type: "defines" });
    }
    // Classes
    for (const cls of decl.classes) {
      const id = nodeId(file, cls, "Class");
      addUniqueNode(merged, {
        id,
        type: "Class",
        name: cls,
        file: normalizedFile,
      });
      addUniqueEdge(merged, { from: normalizedFile, to: id, type: "defines" });
    }
    // Methods
    for (const m of decl.methods) {
      // m looks like ClassName.methodName
      const [cls, methodName] = m.split(".");
      const classId = nodeId(file, cls, "Class");
      const methodId = nodeId(file, methodName, "Method");
      addUniqueNode(merged, {
        id: methodId,
        type: "Method",
        name: methodName,
        file: normalizedFile,
      });
      addUniqueEdge(merged, {
        from: classId,
        to: methodId,
        type: "has_method",
      });
    }
    // Exports - create Export nodes for visibility
    for (const ex of decl.exports) {
      const id = nodeId(file, ex, "Export");
      addUniqueNode(merged, {
        id,
        type: "Export",
        name: ex,
        file: normalizedFile,
      });
      addUniqueEdge(merged, { from: normalizedFile, to: id, type: "exports" });
    }
  }

  // Second pass: analyze calls, models, API endpoints, and resolve some cross-file calls
  // We'll create a map exportedName -> file for quick mapping of imports (best-effort)
  const exportNameToFile = {};
  for (const [file, decl] of Object.entries(fileDeclared)) {
    for (const ex of decl.exports) {
      exportNameToFile[ex] = file;
    }
  }

  for (const file of filePaths) {
    const ext = path.extname(file).toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) continue;
    const src = readFileSafe(file);
    const tree = parseSource(file, src);
    const normalizedFile = normalize(file);

    // local function stack to establish which function encloses a call
    const functionStack = [];

    // a helper to find current function node id (if in function), else file-level
    const currentFunctionId = () => {
      if (functionStack.length === 0) return normalizedFile;
      const top = functionStack[functionStack.length - 1];
      return nodeId(file, top, "Function");
    };

    if (!tree) {
      // fallback: simple regex to detect mongoose.model
      const mm = /mongoose\.model\s*\(\s*['\"]([^'\"]+)['\"]\)/g;
      let m;
      while ((m = mm.exec(src)) !== null) {
        const modelName = m[1];
        const modelId = nodeId(file, modelName, "Model");
        addUniqueNode(merged, {
          id: modelId,
          type: "Model",
          name: modelName,
          file: normalizedFile,
        });
        addUniqueEdge(merged, {
          from: normalizedFile,
          to: modelId,
          type: "defines_model",
        });
      }
      continue;
    }

    const root = tree.rootNode;
    walkTree(root, (node) => {
      // Entering function-like nodes: push name onto stack if known
      if (node.type === "function_declaration") {
        const nameNode =
          typeof node.childForFieldName === "function"
            ? node.childForFieldName("name")
            : null;
        const name = (nameNode && nameNode.text) || null;
        if (name) functionStack.push(name);
      } else if (node.type === "arrow_function" || node.type === "function") {
        const parent = node.parent;
        if (parent && parent.type === "variable_declarator") {
          const id =
            typeof parent.childForFieldName === "function"
              ? parent.childForFieldName("name")
              : parent.child(0);
          if (id && id.text) functionStack.push(id.text);
        } else {
          functionStack.push("<anon>");
        }
      } else if (node.type === "call_expression") {
        const calleeNode = node.child(0);
        let calleeName = null;
        if (!calleeNode) return;
        if (calleeNode.type === "identifier") {
          calleeName = calleeNode.text;
          const fromId = currentFunctionId();
          if (
            fileDeclared[file] &&
            fileDeclared[file].functions.has(calleeName)
          ) {
            const toId = nodeId(file, calleeName, "Function");
            addUniqueEdge(merged, { from: fromId, to: toId, type: "calls" });
          } else if (exportNameToFile[calleeName]) {
            const targetFile = exportNameToFile[calleeName];
            const toId = nodeId(targetFile, calleeName, "Function");
            addUniqueEdge(merged, {
              from: fromId,
              to: normalize(toId),
              type: "calls",
            });
          } else {
            const toId = `GLOBAL::${calleeName}`;
            addUniqueNode(merged, {
              id: toId,
              type: "Function",
              name: calleeName,
              file: null,
            });
            addUniqueEdge(merged, { from: fromId, to: toId, type: "calls" });
          }
        } else if (calleeNode.type === "member_expression") {
          const prop =
            typeof calleeNode.childForFieldName === "function"
              ? calleeNode.childForFieldName("property")
              : null;
          const obj =
            typeof calleeNode.childForFieldName === "function"
              ? calleeNode.childForFieldName("object")
              : null;
          const propName =
            (prop && prop.text) ||
            (calleeNode.lastChild && calleeNode.lastChild.text);
          const objName = obj && obj.text;
          if (propName && objName) {
            const fromId = currentFunctionId();

            // Heuristic: app.get/post -> API endpoint
            if (
              ["get", "post", "put", "delete", "patch", "all"].includes(
                propName
              ) &&
              (objName === "app" ||
                objName === "router" ||
                objName.endsWith("Router"))
            ) {
              const argsNode = node.child(1);
              let routePath = null;
              if (argsNode && argsNode.namedChildCount > 0) {
                const firstArg = argsNode.namedChild(0);
                if (firstArg && firstArg.type === "string")
                  routePath = firstArg.text.replace(/['"]/g, "");
                const secondArg = argsNode.namedChild(1);
                if (secondArg) {
                  if (secondArg.type === "identifier") {
                    const handlerName = secondArg.text;
                    const endpointId = nodeId(
                      file,
                      `${objName}.${propName} ${routePath || ""}`,
                      "API_Endpoint"
                    );
                    addUniqueNode(merged, {
                      id: endpointId,
                      type: "API_Endpoint",
                      name: routePath || `${propName}`,
                      file: normalizedFile,
                    });
                    addUniqueEdge(merged, {
                      from: normalizedFile,
                      to: endpointId,
                      type: "defines",
                    });

                    if (
                      fileDeclared[file] &&
                      (fileDeclared[file].functions.has(handlerName) ||
                        fileDeclared[file].classes.has(handlerName))
                    ) {
                      const handlerKind = fileDeclared[file].functions.has(
                        handlerName
                      )
                        ? "Function"
                        : "Class";
                      const handlerId = nodeId(file, handlerName, handlerKind);
                      addUniqueEdge(merged, {
                        from: endpointId,
                        to: handlerId,
                        type: "handled_by",
                      });
                    } else if (exportNameToFile[handlerName]) {
                      const handlerFile = exportNameToFile[handlerName];
                      const handlerId = nodeId(
                        handlerFile,
                        handlerName,
                        "Function"
                      );
                      addUniqueEdge(merged, {
                        from: endpointId,
                        to: handlerId,
                        type: "handled_by",
                      });
                    } else {
                      const handlerId = `GLOBAL_HANDLER::${handlerName}`;
                      addUniqueNode(merged, {
                        id: handlerId,
                        type: "Function",
                        name: handlerName,
                        file: null,
                      });
                      addUniqueEdge(merged, {
                        from: endpointId,
                        to: handlerId,
                        type: "handled_by",
                      });
                    }
                  }
                }
              }
            } else {
              const maybeName = `${objName}.${propName}`;
              const fromId = currentFunctionId();
              const toId = `EXPR::${maybeName}`;
              addUniqueNode(merged, {
                id: toId,
                type: "Function",
                name: propName,
                file: null,
              });
              addUniqueEdge(merged, { from: fromId, to: toId, type: "calls" });
            }
          }
        }
      }

      // detect mongoose.model or sequelize define
      if (node.type === "call_expression") {
        const callee = node.child(0);
        const calleeText = callee && callee.text;
        if (calleeText && calleeText.includes("mongoose.model")) {
          const args = node.child(1);
          if (args && args.namedChildCount > 0) {
            const first = args.namedChild(0);
            if (first && first.type === "string") {
              const modelName = first.text.replace(/['"]/g, "");
              const modelId = nodeId(file, modelName, "Model");
              addUniqueNode(merged, {
                id: modelId,
                type: "Model",
                name: modelName,
                file: normalizedFile,
              });
              addUniqueEdge(merged, {
                from: normalizedFile,
                to: modelId,
                type: "defines_model",
              });
            }
          }
        } else if (
          calleeText &&
          (calleeText.includes("Sequelize") || calleeText.includes(".define"))
        ) {
          const args = node.child(1);
          if (args && args.namedChildCount > 0) {
            const first = args.namedChild(0);
            if (first && first.type === "string") {
              const modelName = first.text.replace(/['"]/g, "");
              const modelId = nodeId(file, modelName, "Model");
              addUniqueNode(merged, {
                id: modelId,
                type: "Model",
                name: modelName,
                file: normalizedFile,
              });
              addUniqueEdge(merged, {
                from: normalizedFile,
                to: modelId,
                type: "defines_model",
              });
            }
          }
        }
      }

      // assignment expressions like module.exports = { Foo }
      if (node.type === "assignment_expression") {
        const left = node.child(0);
        const right = node.child(2);
        if (left && left.text && left.text.startsWith("module.exports")) {
          const rightText = right && right.text;
          const regex = /([A-Za-z0-9_$]+)/g;
          let mm;
          while ((mm = regex.exec(rightText)) !== null) {
            const exported = mm[1];
            const exportId = nodeId(file, exported, "Export");
            addUniqueNode(merged, {
              id: exportId,
              type: "Export",
              name: exported,
              file: normalizedFile,
            });
            addUniqueEdge(merged, {
              from: normalizedFile,
              to: exportId,
              type: "exports",
            });
          }
        }
      }

      // Try to keep functionStack sane: when we see end of function-like node, pop.
      if (
        node.type === "function_declaration" ||
        node.type === "arrow_function" ||
        node.type === "function"
      ) {
        if (functionStack.length > 0) functionStack.pop();
      }
    }); // end walkTree
  } // end for each file

  // finalize: merged contains both phase1 items and code-level items
  // Clean up internal sets before writing
  delete merged._nodeSet;
  delete merged._edgeSet;

  return merged;
}

// === RUN ===
function run() {
  // load phase1 if exists
  let phase1 = readJSONSafe(PHASE1_FILE);
  if (!phase1) {
    console.log(
      "phase1-kg.json not found — running lightweight scan (phase1 fallback) ..."
    );
    phase1 = defaultPhase1Scan(ROOT_PATH);
    // write temporary phase1 for transparency
    try {
      writeJSON(PHASE1_FILE, phase1);
    } catch (e) {}
  } else {
    // ensure normalized paths in nodes
    phase1.nodes = phase1.nodes.map((n) => ({
      ...n,
      id: normalize(n.id),
      file: n.file ? normalize(n.file) : n.file,
    }));
    phase1.edges = phase1.edges.map((e) => ({
      ...e,
      from: normalize(e.from),
      to: normalize(e.to),
    }));
  }

  const mergedKG = extractCodeLevelKG(phase1);
  writeJSON(OUTPUT_FILE, mergedKG);
  console.log(`✅ Phase-2 KG generated: ${OUTPUT_FILE}`);
}

run();
