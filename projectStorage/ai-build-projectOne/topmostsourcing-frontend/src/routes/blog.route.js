import express from "express";
import { blogController } from "../controllers/blog.controller.js";
import { uploadOptions } from "../utils/multer.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router
  .route("/")
  .post(
    authenticate,
    uploadOptions.single("blogImage"),
    blogController.createBlog
  )
  .get(blogController.getAllBlog);

router
  .route("/:id")
  .get(blogController.getBlog)
  .put(
    authenticate,
    uploadOptions.single("blogImage"),
    blogController.updateBlog
  )
  .delete(authenticate, blogController.deleteBlog);

router
  .route("/upload")
  .post(
    authenticate,
    uploadOptions.single("descriptionImage"),
    blogController.uploadBlogImages
  );

router.route("/total/count").get(blogController.totalblogs);
router.route("/related/:id").get(blogController.getAllRelatedBlogs);

export default router;
