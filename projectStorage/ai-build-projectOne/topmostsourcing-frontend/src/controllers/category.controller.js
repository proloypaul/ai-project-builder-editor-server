import { BadRequest } from "../errors/index.js";
import { categoryService } from "../services/category.service.js";

const createCategory = async (req, res) => {
  const categoryData = req.body;
  if (!categoryData) {
    throw new BadRequest("Category data not found");
  }
  const result = await categoryService.createCategoryService(categoryData);
  return res.status(201).json({ category: result });
};

const updateCategory = async (req, res) => {
  const categoryData = req.body;
  const { id } = req.params;
  if (!categoryData || !id) {
    throw new BadRequest("Category data not found");
  }
  const result = await categoryService.updateCategoryService(categoryData, id);
  return res.status(200).json({ category: result });
};

const getAllCategory = async (req, res) => {
  const { page, limit, query } = req.query;
  const categories = await categoryService.getAllCategoryService(
    page,
    limit,
    query
  );
  return res.status(200).json({ categories });
};

const getCategory = async (req, res) => {
  const { id } = req.params;
  const category = await categoryService.getCategoryService(id);
  return res.status(200).json({ category });
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  await categoryService.deleteCategoryService(id);
  return res.status(200).json({ message: "Category deleted" });
};

const totalCategories = async (req, res) => {
  const count = await categoryService.getCategoryCount();
  return res.status(200).json({ count });
};

export const categoryController = {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
  getCategory,
  totalCategories,
};
