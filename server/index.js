require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

require("./config/passport");

const app = express();

app.set("trust proxy", 1);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))
app.use(express.json());
app.set("trust proxy", 1);


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,        // ← required on HTTPS (Render)
    sameSite: "none",    // ← required for cross-site cookies
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.get("/debug", (req, res) => {
  res.json({
    sessionID: req.sessionID,
    user: req.user || null,
    cookies: req.headers.cookie || "NO COOKIES RECEIVED",
    CLIENT_URL: process.env.CLIENT_URL,
    SERVER_URL: process.env.SERVER_URL,
  });
});
// Routes
app.use("/auth", require("./routes/auth"));
app.use("/api/repos", require("./routes/repo"));
app.use("/api/readme", require("./routes/readme"));

app.listen(5000, () => console.log("Server running on port 5000"));
