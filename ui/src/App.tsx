import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './lib/auth-context'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import OnboardingPage from './pages/auth/OnboardingPage'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import GeneratePage from './pages/dashboard/GeneratePage'
import ReportsPage from './pages/dashboard/ReportsPage'
import ReportDetailPage from './pages/dashboard/ReportDetailPage'
import HistoryPage from './pages/dashboard/HistoryPage'
import ProfilePage from './pages/dashboard/ProfilePage'
import SettingsPage from './pages/dashboard/SettingsPage'
import { Box, CircularProgress } from '@mui/material'

function ProtectedRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#5B5BD6' }} />
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/:id" element={<ReportDetailPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
