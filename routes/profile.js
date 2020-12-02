const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const profileService = require("../services/profileService");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await profileService.getUserProfile(req.user.id);
    return res.json(profile);
  } catch (err) {
    if (err.code) {
      return res.status(err.code).json(err.err);
    }
    return res.status(500).send("Server error");
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await profileService.createOrUpdateProfile(
        req.body,
        req.user.id
      );
      return res.json(profile);
    } catch (err) {
      if (err.code) {
        return res.status(err.code).json(err.err);
      }
      return res.status(500).send("Server error");
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await profileService.getAllProfiles();
    return res.json(profiles);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

// @route   GET api/profile/user/:userId
// @desc    Get profile by user id
// @access  Public
router.get("/user/:userId", async (req, res) => {
  try {
    const profiles = await profileService.getProfileByUserId(req.params.userId);
    return res.json(profiles);
  } catch (err) {
    if (err.code) {
      return res.status(err.code).json(err.err);
    }
    if (err.kind) {
      return res.status(400).send("Profile not found");
    }
    return res.status(500).send("Server error");
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user and posts
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    await profileService.DeleteProfileById(req.user.id);
    return res.status(204).json({ msg: "User deleted" });
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

module.exports = router;
