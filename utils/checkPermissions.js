import { UnauthenticationError } from "../errors/index.js";

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnauthenticationError("Not authorized to acces this route!");
  return;
};

export default checkPermissions;
