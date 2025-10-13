import { BadRequest, NotFound } from "../errors/index.js";
import { ProductCategory } from "../models/product-category.js";

const createProductCategoryService = async (categoryData) => {
  const result = await ProductCategory.create(categoryData);
  if (!result) {
    throw new BadRequest(
      "Error occured creating category, retry using valid data"
    );
  }
  return result;
};

const getProductCategoryService = async (id) => {
  const category = await ProductCategory.findById(id);
  if (!category) {
    throw new NotFound(`No category found with id ${id}`);
  }
  return category;
};

const getAllProductCategoryService = async (
  page = 1,
  limit = 0,
  query = "",
  skipValue = 10,
  parent = ""
) => {
  const skip = (page - 1) * skipValue;
  let matchConditions = {};
  if (query) {
    matchConditions = { name: { $regex: query, $options: "i" } };
  }
  if (parent) {
    matchConditions = { parentCategory: parent };
  }
  const categories = await ProductCategory.find(matchConditions)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  if (!categories) {
    return [];
  }
  return categories;
};

const updateProductCategoryService = async (categoryData, id) => {
  const updatedCategory = await ProductCategory.findByIdAndUpdate(
    id,
    categoryData,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedCategory) {
    throw new BadRequest("Error updating category, retry using valid data");
  }
  return updatedCategory;
};

const deleteProductCategoryService = async (id) => {
  const result = await ProductCategory.findByIdAndDelete(id);
  if (!result) {
    throw new BadRequest(`No category found with id ${id}`);
  }
  return result;
};

const getProductCategoryCountService = async () => {
  const count = await ProductCategory.countDocuments();
  return count;
};

export const productCategoryService = {
  createProductCategoryService,
  getAllProductCategoryService,
  getProductCategoryService,
  deleteProductCategoryService,
  updateProductCategoryService,
  getProductCategoryCountService,
};
