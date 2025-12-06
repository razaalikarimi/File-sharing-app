import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import SharedWithMePage from "./pages/SharedWithMePage";
import FileDetailsPage from "./pages/FileDetailsPage";
import LinkAccessPage from "./pages/LinkAccessPage";

const AppShell = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  const isActive = (path) =>
    location.pathname === path ? "app-link app-link-active" : "app-link";

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="app-shell">
      <header className="app-nav">
        <div className="app-nav-inner">
          <div className="app-logo">
            <div className="app-logo-icon">FS</div>
            <div>
              <div className="app-logo-text-main">FlowShare</div>
              <div className="app-logo-text-sub">Minimal drive clone</div>
            </div>
          </div>

          <nav className="app-nav-links">
            {isLoggedIn && (
              <>
                <Link className={isActive("/dashboard")} to="/dashboard">
                  My files
                </Link>
                <Link
                  className={isActive("/shared-with-me")}
                  to="/shared-with-me"
                >
                  Shared with me
                </Link>
              </>
            )}
          </nav>

          <div className="app-nav-right">
            {!isLoggedIn && (
              <>
                <Link className={isActive("/login")} to="/login">
                  Login
                </Link>
                <Link className={isActive("/register")} to="/register">
                  Register
                </Link>
              </>
            )}
            {isLoggedIn && (
              <button className="btn btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="app-main-inner">{children}</div>
      </main>
    </div>
  );
};

const App = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <AppShell>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shared-with-me"
          element={
            <ProtectedRoute>
              <SharedWithMePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/files/:id"
          element={
            <ProtectedRoute>
              <FileDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/access/:token"
          element={
            <ProtectedRoute>
              <LinkAccessPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppShell>
  );
};

export default App;
