function Home() {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>README Generator</h1>

        <p>
          Connect your GitHub. Pick a repo.
          Get a perfect README in seconds.
        </p>

        <a
          href="https://readme-generator-j37b.onrender.com/auth/github"
          className="github-btn"
        >
          Login with GitHub
        </a>

        <div className="feature-pills">
          <span>Public & Private Repos</span>
          <span>AI-Powered by Groq</span>
          <span>Push Directly to GitHub</span>
        </div>
      </div>
    </div>
  );
}

export default Home;
