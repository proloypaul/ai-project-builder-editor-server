import { Roi } from "../models/roi.js";

const createRoi = async (data) => {
  const roi = await Roi.create({ roi: data.roi / 100 });
  return roi;
};

const updateRoi = async (id, data) => {
  const roi = await Roi.findById(id);
  if (!roi) {
    throw new Error("Roi not found");
  }

  roi.roi = data.roi;
  await roi.save();
  return roi;
};

const getAllRoi = async () => {
  const rois = await Roi.find({}).sort({ createdAt: -1 });
  return rois;
};

export const roiService = {
  createRoi,
  getAllRoi,
  updateRoi,
};
