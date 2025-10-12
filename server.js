// backend/server.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs");
const { createProjectFromJson } = require("./fileManager");

const app = express();
app.use(express.json());

const PROJECT_ROOT = path.join(__dirname, "projectStorage");

// ✅ API: Create project from JSON
app.post("/load-json", (req, res) => {
  const { projectName, structure } = req.body;
  const projectPath = path.join(PROJECT_ROOT, projectName);
  createProjectFromJson(structure, projectPath);
  res.json({ success: true, projectPath });
});

// ✅ Start HTTP + WS Server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// ✅ WebSocket Hub
wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (data) => {
    const msg = JSON.parse(data);

    if (msg.type === "fileUpdate") {
      const filePath = path.join(PROJECT_ROOT, msg.projectName, msg.path);
      fs.writeFileSync(filePath, msg.content, "utf8");
      console.log("File updated from client:", filePath);
    }
  });
});

// ✅ Watch for file changes in code-server side
const watcher = chokidar.watch(PROJECT_ROOT, { ignoreInitial: true });

watcher.on("change", (filePath) => {
  console.log(`✅ File updated: ${filePath}`);
  const relativePath = filePath.split("projectStorage/")[1];
  const content = fs.readFileSync(filePath, "utf8");

  //   console.log("chokider from server", content);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "fileChanged",
          path: relativePath,
          content,
        })
      );
    }
  });
});

server.listen(4000, () => console.log("Backend running on port 4000"));
