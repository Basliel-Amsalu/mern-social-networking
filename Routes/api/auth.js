const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("atuh route");
});

module.exports = router;
