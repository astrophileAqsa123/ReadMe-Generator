import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import api from "../api/axios";

import MarkdownPreview from "../components/Markdownpreview";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";

function Generator() {
  const navigate = useNavigate();
  const location = useLocation();

  const { owner, repo } = useParams();

  const repoData = location.state?.repo;

  const [context, setContext] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [toast, setToast] = useState(null);

  // Fetch repository context only
  const fetchContext = async () => {
    try {
      setLoading(true);

      const contextRes = await api.get(
        `/api/repos/${owner}/${repo}/context`
      );

      setContext(contextRes.data);
    } catch (error) {
      console.error(error);

      setToast({
        type: "error",
        message: "Failed to analyze repository"
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate README manually
  const generateReadme = async (customFeedback = "") => {
    try {
      setLoading(true);

      const payload = {
        repoName: repo,
        description: repoData?.description || "",
        language: repoData?.language || "",
        fileTree: context?.fileTree || [],
        keyFiles: context?.keyFiles || [],
        feedback: customFeedback,

        // Empty on regenerate, keep current on refine
        currentReadme: customFeedback ? markdown : ""
      };

      const readmeRes = await api.post(
        "/api/readme/generate",
        payload
      );

      setMarkdown(readmeRes.data.readme || readmeRes.data);

      setToast({
        type: "success",
        message: customFeedback
          ? "README refined successfully"
          : "README generated successfully"
      });
    } catch (error) {
      console.error(error);

      setToast({
        type: "error",
        message: "Failed to generate README"
      });
    } finally {
      setLoading(false);
    }
  };

  // Only analyze repository on load
  useEffect(() => {
    fetchContext();
  }, []);

  const pushToGithub = async () => {
    try {
      await api.post("/api/readme/push", {
        owner,
        repo,
        content: markdown,
        branch: "main"
      });

      setToast({
        type: "success",
        message: "README pushed to GitHub!"
      });
    } catch {
      setToast({
        type: "error",
        message: "Failed to push README"
      });
    }
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);

      setToast({
        type: "success",
        message: "Copied to clipboard"
      });
    } catch {
      setToast({
        type: "error",
        message: "Failed to copy"
      });
    }
  };

  return (
    <div className="generator-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="generator-topbar">
        <button
          className="secondary-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back
        </button>
      </div>

      <div className="generator-layout">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <h2>Generated README</h2>

          {loading ? (
            <div className="center-screen">
              <LoadingSpinner text="Analyzing repository..." />
            </div>
          ) : markdown ? (
            <MarkdownPreview content={markdown} />
          ) : (
            <div className="empty-state">
              <h3>No README Generated Yet</h3>

              <p>
                Click the button on the right to generate a
                professional README using AI.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="action-card">
            <h2>{repo}</h2>

            <div className="repo-info-line">
              <span>{repoData?.language || "Unknown"}</span>
              <span>main</span>
            </div>

            <button
              className="primary-btn full-width"
              onClick={() => generateReadme()}
              disabled={loading || !context}
            >
              Generate README
            </button>

            <textarea
              placeholder="Request changes..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <button
              className="secondary-btn full-width"
              onClick={() => generateReadme(feedback)}
              disabled={!markdown || loading}
            >
              Refine with AI
            </button>

            <div className="divider"></div>

            <button
              className="primary-btn full-width push-btn"
              onClick={pushToGithub}
              disabled={!markdown}
            >
              Push to GitHub
            </button>

            <button
              className="secondary-btn full-width"
              onClick={copyMarkdown}
              disabled={!markdown}
            >
              Copy to Clipboard
            </button>
          </div>

          <div className="file-tree">
            <h3>Detected Files</h3>

            {loading ? (
              <LoadingSpinner text="Scanning files..." />
            ) : context?.fileTree?.length ? (
              context.fileTree.map((file, index) => (
                <div key={index} className="file-item">
                  {file}
                </div>
              ))
            ) : (
              <p>No files detected</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Generator;
