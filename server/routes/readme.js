const router = require("express").Router();
const isAuth = require("../middleware/isAuth");
const { generateReadme } = require("../services/groqService");
const { pushReadme } = require("../services/githubService");

// Generate README
router.post("/generate", isAuth, async (req, res) => {
  try {
    const {
  repoName,
  description,
  language,
  fileTree,
  keyFiles,
  feedback,
  currentReadme
} = req.body;

const readme = await generateReadme({
  repoName,
  description,
  language,
  fileTree,
  keyFiles,
  feedback,
  currentReadme
});
    res.json({ readme });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Push README to repo
router.post("/push", isAuth, async (req, res) => {
  try {
    const { owner, repo, content, branch } = req.body;
    await pushReadme(req.user.accessToken, owner, repo, content, branch);
    res.json({ success: true, message: "README pushed successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;