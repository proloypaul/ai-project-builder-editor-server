import dotenv from "dotenv";

dotenv.config();

export const pinconeApiKey = process.env.PINCONE_APIKEY;
export const openaiAPiKey = process.env.OPENAIKEY;
export const giminiAPiKey = process.env.GIMINI_APIKEY;
export const neo4DB = {
  neo4Url: process.env.NEO4j_URI,
  neo4User: process.env.NEO4j_USER,
  neo4Pass: process.env.NEO4j_PASS,
};
