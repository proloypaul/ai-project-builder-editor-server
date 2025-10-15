import { Pinecone } from "@pinecone-database/pinecone";
import { pinconeApiKey } from "../config.js";

export const pinecone = new Pinecone({
  apiKey: pinconeApiKey,
});
