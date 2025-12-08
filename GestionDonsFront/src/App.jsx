import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import HomePage from './components/HomePage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import TransporterDashboard from './components/TransporterDashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserRole(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserRole(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('roles')
        .eq('id', userId)
        .single()

      if (error) throw error
      setUserRole(data?.roles || ['user'])
    } catch (error) {
      console.error('Error fetching user role:', error)
      setUserRole(['user'])
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

  const handleLoginSuccess = (user) => {
    setUser(user)
    // Fetch user role before navigating
    fetchUserRole(user.id).then(() => {
      // Role check will be done in the component render
      setCurrentPage('dashboard')
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserRole(null)
    setCurrentPage('home')
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  // If user is logged in and is a transporter, show dashboard
  if (user && userRole?.includes('transporteur')) {
    return (
      <TransporterDashboard 
        user={user}
        onLogout={handleLogout}
      />
    )
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

  return (
    <HomePage 
      onSignIn={handleSignIn} 
      onSignUp={handleSignUp}
      user={user}
      onLogout={handleLogout}
    />
  )
}

export default App
