import { BadRequest } from "../errors/index.js";
import { productCategoryService } from "../services/product-category.service.js";

const createProductCategory = async (req, res) => {
  const categoryData = req.body;
  if (!categoryData) {
    throw new BadRequest("Category data not found");
  }
  const result = await productCategoryService.createProductCategoryService(
    categoryData
  );
  return res.status(201).json({ category: result });
};

const updateProductCategory = async (req, res) => {
  const categoryData = req.body;
  const { id } = req.params;
  if (!categoryData || !id) {
    throw new BadRequest("Category data not found");
  }
  const result = await productCategoryService.updateProductCategoryService(
    categoryData,
    id
  );
  return res.status(200).json({ category: result });
};

const getAllProductCategory = async (req, res) => {
  const { page, limit, query, skip, parent } = req.query;
  const categories = await productCategoryService.getAllProductCategoryService(
    page,
    limit,
    query,
    skip,
    parent
  );
  return res.status(200).json({ categories });
};

const getProductCategory = async (req, res) => {
  const { id } = req.params;
  const category = await productCategoryService.getProductCategoryService(id);
  return res.status(200).json({ category });
};

const deleteProductCategory = async (req, res) => {
  const { id } = req.params;
  await productCategoryService.deleteProductCategoryService(id);
  return res.status(200).json({ message: "Category deleted" });
};

const totalProductCategories = async (req, res) => {
  const count = await productCategoryService.getProductCategoryCountService();
  return res.status(200).json({ count });
};

export const productCategoryController = {
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  getAllProductCategory,
  getProductCategory,
  totalProductCategories,
};
