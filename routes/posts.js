const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const postsService = require("../services/postsService");

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await postsService.createPost(req.user.id, req.body.text);
      return res.status(201).json(post);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server error");
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await postsService.getAllPosts();
    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

// @route   POST api/posts/:postId
// @desc    Get post by id
// @access  Private
router.get("/:postId", auth, async (req, res) => {
  try {
    const post = await postsService.getPostById(req.params.postId);
    return res.status(200).json(post);
  } catch (err) {
    if (err.type === "ObjectId" || err.type === "NOTFOUND") {
      return res.status(404).json({ msg: "Post not found" });
    }
    console.error(err);
    return res.status(500).send("Server error");
  }
});

// @route   DELETE api/posts/:postId
// @desc    Delete a post
// @access  Private
router.delete("/:postId", auth, async (req, res) => {
  try {
    await postsService.deletePost(req.params.postId, req.user.id);
    return res.status(200).json({ msg: "Post deleted" });
  } catch (err) {
    if (err.type === "AUTH") {
      return res.status(401).json(err.err.msg);
    } else if (err.type === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    console.error(err);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
