import nodemailer from "nodemailer";
import path from "path";
import { unlink } from "fs";
import { BadRequest, NotFound } from "../errors/index.js";
import { Product } from "../models/product.js";

const createProductService = async (productData) => {
  const result = await Product.create(productData);
  if (!result) {
    throw new BadRequest(
      "Error occured creating product, retry using valid data"
    );
  }
  return result;
};

const getProductService = async (id) => {
  const product = await Product.findById(id).populate({
    path: "subcategory",
    populate: {
      path: "category",
      populate: {
        path: "parentCategory",
      },
    },
  });
  if (!product) {
    throw new NotFound(`No product found with id ${id}`);
  }
  return product;
};

const getAllProductService = async ({
  page = 1,
  limit = 0,
  skipValue = 1000,
  query = "",
  category = "",
  parentCategory = "",
  subcategory = "",
}) => {
  const skip = (page - 1) * skipValue;
  let matchConditions = {};
  if (query) {
    matchConditions.name = { $regex: query, $options: "i" };
  }
  if (category) {
    matchConditions.category = category;
  }
  if (parentCategory) {
    matchConditions.parentCategory = parentCategory;
  }
  if (subcategory) {
    matchConditions.subcategory = subcategory;
  }
  const products = await Product.find(matchConditions)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("subcategory")
    .populate("category")
    .populate("parentCategory");

  return products;
};

const getAllProductExceptOneService = async ({
  page = 1,
  limit = 0,
  skipValue = 10,
  query = "",
  category = "",
  id = null,
}) => {
  const skip = (page - 1) * skipValue;
  let matchConditions = {};
  if (query) {
    matchConditions.name = { $regex: query, $options: "i" };
  }
  if (category) {
    matchConditions.category = category;
  }
  if (id) {
    matchConditions._id = { $ne: id };
  }
  const products = await Product.find(matchConditions)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("subcategory")
    .populate("category")
    .populate("parentCategory");
  return products;
};

const updateProductService = async (productData, id) => {
  const oldProduct = await Product.findById(id);
  if (!oldProduct) {
    throw new NotFound(`No product found with id ${id}`);
  }
  if (productData.imageUrl) {
    try {
      const imagePath = path.join(
        process.cwd(),
        "uploads",
        oldProduct.imageUrl
      );
      unlink(imagePath, (err) => {
        if (err) {
          console.log(err.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (productData.secondaryImages) {
    productData.secondaryImages = [
      ...oldProduct.secondaryImages,
      ...productData.secondaryImages,
    ];
  }
  const updatedProduct = await Product.findByIdAndUpdate(id, productData, {
    new: true,
  });
  if (!updatedProduct) {
    throw new BadRequest("Error updating product, retry using valid data");
  }
  return updatedProduct;
};

const updateSecondaryImagesService = async (image, id) => {
  const oldProduct = await Product.findById(id);
  if (!oldProduct) {
    throw new NotFound(`No product found with id ${id}`);
  }
  if (image) {
    try {
      const imagePath = path.join(process.cwd(), "uploads", image);
      unlink(imagePath, (err) => {
        if (err) {
          console.log(err.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  let updatedSecondaryImages = oldProduct?.secondaryImages?.filter(
    (prevImage) => prevImage !== image
  );
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { secondaryImages: updatedSecondaryImages },
    {
      new: true,
    }
  );
  if (!updatedProduct) {
    throw new BadRequest("Error updating product, retry using valid data");
  }
  return image;
};

const deleteProductService = async (id) => {
  const oldProduct = await Product.findById(id);
  if (!oldProduct) {
    throw new NotFound(`No product found with id ${id}`);
  }
  try {
    const imagePath = path.join(process.cwd(), "uploads", oldProduct.imageUrl);
    unlink(imagePath, (err) => {
      if (err) {
        console.log(err.message);
      }
    });
  } catch (error) {
    console.log(error);
  }

  const result = await Product.findByIdAndDelete(id);
  if (!result) {
    throw new BadRequest(`No product found with id ${id}`);
  }
  return result;
};

const getProductCount = async ({
  query = "",
  category = "",
  parentCategory = "",
  subcategory = "",
}) => {
  let matchConditions = {};
  if (query) {
    matchConditions.name = { $regex: query, $options: "i" };
  }
  if (category) {
    matchConditions.category = category;
  }
  if (parentCategory) {
    matchConditions.parentCategory = parentCategory;
  }
  if (subcategory) {
    matchConditions.subcategory = subcategory;
  }
  const count = await Product.find(matchConditions).countDocuments();
  return count;
};

const requestQuotationService = async (requestData) => {
  const {
    name,
    email,
    phone,
    title,
    price,
    quantity,
    date,
    description,
    tags,
    payment,
    country,
    city,
    uploadedFiles,
  } = requestData;

  if (
    !name ||
    !email ||
    !phone ||
    !title ||
    !price ||
    !quantity ||
    !date ||
    !description ||
    !tags ||
    !payment ||
    !country ||
    !city
  ) {
    throw new BadRequest("Proper details not provided");
  }

  const fileLinks =
    uploadedFiles.length > 0
      ? `
      <p><strong>Product files:</strong></p>
      <ul>
        ${uploadedFiles
          .map(
            (file) => `
          <li><a href="http://192.168.0.104:3001/${file}">Download ${file}</a></li>
        `
          )
          .join("")}
      </ul>
    `
      : "";

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    replyTo: requestData.email,
    to: process.env.SMTP_MAIL,
    subject: "Request for Quotation",
    html: `
      <h1>New Message from ${name}</h1>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Product files:</strong></p>
      ${fileLinks}
      <p><strong>Product title:</strong> ${title}</p>
      <p><strong>Product description:</strong> ${description}</p>
      <p><strong>Product tags:</strong> ${tags}</p>
      <p><strong>Product quantity:</strong> ${quantity}</p>
      <p><strong>Product price:</strong> ${price}</p>
      <p><strong>Expected delivery date:</strong> ${date}</p>
      <p><strong>Payment method:</strong> ${payment}</p>
      <p><strong>Country:</strong> ${country}</p>
      <p><strong>City:</strong> ${city}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  return true;
};

export const productService = {
  createProductService,
  getAllProductService,
  getProductService,
  deleteProductService,
  updateProductService,
  getProductCount,
  getAllProductExceptOneService,
  updateSecondaryImagesService,
  requestQuotationService,
};
