import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { 
  Camera, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Home,
  Menu,
  X,
  Baby,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppContext } from '../App'

const Navbar = () => {
  const location = useLocation()
  const { userMode, setUserMode } = useAppContext()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', icon: Home, label: 'Home', color: 'text-purple-500' },
    { path: '/detect', icon: Camera, label: 'Explore', color: 'text-pink-500' },
    { path: '/journal', icon: BookOpen, label: 'Journal', color: 'text-blue-500' },
    { path: '/analytics', icon: BarChart3, label: 'Stats', color: 'text-green-500' },
    { path: '/settings', icon: Settings, label: 'Settings', color: 'text-orange-500' }
  ]

  const toggleUserMode = () => {
    setUserMode(userMode === 'kid' ? 'parent' : 'kid')
  }

  const getModeColor = () => {
    switch (userMode) {
      case 'kid': return 'bg-gradient-to-r from-purple-400 to-pink-400'
      case 'parent': return 'bg-gradient-to-r from-blue-400 to-green-400'
      case 'admin': return 'bg-gradient-to-r from-orange-400 to-red-400'
      default: return 'bg-gradient-to-r from-purple-400 to-pink-400'
    }
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b-2 border-purple-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-white rounded-xl p-2 shadow-lg group-hover:scale-105 transition-all duration-300 border-2 border-purple-200">
              <img 
                src="/logo.svg?v=2" 
                alt="Kids B-Care Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Kids B-Care
              </span>
              <span className="text-xs text-purple-500 font-medium">
                Nutrition AI for Kids
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 hover:bg-purple-50 group ${
                    isActive ? 'bg-purple-100 shadow-md' : ''
                  }`}
                >
                  <Icon className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform duration-200`} />
                  <span className={`text-xs font-medium mt-1 ${
                    isActive ? 'text-purple-700' : 'text-gray-600'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* User Mode Toggle & Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* User Mode Toggle */}
            <div className="flex items-center bg-white/90 rounded-full p-1 shadow-md">
              <Button
                variant={userMode === 'kid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setUserMode('kid')}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                  userMode === 'kid' 
                    ? 'bg-purple-500 text-white shadow-sm' 
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Baby className="w-4 h-4 mr-1" />
                Kid
              </Button>
              <Button
                variant={userMode === 'parent' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setUserMode('parent')}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                  userMode === 'parent' 
                    ? 'bg-purple-500 text-white shadow-sm' 
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                <User className="w-4 h-4 mr-1" />
                Parent
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-purple-600" />
              ) : (
                <Menu className="w-6 h-6 text-purple-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-200">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 hover:bg-purple-50 ${
                      isActive ? 'bg-purple-100 shadow-md' : ''
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className={`w-8 h-8 ${item.color} mb-2`} />
                    <span className={`text-sm font-medium ${
                      isActive ? 'text-purple-700' : 'text-gray-600'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
