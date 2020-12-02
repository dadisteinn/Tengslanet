const Post = require("../models/Post");
const User = require("../models/User");
const Profile = require("../models/Profile");

const postsService = () => {
  const createPost = async (userId, text) => {
    const user = await User.findById(userId).select("-password");

    const newPost = new Post({
      text: text,
      name: user.name,
      avatar: user.avatar,
      user: userId,
    });

    return await newPost.save();
  };

  return {
    createPost,
  };
};

module.exports = postsService();
