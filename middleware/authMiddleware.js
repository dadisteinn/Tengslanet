import jwt from "jsonwebtoken";
import { JwtTokenError } from "../errors.js";
import "dotenv/config.js";

export default function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if token exists
  if (!token) {
    throw new JwtTokenError("No token, authorization denied");
  }

  // Verify token
  try {
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);
    req.user = decodedToken.user;
    next();
  } catch (err) {
    throw new JwtTokenError("Token is not valid");
  }
}
