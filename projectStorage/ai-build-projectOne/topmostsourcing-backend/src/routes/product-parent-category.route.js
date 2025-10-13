import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { productParentCategoryController } from "../controllers/product-parent-category.controller.js";

const router = express.Router();

router
  .route("/")
  .post(
    authenticate,
    productParentCategoryController.createProductParentCategory
  )
  .get(productParentCategoryController.getAllProductParentCategory);
router
  .route("/:id")
  .get(productParentCategoryController.getProductParentCategory)
  .put(
    authenticate,
    productParentCategoryController.updateProductParentCategory
  )
  .delete(
    authenticate,
    productParentCategoryController.deleteProductParentCategory
  );
router
  .route("/total/count")
  .get(productParentCategoryController.totalProductParentCategories);

export default router;
