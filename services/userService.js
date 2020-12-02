const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userService = () => {
  const registerUser = async (body) => {
    const { name, email, password } = body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return { code: 400, err: { errors: [{ msg: "User already exists" }] } };
    }

    // Get users gravatar
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });

    user = new User({
      name,
      email,
      avatar,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

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
    registerUser,
  };
};

module.exports = userService();
