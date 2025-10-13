import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { productSubcategoryController } from "../controllers/product-subcategory.controller.js";

const router = express.Router();

router
  .route("/")
  .post(authenticate, productSubcategoryController.createProductSubcategory)
  .get(productSubcategoryController.getAllProductSubcategory);
router
  .route("/:id")
  .get(productSubcategoryController.getProductSubcategory)
  .put(authenticate, productSubcategoryController.updateProductSubcategory)
  .delete(authenticate, productSubcategoryController.deleteProductSubcategory);
router
  .route("/total/count")
  .get(productSubcategoryController.totalProductSubcategories);

export default router;
