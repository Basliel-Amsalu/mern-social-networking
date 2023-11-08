const express = require("express");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/userModel");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      message: "success",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "server error",
      err,
    });
  }
});

router.post(
  "/",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "please enter a password").exists(),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          message: "invalid credentials",
        });
      }

      const isMatched = await bcrypt.compare(password, user.password);

      if (!isMatched) {
        return res.status(400).json({
          message: "invalid credentials",
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            message: "Success",
            token,
          });
        }
      );
    } catch (err) {
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
