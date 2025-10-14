import fs from "fs";
import path from "path";
import {
  parseJSForExports,
  parseJSWithIndex,
} from "../parsers/js-ts-parser.js";
// import { parseJSForExports, parseJSWithIndex } from "../parsers/js-parser.js";
// import { parsePython } from "../parsers/python-parser.js";
// import { parseJava } from "../parsers/java-parser.js";

const SUPPORTED = {
  ".js": "js",
  ".jsx": "js",
  ".ts": "ts",
  ".tsx": "ts",
  ".py": "python",
  ".java": "java",
};

function walkDirectory(baseDir, out = []) {
  const items = fs.readdirSync(baseDir);
  for (const it of items) {
    const full = path.join(baseDir, it);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkDirectory(full, out);
    } else if (stat.isFile()) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Read tsconfig.json (if present) and extract baseUrl + paths mapping to resolve TS aliases.
 * Returns function resolveAlias(moduleName) -> projectRelativePath or null
 */
function buildTSPathResolver(projectRoot) {
  const cfgPath = path.join(projectRoot, "tsconfig.json");
  if (!fs.existsSync(cfgPath)) return () => null;

  try {
    const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
    const compilerOptions = cfg.compilerOptions || {};
    const baseUrl = compilerOptions.baseUrl
      ? path.resolve(projectRoot, compilerOptions.baseUrl)
      : null;
    const paths = compilerOptions.paths || {};
    // Convert TS paths to regex candidates
    const pathEntries = Object.entries(paths).map(([aliasPattern, targets]) => {
      // aliasPattern like "@app/*" -> regex ^@app/(.*)$
      const wild = aliasPattern.includes("*");
      const regex = new RegExp("^" + aliasPattern.replace(/\*/g, "(.*)") + "$");
      return { aliasPattern, regex, targets };
    });

    return function resolveAlias(importName) {
      for (const entry of pathEntries) {
        const m = importName.match(entry.regex);
        if (m) {
          // Replace wildcard in targets with captured groups
          for (const t of entry.targets) {
            const replaced = t.replace(/\*/g, () => m[1] || "");
            const abs = baseUrl
              ? path.resolve(baseUrl, replaced)
              : path.resolve(projectRoot, replaced);
            // try candidate extensions
            const candidates = [
              abs,
              abs + ".ts",
              abs + ".tsx",
              abs + ".js",
              abs + ".jsx",
              path.join(abs, "index.ts"),
              path.join(abs, "index.tsx"),
              path.join(abs, "index.js"),
            ];
            for (const c of candidates) {
              if (fs.existsSync(c)) {
                return path.relative(projectRoot, c);
              }
            }
          }
        }
      }
      return null;
    };
  } catch (e) {
    console.warn("tsconfig.json parsing failed:", e.message);
    return () => null;
  }
}

async function generateProjectChunks(projectPath) {
  // gather files
  const allFiles = walkDirectory(projectPath).filter(
    (f) => SUPPORTED[path.extname(f).toLowerCase()]
  );

  if (allFiles.length === 0) {
    console.warn("NO SUPPORTED FILES FOUND in this path!");
  }
  // Build fileIndex: rel -> abs
  const fileIndex = {};
  for (const f of allFiles) {
    const rel = path.relative(projectPath, f).replace(/\\/g, "/");
    fileIndex[rel] = f;
  }

  // Build TS alias resolver (best-effort)
  const resolveTSAlias = buildTSPathResolver(projectPath);

  // === PASS 1: build exports index (symbol -> fileRel) for JS/TS (and simple Python/Java export detection could be added) ===
  const exportsIndex = {}; // symbolName -> Set of fileRel
  for (const f of allFiles) {
    const ext = path.extname(f).toLowerCase();
    if (ext === ".js" || ext === ".jsx" || ext === ".ts" || ext === ".tsx") {
      try {
        const exports = parseJSForExports(f, projectPath, resolveTSAlias);
        // exports: array of { name, fileRel }
        for (const ex of exports) {
          if (!exportsIndex[ex.name]) exportsIndex[ex.name] = new Set();
          exportsIndex[ex.name].add(ex.fileRel);
        }
      } catch (e) {
        console.warn("export parse error", f, e.message);
      }
    }
    // TODO: can extend to python / java exports later
  }

  // convert sets to arrays for easier use
  const exportsIndexMap = {};
  for (const [k, setv] of Object.entries(exportsIndex)) {
    exportsIndexMap[k] = Array.from(setv);
  }

  // === PASS 2: parse files and resolve cross-file imports/uses using exportsIndex and ts alias resolver ===
  const allChunks = [];
  for (const f of allFiles) {
    const ext = path.extname(f).toLowerCase();
    const lang = SUPPORTED[ext];
    try {
      if (lang === "js" || lang === "ts") {
        const chunks = await parseJSWithIndex(
          f,
          projectPath,
          fileIndex,
          resolveTSAlias,
          exportsIndexMap
        );
        allChunks.push(...chunks);
      } else if (lang === "python") {
        // const chunks = await parsePython(f, projectPath, fileIndex); // python parser can be improved similarly
        // allChunks.push(...chunks);
      } else if (lang === "java") {
        // const chunks = await parseJava(f, projectPath, fileIndex);
        // allChunks.push(...chunks);
      }
    } catch (e) {
      console.error("parse error for file", f, e);
    }
  }

  return allChunks;
}

export { generateProjectChunks };
