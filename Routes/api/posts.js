const express = require("express");
const auth = require("../../middleware/auth");
const Post = require("../../models/postModel");
const { check, validationResult } = require("express-validator");
const User = require("../../models/userModel");
const Profile = require("../../models/profileModel");
const router = express.Router();

router.post(
  "/",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      console.log(user);
      let newPost = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };

      console.log(newPost);
      const post = await Post.create(newPost);

      res.status(201).json({
        message: "successfully posted",
        post,
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.status(200).json({
      message: "success",
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error,
    });
  }
});
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        msg: "post not found",
      });
    }

    res.status(200).json({
      message: "success",
      post,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        msg: "post not found",
      });
    }
    res.status(500).json({
      message: "server error",
      error,
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        msg: "post not found",
      });
    }
    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "You are unauthorized to delete this post" });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).send("success");
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        msg: "post not found",
      });
    }
    res.status(500).json({
      message: "server error",
      error,
    });
  }
});

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const alreadyLiked = post.likes.find(
      (like) => like.user.toString() === req.user.id
    );

    console.log(alreadyLiked);

    if (!post) {
      return res.status(400).json({
        msg: "Post does not exist",
      });
    }
    if (alreadyLiked) {
      return res.status(400).json({
        message: "already liked",
      });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.status(200).json({
      message: "success",
      post,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        msg: "post not found",
      });
    }
    res.status(500).json({
      message: "server error",
      error,
    });
  }
});

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res
        .status(400)
        .json({ message: "You have not yet Liked this post" });
    }
    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );
    // const removeIndex = post.likes
    //   .map((exp) => exp._id)
    //   .indexOf(req.params.exp_id);

    // post.likes.splice(removeIndex, 1);
    console.log(post.likes);
    await post.save();

    res.status(200).json({
      message: "like removed",
      post,
    });
  } catch (err) {
    res.status(500).send("server error");
  }
});
router.post(
  "/comment/:id",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      let newComment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };

      if (!post) {
        return res.status(400).json({
          msg: "Post does not exist",
        });
      }

      post.comments.unshift(newComment);

      await post.save();

      res.status(200).json({
        message: "success",
        post,
      });
    } catch (error) {
      if (error.kind === "ObjectId") {
        return res.status(404).json({
          msg: "post not found",
        });
      }
      res.status(500).json({
        message: "server error",
        error,
      });
    }
  }
);

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  console.log(req.params);
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      (comment) => comment._id.toString() === req.params.comment_id
    );
    console.log(comment);
    if (!comment) {
      return res.status(400).json({ message: "comment not found" });
    }
    // console.log(comment);
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "user not authorized" });
    }
    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== req.params.comment_id
    );

    console.log(post.comments);
    await post.save();

    res.status(200).json({
      message: "comment removed",
    });
  } catch (err) {
    res.status(500).send("server error");
  }
});

module.exports = router;
