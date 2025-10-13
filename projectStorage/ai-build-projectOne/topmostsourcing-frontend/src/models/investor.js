import mongoose from "mongoose";

const investorSchema = new mongoose.Schema({
  publicId: {
    type: String,
    unique: true,
    required: [true, "Please provide publicId"],
  },
  name: {
    type: String,
    required: [true, "username required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
  },
  totalInvestment: {
    type: Number,
    default: 0,
  },
  totalReturns: {
    type: Number,
    default: 0,
  },
  pendingReturns: {
    type: Number,
    default: 0,
  },
  withdrawableAmount: {
    type: Number,
    default: 0,
  },
  roi: {
    type: Number,
    default: 0.18,
  },
});

export const Investor = mongoose.model("Investor", investorSchema);
