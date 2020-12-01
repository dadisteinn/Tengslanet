const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const authService = () => {
  const getAuthUser = async (userId, successCb, errorCb) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      errorCb({
        code: 400,
        err: { errors: [{ msg: "No user exists with this email" }] },
      });
    }
    successCb(user);
  };

  const loginUser = async (body, successCb, errorCb) => {
    const { email, password } = body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      errorCb({ code: 400, err: { errors: [{ msg: "Invalid credentials" }] } });
    }

    // Check if password is correct
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      errorCb({ code: 400, err: { errors: [{ msg: "Invalid credentials" }] } });
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: 360000 }, // TODO: remove two zeroes
      (err, token) => {
        if (err) throw err;
        successCb(token);
      }
    );
  };

  return {
    getAuthUser,
    loginUser,
  };
};

module.exports = authService();
