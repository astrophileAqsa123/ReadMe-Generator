require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

require("./config/passport");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,              // required for sessions to work cross-origin
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }  // 1 day
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/api/repos", require("./routes/repo"));
app.use("/api/readme", require("./routes/readme"));

app.listen(5000, () => console.log("Server running on port 5000"));