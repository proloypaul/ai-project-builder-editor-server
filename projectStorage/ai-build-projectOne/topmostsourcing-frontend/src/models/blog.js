import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
    },
    subtitle: {
      type: String,
    },
    imageTitle: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Blog description required"],
    },
    tags: {
      type: [String],
    },
    category: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", BlogSchema);
