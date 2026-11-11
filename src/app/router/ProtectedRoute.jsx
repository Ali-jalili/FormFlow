/** @format */

import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../../components/ui/Spinner";
import useAuth from "../../features/Auth/useAuth";

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Spinner />;
  if (!user)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  return children;
}

export default ProtectedRoute;
