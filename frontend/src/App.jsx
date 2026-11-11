import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import ScrollToTop from './components/layout/ScrollToTop'

// Pages publiques
import HomePage from './pages/public/HomePage'
import ExploreAnimalsPage from './pages/public/ExploreAnimalsPage'
import AnimalDetailPage from './pages/public/AnimalDetailPage'
import DemandeAdoptionPage from './pages/public/DemandeAdoptionPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import NotFoundPage from './pages/public/NotFoundPage'

// Pages internes de gestion du personnel
import PersonnelLayout from './components/layout/PersonnelLayout'
import PersonnelDashboard from './pages/personnel/PersonnelDashboard'
import GestionAnimauxPage from './pages/personnel/GestionAnimauxPage'
import GestionDemandesPage from './pages/personnel/GestionDemandesPage'
import DossiersMedicauxPage from './pages/personnel/DossiersMedicauxPage'
import GestionDonsPage from './pages/personnel/GestionDonsPage'
import EquipePersonnelPage from './pages/personnel/EquipePersonnelPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            {/* Routes publiques */}
            <Route index element={<HomePage />} />
            <Route path="animaux" element={<ExploreAnimalsPage />} />
            <Route path="animaux/:id" element={<AnimalDetailPage />} />
            <Route path="adopter/:id" element={<DemandeAdoptionPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Routes privées du personnel du refuge */}
            <Route
              path="personnel"
              element={
                <ProtectedRoute>
                  <PersonnelLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PersonnelDashboard />} />
              <Route path="animaux" element={<GestionAnimauxPage />} />
              <Route path="demandes" element={<GestionDemandesPage />} />
              <Route path="dossiers-medicaux" element={<DossiersMedicauxPage />} />
              <Route path="dons" element={<GestionDonsPage />} />
              <Route path="equipe" element={<EquipePersonnelPage />} />
            </Route>

            {/* Page 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
