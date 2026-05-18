const router = require("express").Router();
const isAuth = require("../middleware/isAuth");
const { getUserRepos, getRepoTree, getFileContent } = require("../services/githubService");

// Get all user repos
router.get("/", isAuth, async (req, res) => {
  try {
    const repos = await getUserRepos(req.user.accessToken);
    res.json(repos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get repo context (tree + key files) for a specific repo
router.get("/:owner/:repo/context", isAuth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const token = req.user.accessToken;

    const fileTree = await getRepoTree(token, owner, repo);

    // Key files to look for
    const filesToFetch = [
  "package.json",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",

  "requirements.txt",
  "pyproject.toml",
  "Pipfile",

  "go.mod",
  "Cargo.toml",

  "Dockerfile",
  "docker-compose.yml",

  ".env.example",
  ".env",

  "README.md",

  "src/index.js",
  "src/main.js",
  "src/app.js",

  "main.py",
  "app.py",

  "vite.config.js",
  "next.config.js",

  "tailwind.config.js",
  "tsconfig.json",
]
.filter((f) => fileTree.includes(f));

    const keyFiles = await Promise.all(
      filesToFetch.map(async (name) => ({
        name,
        content: await getFileContent(token, owner, repo, name),
      }))
    );

    res.json({ fileTree, keyFiles: keyFiles.filter((f) => f.content) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;