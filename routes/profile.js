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
    console.error(err.message);
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
      console.error(err.message);
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
    console.error(err.message);
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
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user and posts
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    await profileService.deleteProfile(req.user.id);
    return res.status(200).json({ msg: "User deleted" }); // TODO: 204 (nocontent) and no msg??
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

// @route   POST api/profile/experience
// @desc    Add profile experience
// @access  Private
router.post(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await profileService.addExperience(req.body, req.user.id);
      return res.status(201).json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
  }
);

// @route   DELETE api/profile/experience/:expId
// @desc    Delete Experience
// @access  Private
router.delete("/experience/:expId", auth, async (req, res) => {
  try {
    const profile = await profileService.deleteExperience(
      req.params.expId,
      req.user.id
    );
    return res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

// @route   POST api/profile/education
// @desc    Add profile education
// @access  Private
router.post(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await profileService.addEducation(req.body, req.user.id);
      return res.status(201).json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
  }
);

// @route   DELETE api/profile/education/:eduId
// @desc    Delete education
// @access  Private
router.delete("/education/:eduId", auth, async (req, res) => {
  try {
    const profile = await profileService.deleteEducation(
      req.params.eduId,
      req.user.id
    );
    return res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get("/github/:username", async (req, res) => {
  try {
    const data = await profileService.getGitrepos(req.params.username);
    if (!data) {
      return res.status(404).json({ msg: "No github profile found" });
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
