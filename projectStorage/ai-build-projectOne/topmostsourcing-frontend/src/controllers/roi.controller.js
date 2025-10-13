import { roiService } from "../services/roi.service.js";

const createRoi = async (req, res) => {
  const data = req.body;
  const roi = await roiService.createRoi(data);
  return res.status(201).json(roi);
};

const updateRoi = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const roi = await roiService.updateRoi(id, data);
  return res.status(200).json(roi);
};

const getAllRoi = async (req, res) => {
  const rois = await roiService.getAllRoi();
  return res.status(200).json(rois);
};

export const roiController = {
  createRoi,
  updateRoi,
  getAllRoi,
};
