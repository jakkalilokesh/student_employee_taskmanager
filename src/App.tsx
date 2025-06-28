import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';

import { LoginPage } from './components/auth/LoginPage';
import { Tasks } from './pages/Tasks';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Archive from './pages/Archive';
import Calendar from './pages/Calendar';
import Important from './pages/Important';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("⛔ App rendering error:", error);
    return <div style={{ color: "red", padding: 20 }}>App failed to load due to an error.</div>;
  }
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/important" element={<Important />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<div className="p-10 text-center text-red-500">404 - Page not found</div>} />
            </Routes>
          </ErrorBoundary>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
