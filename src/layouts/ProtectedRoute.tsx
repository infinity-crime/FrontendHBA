import { Navigate } from "react-router-dom";

interface ProtectedProps {
  children: React.ReactNode;  
}

export const ProtectedRoute = ({ children }: ProtectedProps) => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
