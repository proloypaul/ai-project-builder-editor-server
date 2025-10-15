import { pinecone } from "../db/pinecone.js";
import { generateEmbedding } from "./openaiEmbedding.js";

export async function searchChunks(queryText) {
  const index = pinecone.Index("project-chunks");

  const queryEmbedding = await generateEmbedding(queryText);

  const result = await index.query({
    topK: 5,
    vector: queryEmbedding,
    includeMetadata: true,
  });

  console.log("🔍 Search results:", result);
  return result;
}
