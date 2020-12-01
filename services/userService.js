const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const userService = () => {
  const registerUser = async (body, successCb, errorCb) => {
    const { name, email, password } = body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      errorCb({ code: 400, err: { errors: [{ msg: "User already exists" }] } });
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
    successCb(user);
  };

  return {
    registerUser,
  };
};

module.exports = userService();
