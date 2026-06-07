require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const MemoryStore = require("memorystore")(session);

require("./config/passport");

const app = express();

app.set("trust proxy", 1);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000, // prune expired entries every 24h
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: "none",
    httpOnly: true,
  }
}));

app.use(passport.initialize());
app.use(passport.session());



app.use("/auth", require("./routes/auth"));
app.use("/api/repos", require("./routes/repo"));
app.use("/api/readme", require("./routes/readme"));

app.listen(5000, () => console.log("Server running on port 5000"));
