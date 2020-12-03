const Post = require("../models/Post");
const User = require("../models/User");
const Profile = require("../models/Profile");

const postsService = () => {
  const createPost = async (userId, text) => {
    // Get user without password, for post fields
    const user = await User.findById(userId).select("-password");

    // Create new post and save
    const newPost = new Post({
      text: text,
      name: user.name,
      avatar: user.avatar, // Remove this
      user: userId,
    });
    return await newPost.save();
  };

  const getAllPosts = async () => {
    const posts = await Post.find().sort({ date: -1 });
    return posts;
  };

  const getPostById = async (postId) => {
    // Get the post, throw 404 error of not found
    const post = await Post.findById(postId);
    if (!post) {
      throw { type: "NOTFOUND", err: { msg: "Post not found" } };
    }
    return post;
  };

  const deletePost = async (postId, userId) => {
    // Remove post
    const post = await Post.findById({ postId });

    // Check if post is owned by user
    if (post.user.toString() !== userId) {
      throw { type: "AUTH", err: { msg: "User not authorized" } };
    }
  };

  return {
    createPost,
    getAllPosts,
    getPostById,
    deletePost,
  };
};

module.exports = postsService();
