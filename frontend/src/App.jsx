import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Generator from "./pages/Generator";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/generate/:owner/:repo"
        element={
          <ProtectedRoute>
            <Generator />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;