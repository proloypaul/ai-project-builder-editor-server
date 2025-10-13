import { Unauthenticated, UnAuthorized } from "../errors/index.js";
import { isTokenValid } from "../utils/jwt.js";

export const authenticate = (req, res, next) => {
  const token = req.cookies.top_most_outsourcing_token;
  if (!token) {
    throw new Unauthenticated("User not authenticated");
  }
  try {
    const payload = isTokenValid(token);
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch (error) {
    throw new Unauthenticated("Authentication failed");
  }
};

export const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnAuthorized("Authorization failed");
    }
    next();
  };
};
