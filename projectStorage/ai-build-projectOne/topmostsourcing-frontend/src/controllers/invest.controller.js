import { investService } from "../services/invest.service.js";

const createInvest = async (req, res) => {
  const data = req.body;
  const invest = await investService.createInvest(data);
  return res.status(201).json(invest);
};

const updateInvest = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const invest = await investService.updateInvest(id, data);
  return res.status(200).json(invest);
};

const getAllInvest = async (req, res) => {
  const { investorId } = req.params;
  const investments = await investService.getAllInvest(investorId);
  return res.status(200).json(investments);
};

const withdrawFunds = async (req, res) => {
  const { investorId } = req.params;
  const investments = await investService.withdrawFunds(investorId);
  return res.status(200).json(investments);
};

export const investController = {
  createInvest,
  updateInvest,
  getAllInvest,
  withdrawFunds,
};
