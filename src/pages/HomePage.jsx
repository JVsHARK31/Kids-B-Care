import { Link } from 'react-router-dom'
import { 
  Camera, 
  BookOpen, 
  BarChart3, 
  Settings,
  Sparkles,
  Heart,
  Star
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { useAppContext } from '../App'

const HomePage = () => {
  const { userMode } = useAppContext()

  const features = [
    {
      path: '/detect',
      icon: Camera,
      title: 'Explore Objects',
      description: 'Take photos and discover amazing things around you!',
      color: 'from-pink-400 to-purple-500',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-500'
    },
    {
      path: '/journal',
      icon: BookOpen,
      title: 'My Journal',
      description: 'See all the cool things you\'ve discovered',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      path: '/analytics',
      icon: BarChart3,
      title: 'Fun Stats',
      description: 'Check out your exploration achievements',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      path: '/settings',
      icon: Settings,
      title: 'Settings',
      description: 'Customize your exploration experience',
      color: 'from-orange-400 to-yellow-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500'
    }
  ]

  const getWelcomeMessage = () => {
    switch (userMode) {
      case 'kid':
        return {
          title: 'Hello, Little Explorer! 🌟',
          subtitle: 'Ready to discover amazing things around you?',
          description: 'Use your camera to explore and learn about objects in your world!'
        }
      case 'parent':
        return {
          title: 'Welcome, Parent! 👨‍👩‍👧‍👦',
          subtitle: 'Monitor your child\'s learning journey',
          description: 'Track discoveries, view progress, and ensure a safe learning environment.'
        }
      case 'admin':
        return {
          title: 'Admin Dashboard 🔧',
          subtitle: 'Manage the Kids B-Care system',
          description: 'Configure settings, monitor usage, and maintain the application.'
        }
      default:
        return {
          title: 'Welcome to Kids B-Care! 🎉',
          subtitle: 'Your AI-powered object exploration companion',
          description: 'Discover, learn, and have fun with our smart object detection!'
        }
    }
  }

  const welcome = getWelcomeMessage()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-3xl blur-lg opacity-30 animate-pulse-soft"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-purple-200 shadow-xl">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce-gentle">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              {welcome.title}
            </h1>
            <p className="text-xl md:text-2xl text-purple-700 font-semibold mb-2">
              {welcome.subtitle}
            </p>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {welcome.description}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Start Button */}
      <div className="text-center">
        <Link to="/detect">
          <Button className="kids-button text-xl px-12 py-6 shadow-2xl">
            <Camera className="w-8 h-8 mr-3" />
            Start Exploring Now!
          </Button>
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {features.map((feature) => {
          const Icon = feature.icon
          
          return (
            <Link key={feature.path} to={feature.path} className="group">
              <Card className={`${feature.bgColor} border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl hover:scale-105 group-hover:-translate-y-2`}>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className={`p-4 bg-gradient-to-r ${feature.color} rounded-full group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Fun Facts Section */}
      <div className="bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 rounded-3xl p-8 border-2 border-purple-200">
        <div className="text-center space-y-6">
          <div className="flex justify-center space-x-2">
            <Star className="w-8 h-8 text-yellow-500 animate-pulse" />
            <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
            <Star className="w-8 h-8 text-purple-500 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-purple-700">
            Did You Know? 🤔
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-pink-600">1000+</div>
              <div className="text-gray-700">Objects to Discover</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">AI-Powered</div>
              <div className="text-gray-700">Smart Detection</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">100%</div>
              <div className="text-gray-700">Safe for Kids</div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Message */}
      {userMode === 'kid' && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
          <div className="flex justify-center mb-3">
            <Heart className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-green-700 mb-2">
            Safe & Fun Learning! 🛡️
          </h3>
          <p className="text-green-600">
            Always ask a grown-up before taking pictures, and remember to be kind to everything you discover!
          </p>
        </div>
      )}
    </div>
  )
}

export default HomePage
