import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState, type JSX } from 'react'
import type { User } from 'firebase/auth'
import  { onAuthStateChanged} from 'firebase/auth'
import { auth } from './firebase'
import { useAppDispatch, useAppSelector } from './store/hook'
import { hydrateUserProgress, setCurrentUser } from './store/Slices/progressSlice'
import { readUserProgress, saveUserProgress } from './utils/userStorage'
import { readUserRole } from './utils/workoutAdmin'

import Navbar from './components/layout/Navbar'
import HomePage from './pages/HomePage'
import WorkoutsPage from './pages/WorkoutsPage'
import WorkoutDetailPage from './pages/WorkoutDetailPage'
import PricingPage from './pages/PricingPage'
import DashboardPage from './pages/DashboardPage'
import ProgressPage from './pages/ProgressPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProfilePage from './pages/ProfilePage'
import Success from './pages/Success'
import WorkoutDetail from './pages/WorkoutDetailPage'
import AdminWorkoutsPage from './pages/AdminWorkoutsPage'
import AdminPage from './pages/AdminPage'
// Protected route wrapper
function ProtectedRoute({ user, children }: { user: User | null, children: JSX.Element }) {
  if (!user) return <Navigate to="/login" replace />
  return children
}
function AdminRoute({
  user,
  isAdmin,
  children,
}: {
  user: User | null
  isAdmin: boolean
  children: JSX.Element
}) {
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user')
  const dispatch = useAppDispatch()
  const byUser = useAppSelector((state) => state.progress.byUser)
  
  useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (u) => {
    setUser(u)
    dispatch(setCurrentUser(u?.uid ?? null))

    if (u?.uid) {
      // get role for navbar
      const role = await readUserRole(u.uid)
      setUserRole(role)
      setIsAdmin(role === 'admin')

      // load progress into Redux
      const progress = await readUserProgress(u.uid)
      dispatch(hydrateUserProgress({ userId: u.uid, progress }))
    } else {
      setUserRole('user')
      setIsAdmin(false)
    }

    setLoading(false)
  })
  return () => unsub()
}, [dispatch])

  useEffect(() => {
    if (!user?.uid) return
    const userProgress = byUser[user.uid]
    if (!userProgress) return
    void saveUserProgress(user.uid, userProgress)
  }, [byUser, user?.uid])

  if (loading) return (
    <div className="min-h-screen bg-[#090c10] flex items-center justify-center">
      <div className="text-[#4ade80] text-xl font-display animate-pulse">Loading FitZone...</div>
    </div>
  )

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#090c10]">
        <Navbar user={user} userRole={userRole} />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage />} />
          <Route path="/success" element={<Success />} />

          {/* Protected routes - must be logged in */}
          <Route path="/dashboard" element={
            <ProtectedRoute user={user}>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute user={user}>
              <ProgressPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute user={user}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/admin/workouts" element={
            <AdminRoute user={user} isAdmin={isAdmin}>
              <AdminWorkoutsPage />
            </AdminRoute>
          } />
          <Route path="/workouts/:id" element={<WorkoutDetail />} />
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />      <Route path="/admin" element={
  <ProtectedRoute user={user}>
    <AdminPage />
  </ProtectedRoute>
} />
        </Routes>
  
      </div>
    </BrowserRouter>
  )
}