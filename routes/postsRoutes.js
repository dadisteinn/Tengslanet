import express from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/authMiddleware.js";
import postsService from "../services/postsService.js";

const router = express.Router();

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await postsService.createPost(req.user.id, req.body.text);
      return res.status(201).json(post);
    } catch (error) {
      error = new ServerError(error.message);
      next(error);
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get("/", auth, async (req, res, next) => {
  try {
    const posts = await postsService.getAllPosts();
    return res.status(200).json(posts);
  } catch (error) {
    error = new ServerError(error.message);
    next(error);
  }
});

// @route   POST api/posts/:postId
// @desc    Get post by id
// @access  Private
router.get("/:postId", auth, async (req, res, next) => {
  try {
    const post = await postsService.getPostById(req.params.postId);
    return res.status(200).json(post);
  } catch (err) {
    if (error.log) {
      return next(error);
    }
    error = new ServerError(error.message);
    next(error);
  }
});

// @route   DELETE api/posts/:postId
// @desc    Delete a post
// @access  Private
router.delete("/:postId", auth, async (req, res, next) => {
  try {
    await postsService.deletePost(req.params.postId, req.user.id);
    return res.status(200).json({ msg: "Post deleted" });
  } catch (error) {
    if (error.log) {
      return next(error);
    }
    error = new ServerError(error.message);
    next(error);
  }
});

export default router;
