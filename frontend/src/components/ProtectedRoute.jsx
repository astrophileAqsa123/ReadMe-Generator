import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";
import LoadingSpinner from "./LoadingSpinner";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/me");
        setAuthorized(true);
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="center-screen">
        <LoadingSpinner text="Authenticating..." />
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;