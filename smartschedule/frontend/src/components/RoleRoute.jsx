import { Navigate } from "react-router-dom";
import { getUser } from "../api/auth";

export default function RoleRoute({ children, role }) {
  const user = getUser();

  if (!user) return <Navigate to="/" />;
  if (user.role !== role) return <Navigate to="/dashboard" />;

  return children;
}