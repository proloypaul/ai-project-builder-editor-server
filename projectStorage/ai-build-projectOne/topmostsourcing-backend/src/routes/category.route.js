import express from "express";
import { categoryController } from "../controllers/category.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router
  .route("/")
  .post(authenticate, categoryController.createCategory)
  .get(categoryController.getAllCategory);
router
  .route("/:id")
  .get(categoryController.getCategory)
  .put(authenticate, categoryController.updateCategory)
  .delete(authenticate, categoryController.deleteCategory);
router.route("/total/count").get(categoryController.totalCategories);

export default router;
