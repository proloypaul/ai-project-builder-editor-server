import { BadRequest, NotFound } from "../errors/index.js";
import { ProductSubcategory } from "../models/product-subcategory.js";

const createProductSubcategoryService = async (categoryData) => {
  const result = await ProductSubcategory.create(categoryData);
  if (!result) {
    throw new BadRequest(
      "Error occured creating subcategory, retry using valid data"
    );
  }
  return result;
};

const getProductSubcategoryService = async (id) => {
  const subcategory = await ProductSubcategory.findById(id);
  if (!subcategory) {
    throw new NotFound(`No subcategory found with id ${id}`);
  }
  return subcategory;
};

const getAllProductSubcategoryService = async (
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
    matchConditions = { category: parent };
  }
  const categories = await ProductSubcategory.find(matchConditions)
    .skip(skip)
    .limit(limit)
    .populate("category");
  if (!categories) {
    return [];
  }
  return categories;
};

const updateProductSubcategoryService = async (categoryData, id) => {
  const updatedCategory = await ProductSubcategory.findByIdAndUpdate(
    id,
    categoryData,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedCategory) {
    throw new BadRequest("Error updating subcategory, retry using valid data");
  }
  return updatedCategory;
};

const deleteProductSubcategoryService = async (id) => {
  const result = await ProductSubcategory.findByIdAndDelete(id);
  if (!result) {
    throw new BadRequest(`No subcategory found with id ${id}`);
  }
  return result;
};

const getProductSubcategoryCountService = async () => {
  const count = await ProductSubcategory.countDocuments();
  return count;
};

export const productSubcategoryService = {
  createProductSubcategoryService,
  getAllProductSubcategoryService,
  getProductSubcategoryService,
  deleteProductSubcategoryService,
  updateProductSubcategoryService,
  getProductSubcategoryCountService,
};
