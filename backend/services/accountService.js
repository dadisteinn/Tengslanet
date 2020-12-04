import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  ConflictError,
  InvalidCredentialsError,
  NotFoundError,
} from "../errors.js";
import "dotenv/config.js";

const authService = () => {
  const registerUser = async (body) => {
    const { name, email, password } = body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      throw new ConflictError("A user already exists with this email");
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

  const loginUser = async (body) => {
    const { email, password } = body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      throw new InvalidCredentialsError("Email is not valid");
    }

    // Check if password is correct
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      throw new InvalidCredentialsError("Password is not valid");
    }

    // Create token payload and return jsonwebtoken
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

  const getUserByToken = async (userId) => {
    // Find user, throw error if user id is invalid
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new NotFoundError("User");
    }
    return user;
  };

  return {
    registerUser,
    loginUser,
    getUserByToken,
  };
};

export default authService();
