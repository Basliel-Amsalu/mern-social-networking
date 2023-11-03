const express = require("express");
const auth = require("../../middleware/auth");
const Post = require("../../models/postModel");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("posts route");
});

router.post("/", auth, async (req, res) => {
  newPost = {}
  newPost.user = req.user.id
  try {
    const post = await Post.create()
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});
module.exports = router;
