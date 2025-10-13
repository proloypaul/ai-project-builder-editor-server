import express from "express";
import { userController } from "../controllers/user.controller.js";
const router = express.Router();

router.route("/login").post(userController.loginUser);
router.route("/logout").get(userController.logout);
router.route("/mail").post(userController.sendMail);

export default router;
