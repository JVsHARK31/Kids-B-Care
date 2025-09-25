import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, createContext, useContext } from 'react'
import './App.css'

// Components
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import DetectPage from './pages/DetectPage'
import JournalPage from './pages/JournalPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'

// Context for app state
const AppContext = createContext()

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

function App() {
  const [userMode, setUserMode] = useState('kid') // 'kid', 'parent', 'admin'
  const [detections, setDetections] = useState([])
  const [settings, setSettings] = useState({
    language: 'en',
    voiceFeedback: false,
    theme: 'light'
  })

  const contextValue = {
    userMode,
    setUserMode,
    detections,
    setDetections,
    settings,
    setSettings
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <Navbar />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/detect" element={<DetectPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppContext.Provider>
  )
}

export default App
