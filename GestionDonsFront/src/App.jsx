import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import HomePage from './components/HomePage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'

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

  const handleLoginSuccess = (user) => {
    setUser(user)
    setCurrentPage('home')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setCurrentPage('home')
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
