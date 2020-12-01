const Profile = require("../models/Profile");
const User = require("../models/User");

const profileService = () => {
  const getUserProfile = async (userId, successCb, errorCb) => {
    const profile = await Profile.findOne({ user: userId }).populate("user", [
      "name",
      "avatar",
    ]);
    if (!profile) {
      errorCb({
        code: 400,
        err: { errors: [{ msg: "No profile was found for this user" }] },
      });
    }
    successCb(profile);
  };

  return {
    getUserProfile,
  };
};

module.exports = profileService();
