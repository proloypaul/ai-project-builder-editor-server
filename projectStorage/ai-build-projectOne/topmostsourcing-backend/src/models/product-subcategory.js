import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      unique: [true, "This subcategory already exists"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
  },
  { timestamps: true }
);

export const ProductSubcategory = mongoose.model(
  "ProductSubcategory",
  subcategorySchema
);
