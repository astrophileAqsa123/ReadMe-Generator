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

  const generateReadme = async (customFeedback = "") => {
    try {
      setLoading(true);

      let currentContext = context;

      if (!currentContext) {
        const contextRes = await api.get(
          `/api/repos/${owner}/${repo}/context`
        );

        currentContext = contextRes.data;
        setContext(currentContext);
      }

      const payload = {
        repoName: repo,
        description: repoData?.description || "",
        language: repoData?.language || "",
        fileTree: currentContext.fileTree,
        keyFiles: currentContext.keyFiles,
        feedback: customFeedback,
        currentReadme: markdown
      };

      const readmeRes = await api.post(
        "/api/readme/generate",
        payload
      );

      setMarkdown(readmeRes.data.readme || readmeRes.data);
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

  useEffect(() => {
    generateReadme();
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
    await navigator.clipboard.writeText(markdown);

    setToast({
      type: "success",
      message: "Copied to clipboard"
    });
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
        <div className="left-panel">
          <h2>Generated README</h2>

          {loading ? (
            <div className="center-screen">
              <LoadingSpinner text="Analyzing repository..." />
            </div>
          ) : (
            <MarkdownPreview content={markdown} />
          )}
        </div>

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
            >
              Generate New ReadMe
            </button>

            <textarea
              placeholder="Request changes..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <button
              className="secondary-btn full-width"
              onClick={() => generateReadme(feedback)}
            >
              Refine with AI
            </button>

            <div className="divider"></div>

            <button
              className="primary-btn full-width push-btn"
              onClick={pushToGithub}
            >
              Push to GitHub
            </button>

            <button
              className="secondary-btn full-width"
              onClick={copyMarkdown}
            >
              Copy to Clipboard
            </button>
          </div>

          <div className="file-tree">
            <h3>Detected Files</h3>

            {context?.fileTree?.map((file, index) => (
              <div key={index} className="file-item">
                {file}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Generator;
