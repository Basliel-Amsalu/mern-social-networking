const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  console.log(token);

  if (!token) {
    return res.status(401).json({
      message: "no token, authorization failed",
    });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({
      message: "token is not valid",
    });
  }
};
