// src/App.jsx
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

import HomePage from './components/HomePage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)
  const [showDonation, setShowDonation] = useState(false) // ÉTAT GLOBAL

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLoginSuccess = (user) => {
  setUser(user)
  setCurrentPage('home')  // ← revient automatiquement à la page home
}


  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  // ================== RENDU ==================
  if (currentPage === 'signin') return <SignIn onBack={() => setCurrentPage('home')} onSwitchToSignUp={() => setCurrentPage('signup')} onLoginSuccess={handleLoginSuccess}  />
  if (currentPage === 'signup') return <SignUp onBack={() => setCurrentPage('home')} onSwitchToSignIn={() => setCurrentPage('signin')} />

  return (
    <>
      <HomePage
        user={user}
        onSignIn={() => setCurrentPage('signin')}
        onSignUp={() => setCurrentPage('signup')}
        onLogout={handleLogout}
        onDonate={() => setShowDonation(true)}   // OUVRE LE MODAL
      />

            {/* LE VRAI MODAL DE DON – MAGNIFIQUE ET FONNANT */}
      {showDonation && (
        <DonationModal onClose={() => setShowDonation(false)} />
      )}
    </>
  )
}

export default App