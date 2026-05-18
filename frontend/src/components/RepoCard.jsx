import { useNavigate } from "react-router-dom";

function RepoCard({ repo }) {
  const navigate = useNavigate();

  return (
    <div className="repo-card">
      <div className="repo-top">
        <h3>{repo.name}</h3>

        <span className={repo.private ? "private-badge" : "public-badge"}>
          {repo.private ? "Private" : "Public"}
        </span>
      </div>

      <p className="repo-description">
        {repo.description || "No description available."}
      </p>

      <div className="repo-meta">
        <div className="repo-language">
          <span className="language-dot"></span>
          {repo.language || "Unknown"}
        </div>

        <div>⭐ {repo.stargazers_count}</div>
      </div>

      <button
        className="primary-btn full-width"
        onClick={() =>
          navigate(`/generate/${repo.owner.login}/${repo.name}`, {
            state: { repo }
          })
        }
      >
        Generate README
      </button>
    </div>
  );
}

export default RepoCard;