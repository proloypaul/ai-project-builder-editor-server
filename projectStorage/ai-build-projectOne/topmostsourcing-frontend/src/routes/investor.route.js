import express from "express";
import { investorController } from "../controllers/investor.controller.js";
const router = express.Router();

router.route("/").post(investorController.createInvestor);
router.post("/login", investorController.loginInvestor);
router.get("/get/:id", investorController.getInvestor);
export default router;
