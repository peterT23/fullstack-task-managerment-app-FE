import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

function AuthRequire({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) return <LoadingScreen />;

  if (!isAuthenticated)
    return <Navigate to="login" state={{ from: location }} replace />;
  // save the current location for later navigating  after authentication
  return children;
}

export default AuthRequire;
