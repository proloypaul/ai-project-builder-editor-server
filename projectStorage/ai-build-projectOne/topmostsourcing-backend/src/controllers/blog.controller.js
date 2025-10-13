import { BadRequest } from "../errors/index.js";
import { blogService } from "../services/blog.service.js";

const createBlog = async (req, res) => {
  const blogData = req.body;
  if (!blogData) {
    throw new BadRequest("Blog data not found");
  }
  if (req.file) {
    const blogImage = req.file;
    blogData.imageUrl = blogImage.filename;
  }
  const result = await blogService.createBlogService(blogData);
  return res.status(201).json({ blog: result });
};

const updateBlog = async (req, res) => {
  const blogData = req.body;
  const { id } = req.params;
  if (!blogData || !id) {
    throw new BadRequest("Blog data not found");
  }
  if (req.file) {
    const blogImage = req.file;
    blogData.imageUrl = blogImage.filename;
  }
  const result = await blogService.updateBlogService(blogData, id);
  return res.status(200).json({ blog: result });
};

const getAllBlog = async (req, res) => {
  const { page, limit, query, category, skipValue } = req.query;
  const blogs = await blogService.getAllBlogService({
    page,
    limit,
    skipValue,
    query,
    category,
  });

  return res.status(200).json(blogs);
};

const getBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await blogService.getBlogService(id);
  return res.status(200).json(blog);
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  await blogService.deleteBlogService(id);
  return res.status(200).json({ message: "Blog deleted" });
};

const uploadBlogImages = async (req, res) => {
  if (!req.file) {
    throw new BadRequest("Image not found");
  }
  const imageUrl = req.file.filename;
  return res.status(200).json({ imageUrl });
};

const totalblogs = async (req, res) => {
  const count = await blogService.getBlogsCount();
  return res.status(200).json({ count });
};

const getAllRelatedBlogs = async (req, res) => {
  const { page, limit, query, category, skipValue } = req.query;
  const { id } = req.params;
  const blogs = await blogService.getAllRelatedlogService({
    page,
    limit,
    skipValue,
    query,
    category,
    id,
  });
  return res.status(200).json({ blogs });
};

export const blogController = {
  createBlog,
  deleteBlog,
  getAllBlog,
  updateBlog,
  getBlog,
  uploadBlogImages,
  totalblogs,
  getAllRelatedBlogs,
};
