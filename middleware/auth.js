const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWTAuthenticationError } = require("../errors");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if token exists
  if (!token) {
    throw new JWTAuthenticationError("No token, authorization denied");
  }

  // Verify token
  try {
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);
    req.user = decodedToken.user;
    next();
  } catch (err) {
    throw new JWTAuthenticationError("Token is not valid");
  }
};
