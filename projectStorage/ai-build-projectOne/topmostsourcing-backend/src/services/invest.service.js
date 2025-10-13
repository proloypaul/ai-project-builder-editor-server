import NotFound from "../errors/notFound.js";
import { Investments, investmentStatus } from "../models/investments.js";
import { Investor } from "../models/investor.js";

const createInvest = async (data) => {
  const investor = await Investor.findById(data.investor);
  if (!investor) {
    throw new NotFound("Investor not found");
  }

  const invest = await Investments.create({
    investor: data.investor,
    amount: Number(data.amount || 0),
    returns: Number(data.amount || 0) * investor.roi,
    investRange: data.investRange,
    status: investmentStatus.APPLIED,
    investPeriod: data.investPeriod,
  });
  return invest;
};

const updateInvest = async (id, data) => {
  const invest = await Investments.findById(id);
  if (!invest) {
    throw new NotFound("Investment not found");
  }

  let prevStatus = invest.status;

  const investor = await Investor.findById(invest.investor);
  if (!investor) {
    throw new NotFound("Investor not found");
  }

  if (data.investPeriod) invest.investPeriod = data.investPeriod;
  if (data.status) invest.status = data.status;
  if (data.status === investmentStatus.PAID && data.amount) {
    invest.amount = data.amount;
    invest.returns = data.amount * investor.roi;
  }

  if (
    data.status &&
    prevStatus === investmentStatus.PENDING &&
    data.status === investmentStatus.PAID
  ) {
    investor.totalInvestment += invest.amount;
    investor.totalReturns += invest.returns;
    investor.pendingReturns += invest.returns;
  } else if (
    data.status &&
    prevStatus === investmentStatus.WITHDRAW_REQUESTED &&
    data.status === investmentStatus.WITHDRAWABLE
  ) {
    investor.withdrawableAmount += invest.amount + invest.returns;
  }
  await investor.save();
  await invest.save();

  return invest;
};

const getAllInvest = async (investorId) => {
  const investments = await Investments.find({
    investor: investorId,
  })
    .sort({ createdAt: -1 })
    .populate("investor");

  return investments;
};

const withdrawFunds = async (investorId) => {
  const updatedInvests = await Investments.updateMany(
    { investor: investorId, status: investmentStatus.WITHDRAWABLE },
    { status: investmentStatus.WITHDRAWN },
    { multi: true }
  );
  return updatedInvests;
};

export const investService = {
  createInvest,
  updateInvest,
  getAllInvest,
  withdrawFunds,
};
