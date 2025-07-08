import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import "./index.css";
import AgentDetailPage from "./pages/AgentDetailPage";
import AgentsPage from "./pages/AgentsPage";
import AnalysisPage from "./pages/AnalysisPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import MapPage from "./pages/MapPage";
import QuotaPage from "./pages/QuotaPage";
import RecipientsDetailPage from "./pages/RecipientsDetailPage";
import RecipientsPage from "./pages/RecipientsPage";
import SettingsPage from "./pages/SettingsPage";
import TransactionDetailPage from "./pages/TransactionDetailPage";
import TransactionsPage from "./pages/TransactionsPage";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="recipients" element={<RecipientsPage />} />
        <Route path="recipients/:id" element={<RecipientsDetailPage />} />
        <Route path="quota" element={<QuotaPage />} />
        <Route path="agents" element={<AgentsPage />} />
        <Route path="agents/:id" element={<AgentDetailPage />} />
        <Route path="analysis" element={<AnalysisPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="transactions/:id" element={<TransactionDetailPage />} />
        <Route path="complaints" element={<ComplaintsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="map" element={<MapPage />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
