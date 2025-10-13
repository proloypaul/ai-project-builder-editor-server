import mongoose from "mongoose";

export const investmentStatus = {
  PENDING: "pending",
  APPLIED: "applied",
  PAID: "paid",
  WITHDRAWN: "withdrawn",
  WITHDRAW_REQUESTED: "withdraw_req",
  WITHDRAWABLE: "withdrawable",
};

const investmentsSchema = new mongoose.Schema(
  {
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investor",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount required"],
    },
    returns: {
      type: Number,
    },
    status: {
      type: String,
      enum: Object.values(investmentStatus),
      default: investmentStatus.APPLIED,
    },
    investPeriod: {
      type: String,
    },
    investRange: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Investments = mongoose.model("Investments", investmentsSchema);
