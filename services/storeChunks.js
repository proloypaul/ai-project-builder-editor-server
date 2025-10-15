import { pinecone } from "../db/pinecone.js";
import { generateEmbedding } from "./openaiEmbedding.js";

export async function storeChunk(chunk) {
  const index = pinecone.Index("ai-generated-projectchunks");

  // 1. Create text for embedding
  //   const text = `
  // Type: ${chunk.type}
  // File: ${chunk.folderName}/${chunk.fileName}
  // Functions: ${chunk.includingFunctions?.join(", ")}
  // Classes: ${chunk.includingClasses?.join(", ")}
  // Code: ${chunk.actualCode}
  // `;

  let text = `Type: ${chunk.type}\nFolder: ${chunk.folderName}\nFile: ${chunk.folderName}/${chunk.fileName}\n`;

  if (chunk.type === "function") {
    text += `
    Function Name: ${chunk.functionName}
    Class Name: ${chunk.className}
    Parent Class: ${chunk.parentClassName}
    Dependencies: ${JSON.stringify(chunk.upstreamDependencies)}
    Global Variables: ${chunk.globalVariables?.join(", ")}
    Code: ${chunk.actualCode}
    `;
  }

  if (chunk.type === "imports") {
    text += `
    Imported Classes: ${(chunk.includingClasses || []).join(", ")}
    Imported Functions: ${(chunk.includingFunctions || []).join(", ")}
    Code: ${chunk.actualCode}
    `;
  }

  if (chunk.type === "globals") {
    text += `
    Variables: ${(chunk.variables || []).join(", ")}
    Code: ${chunk.actualCode}
    `;
  }

  //   2. Get vector
  const vector = await generateEmbedding(text.trim());
  console.log("Vector length:", vector.length, vector);

  // 3. Upsert to Pinecone
  const result = await index.upsert([
    {
      id: `${chunk.folderName}-${chunk.fileName}-${chunk.type}-${Date.now()}`,
      values: vector,
      metadata: chunk,
    },
  ]);
}
