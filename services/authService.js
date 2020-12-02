const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const authService = () => {
  const getAuthUser = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw {
        code: 400,
        err: { errors: [{ msg: "No user exists with this email" }] },
      };
    }
    return user;
  };

  const loginUser = async (body) => {
    const { email, password } = body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      throw { code: 400, err: { errors: [{ msg: "Invalid credentials" }] } };
    }

    // Check if password is correct
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      throw { code: 400, err: { errors: [{ msg: "Invalid credentials" }] } };
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    return jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: 360000 } // TODO: remove two zeroes
    );
  };

  return {
    getAuthUser,
    loginUser,
  };
};

module.exports = authService();
