import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Pages publiques
import HomePage from './pages/public/HomePage'
import ExploreAnimalsPage from './pages/public/ExploreAnimalsPage'
import AnimalDetailPage from './pages/public/AnimalDetailPage'
import DemandeAdoptionPage from './pages/public/DemandeAdoptionPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import NotFoundPage from './pages/public/NotFoundPage'

// Pages internes de gestion du personnel
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
                  <PersonnelDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="personnel/animaux"
              element={
                <ProtectedRoute>
                  <GestionAnimauxPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="personnel/demandes"
              element={
                <ProtectedRoute>
                  <GestionDemandesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="personnel/dossiers-medicaux"
              element={
                <ProtectedRoute>
                  <DossiersMedicauxPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="personnel/dons"
              element={
                <ProtectedRoute>
                  <GestionDonsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="personnel/equipe"
              element={
                <ProtectedRoute>
                  <EquipePersonnelPage />
                </ProtectedRoute>
              }
            />

            {/* Page 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
