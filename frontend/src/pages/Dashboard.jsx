import { useEffect, useMemo, useState } from "react";

import api from "../api/axios";

import Navbar from "../components/Navbar";
import RepoCard from "../components/RepoCard";
import LoadingSpinner from "../components/LoadingSpinner";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/auth/me");
        setUser(userRes.data);

        const repoRes = await api.get("/api/repos");
        setRepos(repoRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      const matchesSearch = repo.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All"
          ? true
          : filter === "Public"
          ? !repo.private
          : repo.private;

      return matchesSearch && matchesFilter;
    });
  }, [repos, search, filter]);

  return (
    <div className="dashboard-page">
      <Navbar user={user} />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Your Repositories</h1>

          <input
            type="text"
            placeholder="Search repositories..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="filter-tabs">
            {["All", "Public", "Private"].map((tab) => (
              <button
                key={tab}
                className={filter === tab ? "active-tab" : ""}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="center-screen">
            <LoadingSpinner text="Fetching repositories..." />
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="empty-state">
            No repositories found.
          </div>
        ) : (
          <div className="repo-grid">
            {filteredRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;