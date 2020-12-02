const Profile = require("../models/Profile");
const User = require("../models/User");

const profileService = () => {
  const getProfileFields = (body, userId) => {
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = body;

    // Create profile obj
    const profileFields = {};
    profileFields.user = userId;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Add social media
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    return profileFields;
  };

  const getExperienceFields = (body) => {
    const { title, company, location, from, to, current, description } = body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    return newExp;
  };

  const getUserProfile = async (userId) => {
    const profile = await Profile.findOne({ user: userId }).populate("user", [
      "name",
      "avatar",
    ]);
    if (!profile) {
      throw {
        code: 400,
        err: { errors: [{ msg: "No profile was found for this user" }] },
      };
    }
    return profile;
  };

  const createOrUpdateProfile = async (body, userId) => {
    const profileFields = getProfileFields(body, userId);

    // Find profile based on user id
    let profile = await Profile.findOne({ user: userId });

    // Update profile or a create new one if none was found
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: userId },
        { $set: profileFields },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );
    } else {
      profile = new Profile(profileFields);
      await profile.save();
    }
    return profile;
  };

  const getAllProfiles = async () => {
    // Find all profiles
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    return profiles;
  };

  const getProfileByUserId = async (userId) => {
    const profile = await Profile.findOne({ user: userId }).populate("user", [
      "name",
      "avatar",
    ]);
    if (!profile) {
      throw {
        code: 400,
        err: { errors: [{ msg: "Profile not found" }] },
      };
    }
    return profile;
  };

  const DeleteProfileById = async (userId) => {
    // TODO: Remove users posts

    // Remove profile
    await Profile.findOneAndRemove({ user: userId });
    // Remove user
    await User.findOneAndRemove({ _id: userId });
    // TODO: blacklist token?
  };

  const addExperience = async (body, userId) => {
    const newExp = getExperienceFields(body);

    const profile = await Profile.findOne({ user: userId });

    profile.experience.unshift(newExp);
    await profile.save();

    return profile;
  };

  return {
    getUserProfile,
    createOrUpdateProfile,
    getAllProfiles,
    getProfileByUserId,
    DeleteProfileById,
    addExperience,
  };
};

module.exports = profileService();
