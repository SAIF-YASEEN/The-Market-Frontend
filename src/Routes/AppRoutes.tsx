import { Routes, Route } from "react-router-dom";
import RegisterForm from "../Components/Register/RegisterForm";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>The Market</div>} />
      <Route path="/register" element={<RegisterForm />} />

      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default AppRoutes;
