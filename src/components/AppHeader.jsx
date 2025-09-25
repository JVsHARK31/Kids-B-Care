import { useState } from 'react'
import { 
  Settings, 
  User, 
  Baby, 
  Globe, 
  Moon, 
  Sun,
  Info,
  Shield,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppContext } from '../App'

const AppHeader = () => {
  const { userMode, setUserMode } = useAppContext()
  const [language, setLanguage] = useState('id')
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMode = () => {
    setUserMode(userMode === 'kid' ? 'parent' : 'kid')
  }

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id')
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const appTitle = {
    id: {
      kid: 'Kids B-Care - Penjelajah Makanan 🍎',
      parent: 'Kids B-Care - Analisis Nutrisi Anak 📊'
    },
    en: {
      kid: 'Kids B-Care - Food Explorer 🍎',
      parent: 'Kids B-Care - Child Nutrition Analysis 📊'
    }
  }

  const subtitle = {
    id: {
      kid: 'Temukan makanan sehat dan bergizi untuk tumbuh kembang yang optimal!',
      parent: 'Platform analisis nutrisi berbasis AI untuk memantau asupan gizi anak'
    },
    en: {
      kid: 'Discover healthy and nutritious foods for optimal growth!',
      parent: 'AI-powered nutrition analysis platform to monitor children\'s dietary intake'
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🍎</span>
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold text-white">
                {appTitle[language][userMode]}
              </h1>
              <p className="text-white/80 text-sm">
                {subtitle[language][userMode]}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Mode Toggle */}
            <div className="flex items-center bg-white/10 rounded-full p-1">
              <Button
                variant={userMode === 'kid' ? 'default' : 'ghost'}
                size="sm"
                onClick={toggleMode}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  userMode === 'kid' 
                    ? 'bg-white text-purple-600 shadow-md' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Baby className="w-4 h-4 mr-2" />
                {language === 'id' ? 'Anak' : 'Kid'}
              </Button>
              <Button
                variant={userMode === 'parent' ? 'default' : 'ghost'}
                size="sm"
                onClick={toggleMode}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  userMode === 'parent' 
                    ? 'bg-white text-purple-600 shadow-md' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                {language === 'id' ? 'Orang Tua' : 'Parent'}
              </Button>
            </div>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-white hover:bg-white/20 rounded-full px-4 py-2"
            >
              <Globe className="w-4 h-4 mr-2" />
              {language.toUpperCase()}
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="text-white hover:bg-white/20 rounded-full p-2"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Settings Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full p-2"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  {language === 'id' ? 'Pengaturan' : 'Settings'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Info className="w-4 h-4 mr-2" />
                  {language === 'id' ? 'Tentang Aplikasi' : 'About App'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="w-4 h-4 mr-2" />
                  {language === 'id' ? 'Privasi & Keamanan' : 'Privacy & Security'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Badge */}
            <Badge className="bg-green-500 text-white">
              {language === 'id' ? 'Online' : 'Online'}
            </Badge>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-white/20 p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-2">
              {/* Mobile Title */}
              <div className="text-center pb-4">
                <h1 className="text-xl font-bold text-white">
                  {appTitle[language][userMode]}
                </h1>
                <p className="text-white/80 text-sm">
                  {subtitle[language][userMode]}
                </p>
              </div>

              {/* Mobile Mode Toggle */}
              <div className="flex space-x-2">
                <Button
                  variant={userMode === 'kid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={toggleMode}
                  className={`flex-1 ${
                    userMode === 'kid' 
                      ? 'bg-white text-purple-600' 
                      : 'text-white border-white/30'
                  }`}
                >
                  <Baby className="w-4 h-4 mr-2" />
                  {language === 'id' ? 'Mode Anak' : 'Kid Mode'}
                </Button>
                <Button
                  variant={userMode === 'parent' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={toggleMode}
                  className={`flex-1 ${
                    userMode === 'parent' 
                      ? 'bg-white text-purple-600' 
                      : 'text-white border-white/30'
                  }`}
                >
                  <User className="w-4 h-4 mr-2" />
                  {language === 'id' ? 'Mode Orang Tua' : 'Parent Mode'}
                </Button>
              </div>

              {/* Mobile Settings */}
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="flex-1 text-white border-white/30"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {language === 'id' ? 'English' : 'Bahasa'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="flex-1 text-white border-white/30"
                >
                  {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  {language === 'id' ? 'Mode Gelap' : 'Dark Mode'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppHeader
