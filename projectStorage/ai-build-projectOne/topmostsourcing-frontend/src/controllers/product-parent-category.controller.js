import { BadRequest } from "../errors/index.js";
import { productParentCategoryService } from "../services/product-parent-category.js";

const createProductParentCategory = async (req, res) => {
  const categoryData = req.body;
  if (!categoryData) {
    throw new BadRequest("Parent category data not found");
  }
  const result =
    await productParentCategoryService.createProductParentCategoryService(
      categoryData
    );
  return res.status(201).json({ parentCategory: result });
};

const updateProductParentCategory = async (req, res) => {
  const categoryData = req.body;
  const { id } = req.params;
  if (!categoryData || !id) {
    throw new BadRequest("Parent category data not found");
  }
  const result =
    await productParentCategoryService.updateProductParentCategoryService(
      categoryData,
      id
    );
  return res.status(200).json({ parentCategory: result });
};

const getAllProductParentCategory = async (req, res) => {
  const { page, limit, query, skip } = req.query;
  const parentCategories =
    await productParentCategoryService.getAllProductParentCategoryService(
      page,
      limit,
      query,
      skip
    );
  return res.status(200).json({ parentCategories });
};

const getProductParentCategory = async (req, res) => {
  const { id } = req.params;
  const parentCategory =
    await productParentCategoryService.getProductParentCategoryService(id);
  return res.status(200).json({ parentCategory });
};

const deleteProductParentCategory = async (req, res) => {
  const { id } = req.params;
  await productParentCategoryService.deleteProductParentCategoryService(id);
  return res.status(200).json({ message: "Parent category deleted" });
};

const totalProductParentCategories = async (req, res) => {
  const count =
    await productParentCategoryService.getProductParentCategoryCountService();
  return res.status(200).json({ count });
};

export const productParentCategoryController = {
  createProductParentCategory,
  updateProductParentCategory,
  deleteProductParentCategory,
  getAllProductParentCategory,
  getProductParentCategory,
  totalProductParentCategories,
};
