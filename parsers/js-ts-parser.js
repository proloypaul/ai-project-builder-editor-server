// parsers/js-ts-parser.js
import fs from "fs";
import path from "path";
import Parser from "tree-sitter";
import JavaScript from "tree-sitter-javascript";
// import { typescript } from "tree-sitter-typescript";

import pkg from "tree-sitter-typescript";
const { typescript, tsx } = pkg;

const readUtf8 = (p) => fs.readFileSync(p, "utf8");

const JS_PARSER = new Parser();
JS_PARSER.setLanguage(JavaScript);

const TS_PARSER = new Parser();
TS_PARSER.setLanguage(typescript);

function nodeText(code, node) {
  if (!node) return "";
  return code.slice(node.startIndex, node.endIndex);
}

function safeChildren(node) {
  return node && node.namedChildren ? node.namedChildren : [];
}

function isLocalImport(source) {
  return (
    typeof source === "string" &&
    (source.startsWith(".") || source.startsWith("/"))
  );
}

function resolveLocalImport(importSource, filePath, projectRoot) {
  if (!isLocalImport(importSource)) return null;
  const absBase = path.resolve(path.dirname(filePath), importSource);
  const candidates = [
    absBase,
    `${absBase}.js`,
    `${absBase}.jsx`,
    `${absBase}.ts`,
    `${absBase}.tsx`,
    path.join(absBase, "index.js"),
    path.join(absBase, "index.ts"),
    path.join(absBase, "index.tsx"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c))
      return path.relative(projectRoot, c).replace(/\\/g, "/");
  }
  return null;
}

/** PASS 1: collect exports */
export function parseJSForExports(
  filePath,
  projectRoot,
  resolveTSAlias = () => null
) {
  const ext = path.extname(filePath).toLowerCase();
  const code = readUtf8(filePath);
  const parser = ext === ".ts" || ext === ".tsx" ? TS_PARSER : JS_PARSER;
  const tree = parser.parse(code);
  const rel = path.relative(projectRoot, filePath).replace(/\\/g, "/");

  const collected = [];

  function visit(node) {
    if (!node) return;
    // export* patterns
    if (
      node.type &&
      (node.type.startsWith("export") ||
        node.type === "export_statement" ||
        node.type === "export_declaration")
    ) {
      for (const ch of safeChildren(node)) {
        if (!ch) continue;
        if (
          ch.type === "function_declaration" ||
          ch.type === "class_declaration"
        ) {
          const nameNode = ch.childForFieldName && ch.childForFieldName("name");
          if (nameNode && nameNode.text)
            collected.push({ name: nameNode.text, fileRel: rel });
          else collected.push({ name: "default", fileRel: rel });
        } else if (ch.type === "variable_declaration") {
          for (const vd of safeChildren(ch)) {
            const id =
              vd.childForFieldName &&
              (vd.childForFieldName("name") || vd.firstNamedChild);
            if (id && id.text) collected.push({ name: id.text, fileRel: rel });
          }
        } else if (
          [
            "export_clause",
            "named_exports",
            "export_specifier",
            "identifier",
          ].includes(ch.type)
        ) {
          for (const spec of safeChildren(ch)) {
            const id =
              spec.childForFieldName &&
              (spec.childForFieldName("name") ||
                spec.childForFieldName("alias"));
            if (id && id.text) collected.push({ name: id.text, fileRel: rel });
            else if (spec.text)
              collected.push({ name: spec.text, fileRel: rel });
          }
        } else {
          // fallback regex for "export default X"
          const txt = nodeText(code, node);
          const m = txt.match(/export\s+default\s+([A-Za-z0-9_$]+)/);
          if (m) collected.push({ name: m[1], fileRel: rel });
        }
      }
    }

    // CommonJS exports
    if (
      node.type === "expression_statement" ||
      node.type === "assignment_expression"
    ) {
      const txt = nodeText(code, node);
      const m = txt.match(/module\.exports\s*=\s*{\s*([^}]*)}/);
      if (m) {
        const body = m[1];
        body.split(",").forEach((pair) => {
          const key = pair.split(":")[0].trim().replace(/['"]/g, "");
          if (key) collected.push({ name: key, fileRel: rel });
        });
      }
      const m2 = txt.match(/module\.exports\.([A-Za-z0-9_$]+)\s*=/);
      if (m2) collected.push({ name: m2[1], fileRel: rel });
      const m3 = txt.match(/exports\.([A-Za-z0-9_$]+)\s*=/);
      if (m3) collected.push({ name: m3[1], fileRel: rel });
    }

    for (const ch of safeChildren(node)) visit(ch);
  }

  try {
    visit(tree.rootNode);
  } catch (e) {
    console.warn(`parseJSForExports warning ${filePath}: ${e.message}`);
  }
  return collected;
}

/** PASS 2: full parse -> returns chunks */
export function parseJSWithIndex(
  filePath,
  projectRoot,
  fileIndex = {},
  resolveTSAlias = () => null,
  exportsIndex = {}
) {
  const ext = path.extname(filePath).toLowerCase();
  const code = readUtf8(filePath);
  const parser = ext === ".ts" || ext === ".tsx" ? TS_PARSER : JS_PARSER;
  const tree = parser.parse(code);
  const root = tree.rootNode;
  const fileName = path.basename(filePath);
  const folderName =
    path.relative(projectRoot, path.dirname(filePath)).replace(/\\/g, "/") ||
    ".";

  const importSpecifiers = [];
  const topLevelGlobals = [];
  const functions = [];
  const classes = [];

  function visit(node) {
    if (!node) return;

    if (node.type === "import_statement") {
      let sourceText = "";
      try {
        const srcNode =
          node.childForFieldName && node.childForFieldName("source");
        sourceText = nodeText(code, srcNode).replace(/['"]/g, "");
      } catch (_) {
        sourceText = "";
      }
      const sourceResolved =
        resolveTSAlias(sourceText) ||
        resolveLocalImport(sourceText, filePath, projectRoot) ||
        sourceText;
      const specs = [];
      for (const ch of safeChildren(node)) {
        if (!ch) continue;
        if (
          [
            "import_clause",
            "named_imports",
            "namespace_import",
            "import_specifier",
          ].includes(ch.type)
        ) {
          for (const sp of safeChildren(ch)) {
            if (!sp) continue;
            if (sp.type === "import_specifier" || sp.type === "identifier") {
              const imported =
                sp.childForFieldName &&
                (sp.childForFieldName("name") || sp.firstNamedChild)
                  ? sp.childForFieldName("name")?.text ||
                    sp.firstNamedChild?.text
                  : sp.text;
              const local =
                sp.childForFieldName && sp.childForFieldName("alias")
                  ? sp.childForFieldName("alias").text
                  : imported || sp.text;
              if (local)
                specs.push({
                  importedName: imported || local,
                  localName: local,
                });
            }
          }
        }
      }
      if (specs.length === 0) {
        for (const d of safeChildren(node))
          if (d.type === "identifier")
            specs.push({ importedName: d.text, localName: d.text });
      }
      specs.forEach((s) =>
        importSpecifiers.push({
          localName: s.localName,
          importedName: s.importedName,
          source: sourceText,
          sourceResolved,
        })
      );
    }

    // require(...)
    if (
      node.type === "variable_declarator" &&
      node.namedChildren &&
      node.namedChildren.length >= 2
    ) {
      const id = node.namedChildren[0];
      const init = node.namedChildren[1];
      if (
        init &&
        init.type === "call_expression" &&
        init.firstChild &&
        init.firstChild.type === "identifier" &&
        init.firstChild.text === "require"
      ) {
        const arg = init.namedChildren[0];
        if (arg && arg.type === "string") {
          const sourceText = arg.text.replace(/['"]/g, "");
          const sourceResolved =
            resolveTSAlias(sourceText) ||
            resolveLocalImport(sourceText, filePath, projectRoot) ||
            sourceText;
          importSpecifiers.push({
            localName: id && id.text ? id.text : "*",
            importedName: "*",
            source: sourceText,
            sourceResolved,
          });
        }
      }
    }

    // top-level globals
    if (
      node.type === "variable_declaration" &&
      node.parent &&
      node.parent.type === "program"
    ) {
      for (const decl of safeChildren(node)) {
        const nameNode =
          decl.childForFieldName &&
          (decl.childForFieldName("name") || decl.firstNamedChild);
        if (nameNode && nameNode.text) topLevelGlobals.push(nameNode.text);
      }
    }

    // functions
    if (node.type === "function_declaration")
      functions.push({ node, kind: "function_declaration" });
    if (
      node.type === "variable_declarator" &&
      node.namedChildren &&
      node.namedChildren.length >= 2
    ) {
      const id = node.namedChildren[0];
      const init = node.namedChildren[1];
      if (init && (init.type === "arrow_function" || init.type === "function"))
        functions.push({ node: init, nameNode: id, kind: "variable_function" });
    }

    // classes
    if (node.type === "class_declaration") classes.push(node);

    for (const ch of safeChildren(node)) visit(ch);
  }

  try {
    visit(root);
  } catch (e) {
    console.warn(
      `parseJSWithIndex traversal warning (${filePath}): ${e.message}`
    );
  }

  const importsChunk = {
    type: "imports",
    fileName,
    folderName,
    includingClasses: classes
      .map((c) => {
        const n = c.childForFieldName && c.childForFieldName("name");
        return n && n.text ? n.text : null;
      })
      .filter(Boolean),
    includingFunctions: functions
      .map((f) => {
        if (f.kind === "function_declaration") {
          const n =
            f.node.childForFieldName && f.node.childForFieldName("name");
          return n && n.text ? n.text : null;
        } else return f.nameNode && f.nameNode.text ? f.nameNode.text : null;
      })
      .filter(Boolean),
    actualCode: importSpecifiers
      .map(
        (s) =>
          `${s.localName} <- ${s.source} (${s.sourceResolved || "external"})`
      )
      .join("\n"),
  };

  const globalsChunk = {
    type: "globals",
    fileName,
    folderName,
    variables: Array.from(new Set(topLevelGlobals)),
    actualCode: topLevelGlobals.map((v) => `var ${v}`).join("\n"),
  };

  function tokensFrom(src) {
    if (!src) return [];
    return src.split(/\W+/).filter(Boolean);
  }

  function mapTokenToExportFiles(token) {
    if (!token) return [];
    const mapped =
      exportsIndex && Object.prototype.hasOwnProperty.call(exportsIndex, token)
        ? exportsIndex[token]
        : [];
    // Defensive: ensure array
    if (!mapped) return [];
    if (Array.isArray(mapped)) return mapped;
    // if it's a string or single value, wrap it
    return [mapped];
  }

  const functionChunks = [];

  for (const f of functions) {
    let fname = "anonymous",
      funcCode = "";
    try {
      if (f.kind === "function_declaration") {
        const nameNode =
          f.node.childForFieldName && f.node.childForFieldName("name");
        fname = nameNode && nameNode.text ? nameNode.text : "anonymous";
        funcCode = nodeText(code, f.node);
      } else {
        fname = f.nameNode && f.nameNode.text ? f.nameNode.text : "anonymous";
        funcCode = nodeText(code, f.node);
      }
    } catch (e) {
      funcCode = "";
    }

    const tokens = new Set(tokensFrom(funcCode));
    const usedImports = [];
    const usedCrossFiles = [];

    for (const imp of importSpecifiers) {
      if (imp.localName && tokens.has(imp.localName)) {
        usedImports.push(imp.source);
        if (
          imp.sourceResolved &&
          (imp.sourceResolved.includes("/") ||
            imp.sourceResolved.endsWith(".js") ||
            imp.sourceResolved.endsWith(".ts"))
        )
          usedCrossFiles.push(imp.sourceResolved);
      }
    }

    // map tokens to exports (defensive)
    for (const t of tokens) {
      const mapped = mapTokenToExportFiles(t);
      if (mapped && mapped.length) {
        // mapped is guaranteed to be an array now
        mapped.forEach((mf) => {
          if (!usedCrossFiles.includes(mf)) usedCrossFiles.push(mf);
        });
      }
    }

    const usedGlobals = topLevelGlobals.filter((g) => tokens.has(g));

    functionChunks.push({
      type: "function",
      functionName: fname,
      className: null,
      parentClassName: null,
      fileName,
      folderName,
      upstreamDependencies: {
        imports: Array.from(new Set(usedImports)),
        crossFileImports: Array.from(new Set(usedCrossFiles)),
      },
      globalVariables: usedGlobals,
      actualCode: funcCode,
    });
  }

  // class methods
  for (const c of classes) {
    const classNameNode = c.childForFieldName && c.childForFieldName("name");
    const className =
      classNameNode && classNameNode.text
        ? classNameNode.text
        : "AnonymousClass";
    const parentNode = c.childForFieldName && c.childForFieldName("superclass");
    const parentClassName = parentNode ? nodeText(code, parentNode) : null;

    if (!importsChunk.includingClasses.includes(className))
      importsChunk.includingClasses.push(className);

    for (const ch of safeChildren(c)) {
      if (!ch) continue;
      if (ch.type === "class_body") {
        for (const method of safeChildren(ch)) {
          if (!method) continue;
          if (method.type === "method_definition") {
            const nameNode =
              method.childForFieldName &&
              (method.childForFieldName("name") || method.firstNamedChild);
            const mname =
              nameNode && nameNode.text ? nameNode.text : "anonymous";
            const mcode = nodeText(code, method);
            const tokens = new Set(tokensFrom(mcode));
            const usedImports = [];
            const usedCrossFiles = [];
            for (const imp of importSpecifiers) {
              if (imp.localName && tokens.has(imp.localName)) {
                usedImports.push(imp.source);
                if (imp.sourceResolved) usedCrossFiles.push(imp.sourceResolved);
              }
            }
            for (const t of tokens) {
              const mapped = mapTokenToExportFiles(t);
              if (mapped && mapped.length)
                mapped.forEach((mf) => {
                  if (!usedCrossFiles.includes(mf)) usedCrossFiles.push(mf);
                });
            }
            const usedGlobals = topLevelGlobals.filter((g) => tokens.has(g));
            functionChunks.push({
              type: "function",
              functionName: `${className}.${mname}`,
              className,
              parentClassName,
              fileName,
              folderName,
              upstreamDependencies: {
                imports: Array.from(new Set(usedImports)),
                crossFileImports: Array.from(new Set(usedCrossFiles)),
              },
              globalVariables: usedGlobals,
              actualCode: mcode,
            });
          }
        }
      }
    }
  }

  return [importsChunk, globalsChunk, ...functionChunks];
}
