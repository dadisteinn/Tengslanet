const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const profileService = require("../services/profileService");

// @route   GET api/profile/{userId}
// @desc    Get current users profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  profileService.getUserProfile(
    req.user.id,
    function (profile) {
      return res.json(profile);
    },
    function (err) {
      if (err.code) {
        return res.status(err.code).json(err.err);
      }
      return res.status(500).send("Server error");
    }
  );
});

module.exports = router;
