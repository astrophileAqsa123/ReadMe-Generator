const router = require("express").Router();
const passport = require("passport");

// Step 1: redirect to GitHub
router.get("/github", passport.authenticate("github"));

// Step 2: GitHub redirects back here
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

// Get current logged-in user
router.get("/me", (req, res) => {
  if (req.user) return res.json(req.user);
  res.status(401).json({ error: "Not logged in" });
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => res.json({ success: true }));
});

module.exports = router;