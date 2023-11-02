const express = require("express");
const auth = require("../../middleware/auth");
const Profile = require("../../models/profileModel");
const User = require("../../models/userModel");
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
    await Profile.findOneAndDelete({ user: req.user.id });
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    res.status(500).send("server error");
  }
});

module.exports = router;
