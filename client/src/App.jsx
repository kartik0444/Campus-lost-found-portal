import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistantModal from './components/AIAssistantModal';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import PostLostItemPage from './pages/PostLostItemPage';
import PostFoundItemPage from './pages/PostFoundItemPage';
import ItemDetailPage from './pages/ItemDetailPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
          
          <Navbar onOpenAIModal={() => setIsAIModalOpen(true)} />

          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage onOpenAIModal={() => setIsAIModalOpen(true)} />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/items/:id" element={<ItemDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />

              {/* Student Protected Routes */}
              <Route
                path="/post-lost"
                element={
                  <ProtectedRoute>
                    <PostLostItemPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-found"
                element={
                  <ProtectedRoute>
                    <PostFoundItemPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>

          <Footer />

          {/* Global Gemini AI Matcher Modal */}
          <AIAssistantModal
            isOpen={isAIModalOpen}
            onClose={() => setIsAIModalOpen(false)}
          />

        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
