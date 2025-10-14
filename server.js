// backend/server.js
import express from "express";
import http from "http";
import WebSocket from "ws";
import chokidar from "chokidar";
import path from "path";
import fs from "fs";
import { createProjectFromJson } from "./fileManager.js";
import chunksRoute from "./routes/chunksRoute.js";

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

server.listen(4000, () => console.log("Backend running on port 4000"));
