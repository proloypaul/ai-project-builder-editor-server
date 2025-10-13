import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name required"],
    },
    price: {
      type: String,
      default: "Negotiable",
    },
    quantity: {
      type: Number,
    },
    description: {
      type: String,
    },
    sizes: {
      type: String,
    },
    colors: {
      type: String,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductParentCategory",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductSubcategory",
      required: true,
    },
    imageUrl: {
      type: String,
    },
    secondaryImages: {
      type: [String],
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
