const express = require("express");
const { check, validationResult } = require("express-validator");

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
    const errors = validationResult(req)
    try {
        
    } catch (err) {}
    //   res.send("user route");
  }
);

module.exports = router;
