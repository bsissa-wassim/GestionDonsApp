// src/App.jsx
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

import HomePage from './components/HomePage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import DonorDashboard from './components/DonorDashboard'
import AdminDashboard from './components/AdminDashboard'
import DonationModal from './components/DonationModal'
import TransporterDashboard from './components/TransporterDashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [showDonation, setShowDonation] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserRole(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserRole(session.user.id)
      } else {
        setUserRole(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('roles')
        .eq('id', userId)
        .single()

      if (error) throw error
      const roles = data?.roles || ['user']
      setUserRole(roles)
    } catch (error) {
      console.error('Error fetching user role:', error)
      setUserRole(['user'])
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = () => {
    setCurrentPage('signin')
  }

  const handleSignUp = () => {
    setCurrentPage('signup')
  }

  const handleBack = () => {
    setCurrentPage('home')
  }

  const handleLoginSuccess = async (user) => {
    setUser(user)

    // Fetch user role for navigation decision
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('roles')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        setCurrentPage('donorDashboard')
        return
      }

      const roles = profile?.roles || []
      setUserRole(roles)

      if (roles.includes('transporteur')) {
        setCurrentPage('transporterDashboard')
      } else if (roles.includes('admin')) {
        setCurrentPage('adminDashboard')
      } else {
        setCurrentPage('donorDashboard')
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      setCurrentPage('donorDashboard')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserRole(null)
    setCurrentPage('home')
  }

  const handleNavigateToDonorDashboard = () => {
    setCurrentPage('donorDashboard')
  }

  const handleNavigateToAdminDashboard = () => {
    setCurrentPage('adminDashboard')
  }

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Chargement...</div>
  }

  if (currentPage === 'signin') {
    return (
      <SignIn
        onBack={handleBack}
        onSwitchToSignUp={() => setCurrentPage('signup')}
        onLoginSuccess={handleLoginSuccess}
      />
    )
  }

  if (currentPage === 'signup') {
    return (
      <SignUp
        onBack={handleBack}
        onSwitchToSignIn={() => setCurrentPage('signin')}
      />
    )
  }

  if (currentPage === 'donorDashboard') {
    return (
      <DonorDashboard
        user={user}
        onBack={handleBack}
      />
    )
  }

  if (currentPage === 'adminDashboard') {
    return (
      <AdminDashboard
        user={user}
        onBack={handleBack}
      />
    )
  }

  if (currentPage === 'transporterDashboard') {
    return (
      <TransporterDashboard
        user={user}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <>
      <HomePage
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        user={user}
        onLogout={handleLogout}
        onNavigateToDonorDashboard={handleNavigateToDonorDashboard}
        onNavigateToAdminDashboard={handleNavigateToAdminDashboard}
        onDonate={() => setShowDonation(true)}
      />
      {showDonation && (
        <DonationModal onClose={() => setShowDonation(false)} />
      )}
    </>
  )
}

export default App