// backend/server.js
import express from "express";
import http from "http";
import WebSocket from "ws";
import chokidar from "chokidar";
import path from "path";
import fs from "fs";
import { createProjectFromJson } from "./fileManager.js";
import chunksRoute from "./routes/chunksRoute.js";
import vectorDBRoute from "./routes/vectorDBRoute.js";
import { driver } from "./db/neo4j.js";

const PROJECT_ROOT = path.join(process.cwd(), "projectStorage");
const app = express();

app.use(express.json());

// ✅ API: Create project from JSON
app.post("/load-json", (req, res) => {
  const { projectName, structure } = req.body;
  const projectPath = path.join(PROJECT_ROOT, projectName);
  createProjectFromJson(structure, projectPath);
  res.json({ success: true, projectPath });
});
app.use("/api/v1", chunksRoute);
app.use("/api/v1/vectorDB", vectorDBRoute);

// ✅ Start HTTP Server
const server = http.createServer(app);

// ✅ Correct way to create a WebSocket server
// const wss = new WebSocket.Server({
//   server: server, // Pass the HTTP server here
// });

// ✅ WebSocket Hub
// wss.on("connection", (ws) => {
//   console.log("Client connected");
//   ws.on("message", (data) => {
//     const msg = JSON.parse(data);

//     if (msg.type === "fileUpdate") {
//       const filePath = path.join(PROJECT_ROOT, msg.projectName, msg.path);
//       fs.writeFileSync(filePath, msg.content, "utf8");
//       console.log("File updated from client:", filePath);
//     }
//   });
// });

// ✅ Watch for file changes in code-server side
const watcher = chokidar.watch(PROJECT_ROOT, { ignoreInitial: true });

watcher.on("change", (filePath) => {
  console.log(`✅ File updated: ${filePath}`);
  const relativePath = filePath.split("projectStorage/")[1];
  const content = fs.readFileSync(filePath, "utf8");

  console.log("file watcing path", filePath);
  // wss.clients.forEach((client) => {
  //   if (client.readyState === WebSocket.OPEN) {
  //     client.send(
  //       JSON.stringify({
  //         type: "fileChanged",
  //         path: relativePath,
  //         content,
  //       })
  //     );
  //   }
  // });
});

const session = driver.session();

const neo4DBConnection = async () => {
  try {
    console.log("⚙️  Starting import to Neo4j...");

    // === 4. Create unique constraint ===
    await session.run(
      "CREATE CONSTRAINT IF NOT EXISTS FOR (n:Node) REQUIRE n.id IS UNIQUE"
    );

    const { nodes = [], relations = [] } = data;
    // === 5. Insert all nodes ===
    for (const node of nodes) {
      const { id, type, ...props } = node;
      await session.run(
        `MERGE (n:Node {id: $id})
         SET n.type = $type,
             n += $props`,
        { id, type, props }
      );
    }

    // === 6. Insert relationships ===
    for (const rel of relations) {
      const { from, to, type } = rel;
      await session.run(
        `MATCH (a:Node {id: $from}), (b:Node {id: $to})
         MERGE (a)-[r:${type}]->(b)`,
        { from, to }
      );
    }

    console.log("✅ Import complete!");
  } catch (err) {
    console.error("❌ Error importing:", err);
  } finally {
    await session.close();
    await driver.close();
  }
};

neo4DBConnection();
server.listen(4000, () => console.log("Backend running on port 4000"));
