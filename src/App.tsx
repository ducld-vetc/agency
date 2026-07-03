import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DeviceChrome from './components/DeviceChrome';
import HomePage from './pages/HomePage';
import ServicePointCommissionPage from './pages/service-point/ServicePointCommissionPage';
import ServicePointDetailPage from './pages/service-point/ServicePointDetailPage';
import ServicePointHubPage from './pages/service-point/ServicePointHubPage';
import ServicePointListPage from './pages/service-point/ServicePointListPage';
import ServicePointRegisterPage from './pages/service-point/ServicePointRegisterPage';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/service-point" element={<ServicePointHubPage />} />
    <Route path="/service-point/register" element={<ServicePointRegisterPage />} />
    <Route path="/service-point/points" element={<ServicePointListPage />} />
    <Route path="/service-point/points/:id" element={<ServicePointDetailPage />} />
    <Route path="/service-point/commission" element={<ServicePointCommissionPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App: React.FC = () => (
  <div className="am-preview-frame">
    <div className="am-iphone-frame">
      <div className="am-device am-device--chrome">
        <DeviceChrome />
        <div className="am-device__app">
          <AppRoutes />
        </div>
      </div>
    </div>
    <p className="am-preview-hint">
      Preview — Agency app v3.0 · DLS v1.2 · Dữ liệu mẫu
    </p>
  </div>
);

export default App;
