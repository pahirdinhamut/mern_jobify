import jwt from "jsonwebtoken";
import { UnauthenticationError } from "../errors/index.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    // actually 401
    throw new UnauthenticationError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRED);
    req.user = { userId: payload.userId };

    next();
  } catch (error) {
    throw new UnauthenticationError("Authentication invalid");
  }
};

export default auth;
