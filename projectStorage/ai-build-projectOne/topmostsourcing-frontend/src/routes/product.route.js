import express from "express";
import { productController } from "../controllers/product.controller.js";
import { uploadOptions } from "../utils/multer.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router
  .route("/")
  .post(
    authenticate,
    uploadOptions.fields([
      { name: "primaryImage", maxCount: 1 },
      { name: "secondaryImages" },
    ]),
    productController.createProduct
  )
  .get(productController.getAllProduct);
router
  .route("/:id")
  .get(productController.getProduct)
  .put(
    authenticate,
    uploadOptions.fields([
      { name: "primaryImage", maxCount: 1 },
      { name: "secondaryImages" },
    ]),
    productController.updateProduct
  )
  .delete(authenticate, productController.deleteProduct);

router.route("/total/count").get(productController.totalProducts);
router.route("/related/:id").get(productController.getAllProductExceptOne);
router
  .route("/secondaryImage/:id")
  .put(productController.updateSecondaryImages);

router.post(
  "/rfq",
  uploadOptions.fields([{ name: "uploadedFiles" }]),
  productController.requestQuotation
);

export default router;
