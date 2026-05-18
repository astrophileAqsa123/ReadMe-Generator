function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="loading-container">
      <div className="terminal-loader"></div>
      <p>{text}</p>
    </div>
  );
}

export default LoadingSpinner;