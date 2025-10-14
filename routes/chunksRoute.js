import express from "express";
import path from "path";
import { generateProjectChunks } from "../services/chunkGenerator.js";

import fs from "fs";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const router = express.Router();

router.get("/:projectName", async (req, res) => {
  const { projectName } = req.params;

  const projectPath = path
    .join(__dirname, "..", "projectStorage", projectName)
    .slice(1);

  console.log("project path", projectPath, typeof projectPath);

  if (!fs.existsSync(projectPath)) {
    return res.status(404).json({ error: "Project not found" });
  }

  const chunks = await generateProjectChunks(projectPath);

  res.json(chunks);
});

export default router;
