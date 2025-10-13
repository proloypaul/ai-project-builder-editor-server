import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { productCategoryController } from "../controllers/product-category.controller.js";

const router = express.Router();

router
  .route("/")
  .post(authenticate, productCategoryController.createProductCategory)
  .get(productCategoryController.getAllProductCategory);
router
  .route("/:id")
  .get(productCategoryController.getProductCategory)
  .put(authenticate, productCategoryController.updateProductCategory)
  .delete(authenticate, productCategoryController.deleteProductCategory);
router
  .route("/total/count")
  .get(productCategoryController.totalProductCategories);

export default router;
