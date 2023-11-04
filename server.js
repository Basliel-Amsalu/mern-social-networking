const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
connectDB();

app.use(express.json({ extended: false }));
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("api running");
});
app.use("/api/users/", require("./Routes/api/user"));
app.use("/api/auth/", require("./Routes/api/auth"));
app.use("/api/profile/", require("./Routes/api/profile"));
app.use("/api/posts/", require("./Routes/api/posts"));

app.listen(PORT, () => {
  console.log("server started");
});
