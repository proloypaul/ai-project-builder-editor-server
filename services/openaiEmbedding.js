import { pipeline } from "@xenova/transformers";

// Create a feature-extraction pipeline (embedding)
const embedder = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2"
);

export async function generateEmbedding(text) {
  const result = await embedder(text); // Tensor with shape [1, 59, 384]

  // Convert the tensor to nested arrays
  let data = result.data;
  let dims = result.dims;

  // Reshape to [59, 384]
  const [batch, tokens, dimsSize] = dims;
  const tokenVectors = [];
  for (let i = 0; i < tokens; i++) {
    const start = i * dimsSize;
    const end = start + dimsSize;
    tokenVectors.push(Array.from(data.slice(start, end)));
  }

  // Average across tokens → 384 values
  const meanEmbedding = new Array(dimsSize).fill(0);
  tokenVectors.forEach((vec) => {
    vec.forEach((val, i) => {
      meanEmbedding[i] += val;
    });
  });
  for (let i = 0; i < meanEmbedding.length; i++) {
    meanEmbedding[i] /= tokenVectors.length;
  }

  return meanEmbedding;
}

// try gemini embedding model
// import { giminiAPiKey } from "../config.js";

// export async function generateEmbedding(text) {
//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1/models/embedding-001:embedText?key=${giminiAPiKey}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           text: text,
//         }),
//       }
//     );

//     const data = await response.json();

//     console.log("gemini model response", data);

//     if (data?.embedding?.values) {
//       return data.embedding.values;
//     } else {
//       console.error("Gemini Error:", data);
//     }
//   } catch (error) {
//     console.log("embedding model error", error);
//   }
// }

// open ai emmbedding model configuration

// import OpenAI from "openai";
// import { openaiAPiKey } from "../config.js";
// const openai = new OpenAI({
//   apiKey: openaiAPiKey,
// });

// export async function generateEmbedding(text) {
//   const response = await openai.embeddings.create({
//     model: "text-embedding-3-small",
//     input: text,
//   });
//   return response.data[0].embedding;
// }
