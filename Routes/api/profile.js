const express = require("express");
const auth = require("../../middleware/auth");
const Profile = require("../../models/profileModel");
const User = require("../../models/userModel");
const request = require("request");
const config = require("config");
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({
        message: "no profile for this user",
      });
    }
    res.status(200).json({
      message: "success",
      profile,
    });
  } catch (err) {
    res.status(500).send("server error");
  }
});
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    if (!profiles) {
      return res.status(400).json({
        message: "no profile for this user",
      });
    }
    res.status(200).json({
      message: "success",
      profiles,
    });
  } catch (err) {
    res.status(500).send("server error");
  }
});
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({
        message: "profile not found",
      });
    }
    res.status(200).json({
      message: "success",
      profile,
    });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(400).json({
        message: "profile not found",
      });
    }
    res.status(500).send("server error");
  }
});

router.post(
  "/",
  [
    auth,
    [
      check("status", "status is required").not().isEmpty(),
      check("skills", "skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          profileFields,
          { new: true }
        );
        return res.status(200).json({
          message: "success",
          profile,
        });
      }
      profile = await Profile.create(profileFields);
      res.status(201).json({
        message: "success",
        profile,
      });
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

router.delete("/", auth, async (req, res) => {
  try {
    await Post.deleteMany({ user: req.user.id });
    await Profile.findOneAndDelete({ user: req.user.id });
    await User.findByIdAndDelete(req.user.id);

    res.status(204).json({
      message: "user removed",
    });
  } catch (err) {
    res.status(500).send("server error");
  }
});

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "title is required").not().isEmpty(),
      check("company", "company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };
    console.log(newExp);
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      console.log(profile);

      profile.experience.unshift(newExp);
      console.log(profile.experience);

      await profile.save();

      console.log(profile);

      res.status(200).json({
        message: "updated successfully",
        profile,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("server error");
    }
  }
);

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // profile.experience = profile.experience.filter(
    //   (exp) => exp._id !== req.params.exp_id
    // );
    const removeIndex = profile.experience
      .map((exp) => exp._id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    console.log(profile.experience);
    await profile.save();

    res.status(204).json({
      message: "exp removed",
    });
  } catch (err) {
    res.status(500).send("server error");
  }
});
router.put(
  "/education",
  [
    auth,
    [
      check("school", "school is required").not().isEmpty(),
      check("degree", "degree is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };
    console.log(newEdu);
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      console.log(profile);

      profile.education.unshift(newEdu);
      console.log(profile.education);

      await profile.save();

      console.log(profile);

      res.status(200).json({
        message: "updated successfully",
        profile,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("server error");
    }
  }
);

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // profile.education = profile.education.filter(
    //   (exp) => exp._id !== req.params.exp_id
    // );
    const removeIndex = profile.education
      .map((edu) => edu._id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);
    console.log(profile.education);
    await profile.save();

    res.status(204).json({
      message: "exp removed",
    });
  } catch (err) {
    res.status(500).send("server error");
  }
});

router.get("/github/:username", async (req, res) => {
  console.log(req.params.username);
  console.log(config.get("githubClientID"));
  console.log(config.get("githubClientSecret"));
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&
      sort=created:asc&client_id=${config.get(
        "githubClientID"
      )}&client_secret=${config.get("githubClientSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No Github profile found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
});

module.exports = router;
