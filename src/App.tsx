import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactUs from './pages/ContactUs';

import CitizenLayout from './layouts/CitizenLayout';
import GovernmentLayout from './layouts/GovernmentLayout';

import CitizenDashboard from './pages/citizen/CitizenDashboard';
import SubmitRequest from './pages/citizen/SubmitRequest';
import VoiceRequest from './pages/citizen/VoiceRequest';
import MyRequests from './pages/citizen/MyRequests';
import RequestDetails from './pages/citizen/RequestDetails';
import CitizenProfile from './pages/citizen/CitizenProfile';

import GovOverview from './pages/government/GovOverview';
import MyRequestsGov from './pages/government/MyRequestsGov';
import DepartmentRequests from './pages/government/DepartmentRequests';
import GovAnalytics from './pages/government/GovAnalytics';
import GovRequests from './pages/government/GovRequests';
import DemandHotspots from './pages/government/DemandHotspots';
import Regions from './pages/government/Regions';
import AIRecommendations from './pages/government/AIRecommendations';
import Projects from './pages/government/Projects';
import Impact from './pages/government/Impact';
import DataSources from './pages/government/DataSources';

import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= LANDING PAGE ================= */}
        <Route path="/" element={<LandingPage />} />

        {/* ================= LOGIN PAGE ================= */}
        <Route path="/login" element={<LoginPage />} />

        {/* ================= REGISTER PAGE ================= */}
        <Route path="/register" element={<RegisterPage />} />

        {/* ================= CONTACT US PAGE ================= */}
        <Route path="/contact" element={<ContactUs />} />

        {/* ================= CITIZEN ROUTES ================= */}
        <Route
          path="/citizen"
          element={
            <ProtectedRoute portal="citizen">
              <CitizenLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CitizenDashboard />} />
          <Route path="dashboard" element={<CitizenDashboard />} />
          <Route path="submit" element={<SubmitRequest />} />
          <Route path="voice" element={<VoiceRequest />} />
          <Route path="requests" element={<MyRequests />} />
          <Route path="track" element={<MyRequests />} />
          <Route path="history" element={<MyRequests />} />
          <Route path="requests/:id" element={<RequestDetails />} />
          <Route path="profile" element={<CitizenProfile />} />
        </Route>

        {/* ================= GOVERNMENT ROUTES ================= */}
        <Route
          path="/government"
          element={
            <ProtectedRoute portal="government">
              <GovernmentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<GovOverview />} />
          <Route path="overview" element={<GovOverview />} />
          <Route path="my-requests" element={<MyRequestsGov />} />
          <Route path="department-requests" element={<DepartmentRequests />} />
          <Route path="analytics" element={<GovAnalytics />} />
          <Route path="requests" element={<GovRequests />} />
          <Route path="hotspots" element={<DemandHotspots />} />
          <Route path="regions" element={<Regions />} />
          <Route path="regions/:id" element={<Regions />} />
          <Route path="recommendations" element={<AIRecommendations />} />
          <Route path="priority" element={<AIRecommendations />} />
          <Route path="projects" element={<Projects />} />
          <Route path="impact" element={<Impact />} />
          <Route path="datasources" element={<DataSources />} />
        </Route>

        {/* ================= UNKNOWN URL ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;