import { useState, useEffect } from 'react'
// ...existing code...
import axios from 'axios'
import './App.css'
import Auth from './components/Auth'
import Transcriber from './components/Transcriber'
import TranscriptList from './components/TranscriptList'
import DotGrid from './components/DotGrid'
import ShinyText from './components/ShinyText'
import TrueFocus from './components/TrueFocus'
import DarkVeil from './components/DarkVeil'
import './components/DotGrid.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      verifyToken()
    }
  }, [token])

  const verifyToken = async (tokenToVerify) => {
    const tokenValue = tokenToVerify || token
    if (!tokenValue) return
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/me`,
        {
          headers: { Authorization: `Bearer ${tokenValue}` },
        }
      )
      setUser(response.data)
      setIsAuthenticated(true)
    } catch (error) {
      localStorage.removeItem('token')
      setToken(null)
      setIsAuthenticated(false)
    }
  }

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    verifyToken(newToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <div className="App" style={{ width: '100vw', minHeight: '100vh', position: 'relative', overflowX: 'hidden', overflowY: 'auto' }}>
      {/* DarkVeil full background effect */}
      <div className="darkveil-fullpage">
        <DarkVeil
          hueShift={0}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
          scanlineFrequency={0}
          warpAmount={0}
        />
      </div>
      <header className="header">
        <div className="header-left">
          <h1>
            <ShinyText
              text="EchoNote"
              speed={3}
              delay={0.5}
              color="#ffffff"
              shineColor="#a855f7"
              spread={120}
              direction="left"
              className="app-title"
            />
          </h1>
          {isAuthenticated && (
            <div className="subtitle-wrapper">
              <ShinyText
                text="Convert Speech to Text"
                speed={3}
                delay={0.8}
                color="#ffffff"
                shineColor="#a855f7"
                spread={120}
                direction="left"
                className="app-subtitle"
              />
            </div>
          )}
        </div>
        <div className="header-right">
          {!isAuthenticated && (
            <TrueFocus
              sentence="Speech to Text"
              manualMode={false}
              blurAmount={3}
              borderColor="#5227FF"
              glowColor="rgba(82, 39, 255, 0.6)"
              animationDuration={0.5}
              pauseBetweenAnimations={1.5}
              fontSize="3.2rem"
            />
          )}
          {isAuthenticated && user && (
            <div className="user-info">
              <span>Welcome, {user.username}!</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="container">
        {!isAuthenticated ? (
          <Auth onLoginSuccess={handleLogin} />
        ) : (
          <>
            <Transcriber token={token} />
            <TranscriptList token={token} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
