import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../Hooks/hooks";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
