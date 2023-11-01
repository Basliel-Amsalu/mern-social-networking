const express = require("express");
const { check, validationResult } = require("express-validator");
const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const config = require("config");

const router = express.Router();

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "please enter a password thats 6 or more characters "
    ).isLength({ min: 6 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          errors: [{ msg: "user already exists" }],
        });
      }
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const newUser = await User.create({ avatar, name, email, password });

      const salt = await bcrypt.genSalt(10);

      newUser.password = await bcrypt.hash(password, salt);

      await newUser.save();

      const payload = {
        user: {
          id: newUser.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({
            message: "Success",
            user: newUser, // Include the user object
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
