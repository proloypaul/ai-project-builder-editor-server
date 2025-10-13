import { UnAuthorized } from "../errors/index.js";

export const checkPermission = (requestUser, resourceUserId) => {
  if (requestUser.role === "ADMIN") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnAuthorized("Not authorized to perform this action");
};
