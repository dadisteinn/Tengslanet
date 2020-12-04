import express from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/authMiddleware.js";
import postsService from "../services/postsService.js";
import { ServerError } from "../errors.js";

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

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put("/like/:postId", auth, async (req, res, next) => {
  try {
    const likes = await postsService.likePost(req.params.postId, req.user.id);
    return res.status(201).json(likes);
  } catch (error) {
    if (error.log) {
      return next(error);
    }
    error = new ServerError(error.message);
    next(error);
  }
});

// @route   PUT api/posts/like/:id
// @desc    Unlike post
// @access  Private
router.put("/unlike/:postId", auth, async (req, res, next) => {
  try {
    await postsService.unlikePost(req.params.postId, req.user.id);
    return res.status(200).json({ msg: "Post unliked" });
  } catch (error) {
    if (error.log) {
      return next(error);
    }
    error = new ServerError(error.message);
    next(error);
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post(
  "/comment/:postId",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const comment = await postsService.addComment(
        req.params.postId,
        req.user.id,
        req.body.text
      );
      return res.status(201).json(comment);
    } catch (error) {
      if (error.log) {
        return next(error);
      }
      error = new ServerError(error.message);
      next(error);
    }
  }
);

// @route   DELETE api/posts/comment/postId
// @desc    Delete a comment
// @access  Private
router.delete("/comment/:postId/:commentId", auth, async (req, res, next) => {
  try {
    await postsService.deleteComment(
      req.params.postId,
      req.params.commentId,
      req.user.id
    );
    return res.status(200).json({ msg: "Comment deleted" });
  } catch (error) {
    if (error.log) {
      return next(error);
    }
    error = new ServerError(error.message);
    next(error);
  }
});

export default router;
