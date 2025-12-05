import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import CaseDetails from './pages/CaseDetails';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter basename="/">
      <AdminProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/case/:caseNumber" element={<CaseDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  );
}

export default App;
