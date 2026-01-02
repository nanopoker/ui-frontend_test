import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// Get base path from import.meta.env for GitHub Pages compatibility
// Remove trailing slash for React Router basename (but keep '/' for root)
const rawBasePath = import.meta.env.BASE_URL || '/';
const basePath = rawBasePath === '/' ? '/' : rawBasePath.replace(/\/$/, '');

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router basename={basePath}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

