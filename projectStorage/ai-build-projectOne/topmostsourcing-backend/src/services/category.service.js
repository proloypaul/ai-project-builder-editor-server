import { BadRequest, NotFound } from "../errors/index.js";
import { Category } from "../models/category.js";

const createCategoryService = async (categoryData) => {
  const result = await Category.create(categoryData);
  if (!result) {
    throw new BadRequest(
      "Error occured creating category, retry using valid data"
    );
  }
  return result;
};

const getCategoryService = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new NotFound(`No category found with id ${id}`);
  }
  return category;
};

const getAllCategoryService = async (page = 1, limit = 0, query = "") => {
  const skip = (page - 1) * 10;
  let matchConditions = {};
  if (query) {
    matchConditions = { name: { $regex: query, $options: "i" } };
  }
  const categories = await Category.find(matchConditions)
    .skip(skip)
    .limit(limit);
  if (!categories) {
    return [];
  }
  return categories;
};

const updateCategoryService = async (categoryData, id) => {
  const updatedCategory = await Category.findByIdAndUpdate(id, categoryData, {
    new: true,
    runValidators: true,
  });
  if (!updatedCategory) {
    throw new BadRequest("Error updating category, retry using valid data");
  }
  return updatedCategory;
};

const deleteCategoryService = async (id) => {
  const result = await Category.findByIdAndDelete(id);
  if (!result) {
    throw new BadRequest(`No category found with id ${id}`);
  }
  return result;
};

const getCategoryCount = async () => {
  const count = await Category.countDocuments();
  return count;
};

export const categoryService = {
  createCategoryService,
  getAllCategoryService,
  getCategoryService,
  deleteCategoryService,
  updateCategoryService,
  getCategoryCount,
};
