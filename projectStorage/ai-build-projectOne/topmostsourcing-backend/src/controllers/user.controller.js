import { BadRequest } from "../errors/index.js";
import { userService } from "../services/user.service.js";
import { attachCookiesToResponse } from "../utils/index.js";

const loginUser = async (req, res) => {
  const user = await userService.loginUser(req);
  if (!user) {
    throw new BadRequest("Something went wrong");
  }
  attachCookiesToResponse({ res, user });
  return res.status(200).json({ message: "Login successfull" });
};

const logout = async (req, res) => {
  res.clearCookie("top_most_outsourcing_token");
  return res.status(200).json({ message: "user logged out" });
};

const sendMail = async (req, res) => {
  const { name, email, phone, subject, mailText } = req.body;
  if (!name || !email || !phone || !subject || !mailText) {
    throw new BadRequest("Please provide your details");
  }
  const result = await userService.sendMailService({
    name,
    email,
    phone,
    subject,
    mailText,
  });
  return res.status(200).json({ message: "Mail sent" });
};

export const userController = {
  loginUser,
  logout,
  sendMail,
};
