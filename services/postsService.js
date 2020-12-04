import Post from "../models/Post.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";

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
    // Get all posts and sort them by date
    const posts = await Post.find().sort({ date: -1 });
    return posts;
  };

  const getPostById = async (postId) => {
    // Get post or throw error if not found
    const post = await Post.findById(postId);
    if (!post) {
      throw new NotFoundError("Post");
    }
    return post;
  };

  const deletePost = async (postId, userId) => {
    // Get post or throw error if not found
    const post = await Post.findById({ postId });
    if (!post) {
      throw new NotFoundError("Post");
    }

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

export default postsService();
