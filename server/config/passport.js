const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/github/callback`,
      scope: ["repo", "user:email"],  // "repo" = access private repos + push
    },
    (accessToken, refreshToken, profile, done) => {
      // Attach accessToken to profile — you'll need it for API calls
      const user = {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        avatar: profile.photos[0]?.value,
        accessToken,  // store this — critical for GitHub API calls
      };
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));