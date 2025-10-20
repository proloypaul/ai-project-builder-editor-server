import cyperData from "../phase2-kg.json" assert { type: "json" };
import express from "express";
import { session } from "../server";

const router = express.Router();

router.get("/create", async (req, res) => {
  try {
    const nodes = cyperData?.nodes;
    const relations = cyperData?.edges;

    // === 5. Insert all nodes ===
    for (const node of nodes) {
      const { id, type, ...props } = node;
      await session.run(
        `MERGE (n:Node {id: $id})
         SET n.type = $type,
             n += $props`,
        { id, type, props }
      );
    }

    // === 6. Insert relationships ===
    for (const rel of relations) {
      const { from, to, type } = rel;
      await session.run(
        `MATCH (a:Node {id: $from}), (b:Node {id: $to})
         MERGE (a)-[r:${type}]->(b)`,
        { from, to }
      );
    }

    res.json({
      status: 200,
      message: "Knowledge graph Implemented successfully",
    });
  } catch (error) {
    console.log("falied to create kg");
    res.json({
      status: 500,
      message: "Failed to implement KG",
    });
  } finally {
    await session.close();
  }
});

export default router;
