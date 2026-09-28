import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../Hooks/hooks";

const PublicRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
