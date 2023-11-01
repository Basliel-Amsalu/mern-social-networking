const express = require("express");
const auth = require("../../middleware/auth");
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

module.exports = router;
