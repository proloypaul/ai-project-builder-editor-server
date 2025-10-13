import { BadRequest } from "../errors/index.js";
import { productService } from "../services/product.service.js";

const createProduct = async (req, res) => {
  const productData = req.body;
  if (req.files && req.files.primaryImage) {
    const primaryImage = req.files.primaryImage[0];
    productData.imageUrl = primaryImage.filename;
  }
  if (req.files && req.files.secondaryImages) {
    const secondaryImages = req.files.secondaryImages;
    productData.secondaryImages = secondaryImages.map((file) => file.filename);
  }
  if (!productData) {
    throw new BadRequest("Product data not found");
  }
  const result = await productService.createProductService(productData);
  return res.status(201).json({ product: result });
};

const updateProduct = async (req, res) => {
  const productData = req.body;
  const { id } = req.params;
  if (!productData || !id) {
    throw new BadRequest("Product data not found");
  }
  if (req.files && req.files.primaryImage) {
    const primaryImage = req.files.primaryImage[0];
    productData.imageUrl = primaryImage.filename;
  }
  if (req.files && req.files.secondaryImages) {
    const secondaryImages = req.files.secondaryImages;
    productData.secondaryImages = secondaryImages.map((file) => file.filename);
  }
  const result = await productService.updateProductService(productData, id);
  return res.status(200).json({ product: result });
};

const updateSecondaryImages = async (req, res) => {
  const { image } = req.query;
  const { id } = req.params;
  if (!image || !id) {
    throw new BadRequest("Invalid request");
  }
  const result = await productService.updateSecondaryImagesService(image, id);
  return res.status(200).json({ imageUrl: result });
};

const getAllProduct = async (req, res) => {
  const {
    page,
    limit,
    query,
    skipValue,
    category,
    parentCategory,
    subcategory,
  } = req.query;
  const products = await productService.getAllProductService({
    page,
    limit,
    skipValue,
    query,
    category,
    parentCategory,
    subcategory,
  });
  return res.status(200).json(products);
};

const getAllProductExceptOne = async (req, res) => {
  const { page, limit, query, category, skipValue } = req.query;
  const { id } = req.params;
  const products = await productService.getAllProductExceptOneService({
    page,
    limit,
    skipValue,
    query,
    category,
    id,
  });
  return res.status(200).json({ products });
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await productService.getProductService(id);
  return res.status(200).json(product);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  await productService.deleteProductService(id);
  return res.status(200).json({ message: "Product deleted" });
};

const totalProducts = async (req, res) => {
  const { query, category, parentCategory, subcategory } = req.query;
  const count = await productService.getProductCount({
    query,
    category,
    parentCategory,
    subcategory,
  });
  return res.status(200).json({ count });
};

const requestQuotation = async (req, res) => {
  const productData = req.body;
  if (req.files && req.files.uploadedFiles) {
    const uploadedFiles = req.files.uploadedFiles;
    productData.uploadedFiles = uploadedFiles.map((file) => file.filename);
  }
  if (!productData) {
    throw new BadRequest("Product data not found");
  }
  const result = await productService.requestQuotationService(productData);
  return res.status(201).json({ success: true, message: "Request sent!" });
};

export const productController = {
  createProduct,
  deleteProduct,
  getAllProduct,
  updateProduct,
  getProduct,
  totalProducts,
  getAllProductExceptOne,
  updateSecondaryImages,
  requestQuotation,
};
