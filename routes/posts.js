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

module.exports = router;
