import mongoose from "mongoose";
import { ProductCategory } from "./product-category.js";
import { ProductSubcategory } from "./product-subcategory.js";

const parentCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Parent category name is required"],
      unique: [true, "This parent category already exists"],
    },
  },
  { timestamps: true }
);

parentCategorySchema.pre("findOneAndDelete", async function (next) {
  const parentCategoryId = this.getQuery()["_id"];
  const categories = await ProductCategory.find({
    parentCategory: parentCategoryId,
  });
  for (const category of categories) {
    await ProductSubcategory.deleteMany({ category: category._id });
  }
  await ProductCategory.deleteMany({ parentCategory: parentCategoryId });
  next();
});

export const ProductParentCategory = mongoose.model(
  "ProductParentCategory",
  parentCategorySchema
);
