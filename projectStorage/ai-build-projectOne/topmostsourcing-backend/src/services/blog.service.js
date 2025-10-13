import { unlink } from "fs";
import path from "path";
import { BadRequest, NotFound } from "../errors/index.js";
import { Blog } from "../models/blog.js";

const createBlogService = async (blogData) => {
  const result = await Blog.create(blogData);
  if (!result) {
    throw new BadRequest("Error occured creating blog, retry using valid data");
  }
  return result;
};

const getBlogService = async (id) => {
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new NotFound(`No blog found with id ${id}`);
  }
  return blog;
};

const getAllBlogService = async ({
  page = 1,
  limit = 10,
  query = "",
  category = null,
}) => {
  const skip = (page - 1) * limit;
  let matchConditions = {};

  if (query) {
    matchConditions.title = { $regex: query, $options: "i" };
  }
  if (category) {
    matchConditions.category = { $regex: category, $options: "i" };
  }
  const blogs = await Blog.find(matchConditions)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalCount = await Blog.countDocuments(matchConditions);
  const totalPages = Math.ceil(totalCount / limit);

  if (!blogs) {
    return [];
  }

  return {
    blogs,
    pagination: {
      totalPages,
      page,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const getAllRelatedlogService = async ({
  page = 1,
  limit = 0,
  skipValue = 3,
  query = "",
  category = null,
  id = null,
}) => {
  const skip = (page - 1) * skipValue;
  let matchConditions = {};
  if (query) {
    matchConditions.title = { $regex: query, $options: "i" };
  }
  if (category) {
    matchConditions.category = { $regex: category, $options: "i" };
  }
  if (id) {
    matchConditions._id = { $ne: id };
  }
  const blogs = await Blog.find(matchConditions)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  if (!blogs) {
    return [];
  }
  return blogs;
};

const updateBlogService = async (blogData, id) => {
  const oldBlog = await Blog.findById(id);
  if (!oldBlog) {
    throw new NotFound(`No blog found with id ${id}`);
  }
  if (blogData.imageUrl) {
    try {
      const imagePath = path.join(process.cwd(), "uploads", oldBlog.imageUrl);
      unlink(imagePath, (err) => {
        if (err) {
          console.log(err.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  const updatedBlog = await Blog.findByIdAndUpdate(id, blogData, {
    new: true,
    runValidators: true,
  });
  if (!updatedBlog) {
    throw new BadRequest("Error updating blog, retry using valid data");
  }
  return updatedBlog;
};

const deleteBlogService = async (id) => {
  const oldBlog = await Blog.findById(id);
  if (!oldBlog) {
    throw new NotFound(`No blog found with id ${id}`);
  }
  try {
    const imagePath = path.join(process.cwd(), "uploads", oldBlog.imageUrl);
    unlink(imagePath, (err) => {
      if (err) {
        console.log("No Image found in storage");
      }
    });
  } catch (error) {
    console.log(error);
  }

  const result = await Blog.findByIdAndDelete(id);
  if (!result) {
    throw new BadRequest(`No blog found with id ${id}`);
  }
  return result;
};

const getBlogsCount = async () => {
  const count = await Blog.countDocuments();
  return count;
};

export const blogService = {
  createBlogService,
  getAllBlogService,
  getBlogService,
  deleteBlogService,
  updateBlogService,
  getBlogsCount,
  getAllRelatedlogService,
};
