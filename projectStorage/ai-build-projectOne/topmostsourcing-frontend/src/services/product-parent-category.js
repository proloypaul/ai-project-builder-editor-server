import { BadRequest, NotFound } from "../errors/index.js";
import { ProductParentCategory } from "../models/product-parent-category.js";

const createProductParentCategoryService = async (categoryData) => {
  const result = await ProductParentCategory.create(categoryData);
  if (!result) {
    throw new BadRequest(
      "Error occured creating parent category, retry using valid data"
    );
  }
  return result;
};

const getProductParentCategoryService = async (id) => {
  const category = await ProductParentCategory.findById(id);
  if (!category) {
    throw new NotFound(`No parent category found with id ${id}`);
  }
  return category;
};

const getAllProductParentCategoryService = async (
  page = 1,
  limit = 0,
  query = "",
  skipValue = 10
) => {
  const skip = (page - 1) * skipValue;
  let matchConditions = {};
  if (query) {
    matchConditions = { name: { $regex: query, $options: "i" } };
  }
  const categories = await ProductParentCategory.find(matchConditions)
    .skip(skip)
    .limit(limit);
  if (!categories) {
    return [];
  }
  return categories;
};

const updateProductParentCategoryService = async (categoryData, id) => {
  const updatedCategory = await ProductParentCategory.findByIdAndUpdate(
    id,
    categoryData,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedCategory) {
    throw new BadRequest(
      "Error updating parent category, retry using valid data"
    );
  }
  return updatedCategory;
};

const deleteProductParentCategoryService = async (id) => {
  const result = await ProductParentCategory.findByIdAndDelete(id);
  if (!result) {
    throw new BadRequest(`No category found with id ${id}`);
  }
  return result;
};

const getProductParentCategoryCountService = async () => {
  const count = await ProductParentCategory.countDocuments();
  return count;
};

export const productParentCategoryService = {
  createProductParentCategoryService,
  getAllProductParentCategoryService,
  getProductParentCategoryService,
  deleteProductParentCategoryService,
  updateProductParentCategoryService,
  getProductParentCategoryCountService,
};
