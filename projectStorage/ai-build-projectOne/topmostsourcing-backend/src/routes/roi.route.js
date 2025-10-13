import express from "express";
import { roiController } from "../controllers/roi.controller.js";

const router = express.Router();

router.post("/", roiController.createRoi);
router.put("/:id", roiController.updateRoi);
router.get("/", roiController.getAllRoi);

export default router;
