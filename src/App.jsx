import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import MaintenancePage from './pages/MaintenancePage.jsx';
import AdminPage from './pages/AdminPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/maintenance" element={<MaintenancePage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}
