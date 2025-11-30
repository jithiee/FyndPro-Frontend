// routes/PublicRoute.jsx
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // If logged in → redirect to home
  // if (user) {
  //   return <Navigate to="/" replace />;
  // }

  return children;
}
