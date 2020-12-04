import axios from "axios";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { NotFoundError } from "../errors.js";
import "dotenv/config.js";

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

  const getEducationFields = (body) => {
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    return newEdu;
  };

  const getUserProfile = async (userId) => {
    // Get users own profile or throw error ef none is found
    const profile = await Profile.findOne({ user: userId }).populate("user", [
      "name",
      "avatar",
    ]);
    if (!profile) {
      throw new NotFoundError("Profile");
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
    // Get user profile or throw error ef none is found
    const profile = await Profile.findOne({ user: userId }).populate("user", [
      "name",
      "avatar",
    ]);
    if (!profile) {
      throw new NotFoundError("Profile");
    }
    return profile;
  };

  const deleteProfile = async (userId) => {
    // TODO: Remove users posts

    // Remove profile
    await Profile.findOneAndRemove({ user: userId });
    // Remove user
    await User.findOneAndRemove({ _id: userId });
    // TODO: blacklist token?
  };

  const addExperience = async (body, userId) => {
    // Get experience fields from the body
    const newExp = getExperienceFields(body);

    // Get profile or throw error if not found
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      throw new NotFoundError("Profile");
    }

    // Add experience to the profile and save
    profile.experience.unshift(newExp);
    await profile.save();

    return profile;
  };

  const deleteExperience = async (expId, userId) => {
    // Get user profile or throw error if not found
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      throw new NotFoundError("Profile");
    }

    // Get index of item to remove or throw error if not found
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(expId);
    if (removeIndex === -1) {
      throw new NotFoundError("Experience");
    }

    // Remove item and save profile
    profile.experience.splice(removeIndex, 1);
    await profile.save();

    return profile;
  };

  const addEducation = async (body, userId) => {
    // Get education fields from the body
    const newEdu = getEducationFields(body);

    // Get profile or throw error if not found
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      throw new NotFoundError("Profile");
    }

    // Add education to the profile and save
    profile.education.unshift(newEdu);
    await profile.save();

    return profile;
  };

  const deleteEducation = async (eduId, userId) => {
    // Get user profile or throw error if not found
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      throw new NotFoundError("Profile");
    }

    // Get index of item to remove
    const removeIndex = profile.education.map((item) => item.id).indexOf(eduId);
    if (removeIndex === -1) {
      throw new NotFoundError("Education");
    }

    // Remove item and save profile
    profile.education.splice(removeIndex, 1);
    await profile.save();

    return profile;
  };

  const getGitrepos = async (username) => {
    // Set the URI witht the username
    const uri = encodeURI(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`
    );
    // Get github token

    const headers = {
      "user-agent": "node.js",
      Authorization: `token ${process.env.GITHUBTOKEN}`,
    };

    // Call the github API and return the response data
    try {
      // TODO: Fix this, read docs about errors
      // https://docs.github.com/en/free-pro-team@latest/rest
      const gitHubResponse = await axios.get(uri, { headers });
      return gitHubResponse.data;
    } catch (err) {
      console.error(err.message);
      return null;
    }
  };

  return {
    getUserProfile,
    createOrUpdateProfile,
    getAllProfiles,
    getProfileByUserId,
    deleteProfile,
    addExperience,
    deleteExperience,
    addEducation,
    deleteEducation,
    getGitrepos,
  };
};

export default profileService();
