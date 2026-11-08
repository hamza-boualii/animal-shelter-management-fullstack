import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../utils/constantes'

export default function ProtectedRoute({ children, roleRequis = ROLES.PERSONNEL }) {
  const { utilisateur, estConnecte } = useAuth()
  const location = useLocation()

  if (!estConnecte || (roleRequis && utilisateur?.role !== roleRequis)) {
    return <Navigate to="/login" state={{ redirection: location.pathname }} replace />
  }

  return children
}
