import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import HomePage from './components/HomePage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import DonorDashboard from './components/DonorDashboard'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

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

    // Fetch user role from profiles table
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('roles')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        // Default to donor dashboard if error
        setCurrentPage('donorDashboard')
        return
      }

      // Check if user has admin role
      if (profile?.roles?.includes('admin')) {
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
    setCurrentPage('home')
  }

  const handleNavigateToDonorDashboard = () => {
    setCurrentPage('donorDashboard')
  }

  const handleNavigateToAdminDashboard = () => {
    setCurrentPage('adminDashboard')
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

  return (
    <HomePage
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      user={user}
      onLogout={handleLogout}
      onNavigateToDonorDashboard={handleNavigateToDonorDashboard}
      onNavigateToAdminDashboard={handleNavigateToAdminDashboard}
    />
  )
}

export default App
