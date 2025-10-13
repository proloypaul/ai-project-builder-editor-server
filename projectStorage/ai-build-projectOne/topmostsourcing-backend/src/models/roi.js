import mongoose from "mongoose";

const roiSchema = new mongoose.Schema(
  {
    roi: {
      type: Number,
      required: [true, "Roi percentage is required"],
    },
  },
  { timestamps: true }
);

export const Roi = mongoose.model("roi", roiSchema);
