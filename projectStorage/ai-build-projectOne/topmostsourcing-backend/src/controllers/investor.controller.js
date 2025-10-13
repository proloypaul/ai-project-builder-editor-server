import { investorService } from "../services/investor.service.js";

const createInvestor = async (req, res) => {
  const data = req.body;
  const investor = await investorService.createInvestor(data);
  return res.status(201).json({ investor });
};

const loginInvestor = async (req, res) => {
  const { phone } = req.body;
  const investor = await investorService.loginInvestor(phone);
  return res.status(200).json(investor);
};

const getInvestor = async (req, res) => {
  const { id } = req.params;
  const investor = await investorService.getInvestor(id);
  return res.status(200).json(investor);
};

export const investorController = {
  createInvestor,
  loginInvestor,
  getInvestor,
};
