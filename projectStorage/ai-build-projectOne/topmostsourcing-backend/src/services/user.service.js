import nodemailer from "nodemailer";
import { BadRequest, NotFound } from "../errors/index.js";
import { User } from "../models/user.js";
import { createTokenUser } from "../utils/index.js";

const loginUser = async (req) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new BadRequest("Please provide credentials");
  }
  const userExist = await User.findOne({
    $or: [{ username }, { email: username }],
  });
  if (!userExist) {
    throw new NotFound("Invalid username or email");
  }
  const passwordMatched = await userExist.comparePassword(password);
  if (!passwordMatched) {
    throw new BadRequest("Invalid password");
  }
  const tokenUser = createTokenUser(userExist);
  return tokenUser;
};

const sendMailService = async ({ name, email, phone, subject, mailText }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
  });
  const mailOptions = {
    from: email,
    to: process.env.SMTP_MAIL,
    subject: subject,
    html: `
      <h1>New Message from ${name}</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <p>${mailText}</p>
    `,
  };
  await transporter.sendMail(mailOptions);
  return true;
};

export const userService = {
  loginUser,
  sendMailService,
};
