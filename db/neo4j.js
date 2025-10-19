import neo4j from "neo4j-driver";
import { neo4DB } from "../config.js";

export const driver = neo4j.driver(
  neo4DB.neo4Url,
  neo4j.auth.basic(neo4DB.neo4User, neo4DB.neo4Pass)
);
