import mongoose from "mongoose";
import { ProductSubcategory } from "./product-subcategory.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "This category already exists"],
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductParentCategory",
      required: true,
    },
  },
  { timestamps: true }
);

categorySchema.pre("findOneAndDelete", async function (next) {
  const categoryId = this.getQuery()["_id"];
  await ProductSubcategory.deleteMany({ category: categoryId });
  next();
});

export const ProductCategory = mongoose.model(
  "ProductCategory",
  categorySchema
);
