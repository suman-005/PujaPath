import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { AboutPage } from './pages/AboutPage'
import { AssistantPage } from './pages/AssistantPage'
import { ContactPage } from './pages/ContactPage'
import { EmergencyPage } from './pages/EmergencyPage'
import { ExplorePage } from './pages/ExplorePage'
import { GalleryPage } from './pages/GalleryPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { MapPage } from './pages/MapPage'
import { NearMePage } from './pages/NearMePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PujaDetailPage } from './pages/PujaDetailPage'
import { RegisterPage } from './pages/RegisterPage'
import { RoutesPage } from './pages/RoutesPage'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/puja/:id" element={<PujaDetailPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/near-me" element={<NearMePage />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
