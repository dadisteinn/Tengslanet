import Post from "../models/Post.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "../errors.js";

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
    const post = await Post.findById(postId);
    if (!post) {
      throw new NotFoundError("Post");
    }

    // Delete if user owns post, else throw error
    if (post.user.toString() !== userId) {
      throw new UnauthorizedError("User cannot delete this post");
    }
    await post.remove();
  };

  const likePost = async (postId, userId) => {
    // Get post or throw error if not found
    const post = await Post.findById(postId);
    if (!post) {
      throw new NotFoundError("Post");
    }

    // Throw error if user has already liked post
    if (
      post.likes.filter((like) => like.user.toString() === userId).length > 0
    ) {
      throw new BadRequestError("Post already liked");
    }

    // Add, save and return like
    post.likes.unshift({ user: userId });
    await post.save();

    return post.likes;
  };

  const unlikePost = async (postId, userId) => {
    // Get post or throw error if not found
    const post = await Post.findById(postId);
    if (!post) {
      throw new NotFoundError("Post");
    }

    // Get index of like or throw error if user has not liked the post
    const removeIndex = post.likes.map((item) => item.user).indexOf(userId);
    if (removeIndex === -1) {
      throw new BadRequestError("Post not liked");
    }

    // Add, save and return like
    post.likes.splice(removeIndex, 1);
    await post.save();

    return post.likes;
  };

  const addComment = async (postId, userId, text) => {
    // Get user without password, for post fields
    const user = await User.findById(userId).select("-password");

    // Get post or throw error if not found
    const post = await Post.findById(postId);
    if (!post) {
      throw new NotFoundError("Post");
    }

    // Create new Comment and save
    const newComment = {
      text: text,
      name: user.name,
      avatar: user.avatar, // TODO: Remove this
      user: userId,
    };
    post.comments.unshift(newComment);
    await post.save();

    return post.comments;
  };

  const deleteComment = async (postId, commentId, userId) => {
    // Get post or throw error if not found
    const post = await Post.findById(postId);
    if (!post) {
      throw new NotFoundError("Post");
    }

    // Get index of item to remove
    const removeIndex = post.comments.map((item) => item.id).indexOf(commentId);
    if (removeIndex === -1) {
      throw new NotFoundError("Comment");
    }

    // Delete if user owns the post, else throw error
    if (post.comments[removeIndex].user.toString() !== userId) {
      throw new UnauthorizedError("User cannot delete this comment");
    }
    post.comments.splice(removeIndex, 1);
    await post.save();

    return post.comments;
  };

  return {
    createPost,
    getAllPosts,
    getPostById,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    deleteComment,
  };
};

export default postsService();
