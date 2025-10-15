import express from "express";
import path from "path";
import { storeChunk } from "../services/storeChunks.js";
import generatedProjectChunks from "../data/generatedPojectChunks.json" assert { type: "json" };
import { searchChunks } from "../services/searchChunks.js";

const router = express.Router();

router.post("/storechunks", async (req, res) => {
  try {
    // const chunkData = req.body;
    let storeChunkNum = 0;

    for (const chunk of generatedProjectChunks) {
      storeChunkNum = storeChunkNum + 1;
      console.log("Chunk embedding and store Number", storeChunkNum);
      await storeChunk(chunk);
    }

    res.json({
      status: 200,
      message: "project chunks store Successfully",
    });
  } catch (error) {
    res.json({
      status: 500,
      message: "project chunks failed",
      error: error,
    });
  }
});
router.get("/searchChunks", async (req, res) => {
  try {
    const promptData = req.query;

    console.log("prompt data", promptData);

    const result = await searchChunks(promptData?.prompt);

    res.json({
      status: 200,
      message: "search result",
      QueryResult: result,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: "Failed to Query",
      error: error,
    });
  }
});

export default router;
