import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Playground from './pages/Playground';
import PlaygroundCallbackPage from './pages/PlaygroundCallbackPage';
import Support from './pages/Support';
import ApiDocPage from './pages/api/ApiDocPage';

import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import ApiManagement from './pages/admin/ApiManagement';
import InquiryManagement from './pages/admin/InquiryManagement';
import { useAuthStore } from './hooks/useAuth';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/api" element={<ApiDocPage />} />
        <Route path="/api/:slug" element={<ApiDocPage />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/playground/:resultType" element={<PlaygroundCallbackPage />} />
        <Route path="/support" element={<Support />} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/api"
          element={
            <AdminRoute>
              <ApiManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/support"
          element={
            <AdminRoute>
              <InquiryManagement />
            </AdminRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
