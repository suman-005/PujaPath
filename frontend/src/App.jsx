import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SOSButton from './components/emergency/SOSButton';
import ErrorBoundary from './components/common/ErrorBoundary';

// Route-level code splitting for optimal production performance
const PujasPage = lazy(() => import('./pages/PujasPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const PujaDetailPage = lazy(() => import('./pages/PujaDetailPage'));
const AssistantPage = lazy(() => import('./pages/AssistantPage'));

function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        color: '#666',
        fontSize: '15px',
      }}
    >
      Loading...
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Navbar />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<PujasPage />} />
            <Route path="/pujas" element={<PujasPage />} />
            <Route path="/puja/:id" element={<PujaDetailPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
          </Routes>
        </Suspense>
        <SOSButton />
      </Router>
    </ErrorBoundary>
  );
}

export default App;