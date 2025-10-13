import { BadRequest } from "../errors/index.js";
import { productSubcategoryService } from "../services/product-subcategory.js";

const createProductSubcategory = async (req, res) => {
  const subcategoryData = req.body;
  if (!subcategoryData) {
    throw new BadRequest("Subcategory data not found");
  }
  const result =
    await productSubcategoryService.createProductSubcategoryService(
      subcategoryData
    );
  return res.status(201).json({ subcategory: result });
};

const updateProductSubcategory = async (req, res) => {
  const subcategoryData = req.body;
  const { id } = req.params;
  if (!subcategoryData || !id) {
    throw new BadRequest("Subcategory data not found");
  }
  const result =
    await productSubcategoryService.updateProductSubcategoryService(
      subcategoryData,
      id
    );
  return res.status(200).json({ subcategory: result });
};

const getAllProductSubcategory = async (req, res) => {
  const { page, limit, query, skip, parent } = req.query;
  const subcategories =
    await productSubcategoryService.getAllProductSubcategoryService(
      page,
      limit,
      query,
      skip,
      parent
    );
  return res.status(200).json({ subcategories });
};

const getProductSubcategory = async (req, res) => {
  const { id } = req.params;
  const subcategory =
    await productSubcategoryService.getProductSubcategoryService(id);
  return res.status(200).json({ subcategory });
};

const deleteProductSubcategory = async (req, res) => {
  const { id } = req.params;
  await productSubcategoryService.deleteProductSubcategoryService(id);
  return res.status(200).json({ message: "Subcategory deleted" });
};

const totalProductSubcategories = async (req, res) => {
  const count =
    await productSubcategoryService.getProductSubcategoryCountService();
  return res.status(200).json({ count });
};

export const productSubcategoryController = {
  createProductSubcategory,
  updateProductSubcategory,
  deleteProductSubcategory,
  getAllProductSubcategory,
  getProductSubcategory,
  totalProductSubcategories,
};
