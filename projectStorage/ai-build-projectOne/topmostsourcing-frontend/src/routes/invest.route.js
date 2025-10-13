import express from "express";
import { investController } from "../controllers/invest.controller.js";
const router = express.Router();

router.route("/").post(investController.createInvest);
router.route("/:id").patch(investController.updateInvest);
router.route("/investor/:investorId").get(investController.getAllInvest);
router.patch("/withdraw/investor/:investorId", investController.withdrawFunds);

export default router;
