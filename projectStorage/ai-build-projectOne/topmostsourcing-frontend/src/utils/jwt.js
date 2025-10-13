import jwt from "jsonwebtoken";
import { config } from "../../config/index.js";

const createToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiry,
  });
};

export const isTokenValid = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

export const attachCookiesToResponse = ({ res, user }) => {
  const token = createToken(user);
  res.cookie("top_most_outsourcing_token", token, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    domain: ".topmostsourcing.com",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
