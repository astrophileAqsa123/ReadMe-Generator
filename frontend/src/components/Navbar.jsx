import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">README Generator</div>

      <div className="navbar-right">
        <img
          src={user?.avatar_url}
          alt="avatar"
          className="avatar"
        />

        <span className="username">{user?.login}</span>

        <button className="secondary-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;