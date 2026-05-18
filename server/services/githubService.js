const axios = require("axios");

const githubAPI = (token) =>
  axios.create({
    baseURL: "https://api.github.com",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

// Fetch all repos (public + private)
const getUserRepos = async (token) => {
  const api = githubAPI(token);
  const { data } = await api.get("/user/repos?per_page=100&sort=updated&type=all");
  return data.map((repo) => ({
  id: repo.id,
  name: repo.name,
  fullName: repo.full_name,
  description: repo.description,
  private: repo.private,
  language: repo.language,
  stargazers_count: repo.stargazers_count,
  updatedAt: repo.updated_at,
  defaultBranch: repo.default_branch,

  owner: {
    login: repo.owner.login,
  },
}));
};

// Fetch file tree of repo
const getRepoTree = async (token, owner, repo, branch = "main") => {
  const api = githubAPI(token);
  const { data } = await api.get(
    `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );
  return data.tree
    .filter((f) => f.type === "blob")
    .map((f) => f.path);
};

// Fetch a single file's content (decoded from base64)
const getFileContent = async (token, owner, repo, filePath) => {
  try {
    const api = githubAPI(token);
    const { data } = await api.get(`/repos/${owner}/${repo}/contents/${filePath}`);
    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch {
    return null;
  }
};

// Push README.md to repo
const pushReadme = async (token, owner, repo, content, branch = "main") => {
  const api = githubAPI(token);

  // Check if README already exists (need its SHA to update)
  let sha;
  try {
    const { data } = await api.get(`/repos/${owner}/${repo}/contents/README.md`);
    sha = data.sha;
  } catch {
    sha = undefined; // File doesn't exist yet — that's fine
  }

  await api.put(`/repos/${owner}/${repo}/contents/README.md`, {
    message: "docs: generate README via README Generator",
    content: Buffer.from(content).toString("base64"),
    branch,
    ...(sha && { sha }),  // only include sha if file exists
  });
};

module.exports = { getUserRepos, getRepoTree, getFileContent, pushReadme };