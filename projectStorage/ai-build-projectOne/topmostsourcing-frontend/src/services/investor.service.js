import BadRequest from "../errors/badRequest.js";
import NotFound from "../errors/notFound.js";
import { Investor } from "../models/investor.js";
import crypto from "crypto";
import { investService } from "./invest.service.js";

async function generateId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  const bytes = crypto.randomBytes(8);

  for (let i = 0; i < 8; i++) {
    id += chars[bytes[i] % chars.length];
  }

  const idExists = await Investor.findOne({ publicId: id });

  if (idExists) {
    return generateId();
  } else {
    return id;
  }
}

const createInvestor = async (data) => {
  const uniqueId = await generateId();
  const investor = await Investor.create({
    ...data,
    publicId: `INV${uniqueId}`,
  });

  if (data.investRange) {
    await investService.createInvest({
      investor: investor._id,
      investRange: data.investRange,
      investPeriod: data.investPeriod,
    });
  }
  return investor;
};

const loginInvestor = async (phone) => {
  if (!phone) {
    throw new BadRequest("Please provide phone number");
  }

  const investor = await Investor.findOne({ phone });
  if (!investor) {
    throw new NotFound("Investor not found");
  }
  return investor;
};

const getInvestor = async (id) => {
  const investor = await Investor.findById(id);
  if (!investor) {
    throw new NotFound("Investor not found");
  }
  return investor;
};

export const investorService = {
  createInvestor,
  loginInvestor,
  getInvestor,
};
