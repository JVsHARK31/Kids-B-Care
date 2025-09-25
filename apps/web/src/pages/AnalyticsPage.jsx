import { useState, useEffect, useMemo } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Award,
  Calendar,
  Zap,
  Star,
  Trophy
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { useAppContext } from '../App'
import axios from 'axios'

const AnalyticsPage = () => {
  const { detections, userMode } = useAppContext()
  const [period, setPeriod] = useState('week')
  const [apiStats, setApiStats] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [statsResponse, leaderboardResponse] = await Promise.all([
          axios.get(`/api/stats?period=${period}`),
          axios.get(`/api/leaderboard?period=${period}&limit=10`)
        ])
        
        if (statsResponse.data.success) {
          setApiStats(statsResponse.data.stats)
        }
        
        if (leaderboardResponse.data.success) {
          setLeaderboard(leaderboardResponse.data.leaderboard)
        }
      } catch (error) {
        console.warn('Failed to fetch API data, using local data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  // Local statistics from detections
  const localStats = useMemo(() => {
    if (detections.length === 0) return null

    // Object frequency
    const objectCounts = {}
    detections.forEach(detection => {
      detection.results.forEach(result => {
        objectCounts[result.class_name] = (objectCounts[result.class_name] || 0) + 1
      })
    })

    // Category mapping
    const categoryMapping = {
      'teddy bear': 'Toys',
      'sports ball': 'Toys',
      'kite': 'Toys',
      'frisbee': 'Toys',
      'cat': 'Animals',
      'dog': 'Animals',
      'bird': 'Animals',
      'horse': 'Animals',
      'apple': 'Food',
      'banana': 'Food',
      'orange': 'Food',
      'pizza': 'Food',
      'car': 'Vehicles',
      'truck': 'Vehicles',
      'bus': 'Vehicles',
      'bicycle': 'Vehicles',
      'chair': 'Household',
      'couch': 'Household',
      'bed': 'Household',
      'book': 'Books',
      'tv': 'Electronics',
      'laptop': 'Electronics',
      'cell phone': 'Electronics'
    }

    // Category distribution
    const categoryStats = {}
    Object.entries(objectCounts).forEach(([object, count]) => {
      const category = categoryMapping[object] || 'Others'
      categoryStats[category] = (categoryStats[category] || 0) + count
    })

    // Top objects
    const topObjects = Object.entries(objectCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, count], index) => ({
        rank: index + 1,
        class_name: name,
        count
      }))

    // Detection trend (last 7 days)
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    const trendData = last7Days.map(date => {
      const count = detections.filter(d => 
        d.timestamp.split('T')[0] === date
      ).length
      return { date, count }
    })

    return {
      total_detections: detections.length,
      unique_objects: Object.keys(objectCounts).length,
      avg_confidence: detections.length > 0 
        ? detections.reduce((sum, d) => {
            const avgConf = d.results.reduce((s, r) => s + r.confidence, 0) / d.results.length
            return sum + avgConf
          }, 0) / detections.length
        : 0,
      most_detected: topObjects[0]?.class_name || 'N/A',
      detection_trend: trendData,
      category_distribution: Object.entries(categoryStats).map(([category, count]) => ({
        category,
        count,
        percentage: Math.round(count * 100 / detections.reduce((sum, d) => sum + d.results.length, 0))
      })),
      top_objects: topObjects
    }
  }, [detections])

  // Use API stats if available, otherwise use local stats
  const stats = apiStats || localStats

  // Chart colors
  const COLORS = ['#8b5cf6', '#f87171', '#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#fb7185']

  // Get achievement level
  const getAchievementLevel = (count) => {
    if (count >= 100) return { level: 'Master Explorer', icon: '🏆', color: 'text-yellow-500' }
    if (count >= 50) return { level: 'Expert Explorer', icon: '🌟', color: 'text-purple-500' }
    if (count >= 20) return { level: 'Advanced Explorer', icon: '⭐', color: 'text-blue-500' }
    if (count >= 10) return { level: 'Explorer', icon: '🔍', color: 'text-green-500' }
    if (count >= 5) return { level: 'Beginner Explorer', icon: '🌱', color: 'text-orange-500' }
    return { level: 'New Explorer', icon: '👶', color: 'text-pink-500' }
  }

  const achievement = stats ? getAchievementLevel(stats.total_detections) : null

  if (!stats) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Fun Stats & Analytics 📊
          </h1>
          <p className="text-lg text-gray-600">
            {userMode === 'kid' 
              ? "See your amazing exploration achievements!" 
              : "Analyze your object detection patterns and progress"
            }
          </p>
        </div>

        <Card className="kids-card">
          <CardContent className="p-12 text-center space-y-4">
            <BarChart3 className="w-16 h-16 text-purple-300 mx-auto" />
            <h3 className="text-xl font-bold text-purple-600">
              {userMode === 'kid' 
                ? "No adventures to show yet!" 
                : "No data available yet"
              }
            </h3>
            <p className="text-gray-600">
              {userMode === 'kid'
                ? "Start exploring objects to see your awesome stats here!"
                : "Begin detecting objects to view analytics and insights"
              }
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {userMode === 'kid' ? 'My Awesome Stats! 📊' : 'Analytics Dashboard 📊'}
        </h1>
        <p className="text-lg text-gray-600">
          {userMode === 'kid' 
            ? "Look at all your amazing exploration achievements!" 
            : "Analyze your object detection patterns and progress"
          }
        </p>
      </div>

      {/* Period Selection */}
      <div className="flex justify-center">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48 border-2 border-purple-200">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Last 24 Hours</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Achievement Badge */}
      {achievement && (
        <Card className="bg-gradient-to-r from-yellow-50 via-purple-50 to-pink-50 border-2 border-yellow-300">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="text-6xl">{achievement.icon}</div>
              <div>
                <h2 className={`text-3xl font-bold ${achievement.color}`}>
                  {achievement.level}
                </h2>
                <p className="text-gray-600">
                  {stats.total_detections} detection{stats.total_detections !== 1 ? 's' : ''} completed!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-purple-600">{stats.total_detections}</div>
            <div className="text-sm text-purple-700">
              {userMode === 'kid' ? 'Adventures' : 'Total Detections'}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-200">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-blue-600">{stats.unique_objects}</div>
            <div className="text-sm text-blue-700">Unique Objects</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-green-600">
              {Math.round(stats.avg_confidence * 100)}%
            </div>
            <div className="text-sm text-green-700">Avg Confidence</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-200">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600 capitalize">
              {stats.most_detected.replace('_', ' ')}
            </div>
            <div className="text-sm text-orange-700">Most Detected</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detection Trend Chart */}
        <Card className="kids-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span>{userMode === 'kid' ? 'My Daily Adventures' : 'Detection Trend'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.detection_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value) => [value, userMode === 'kid' ? 'Adventures' : 'Detections']}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="kids-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <span>{userMode === 'kid' ? 'What I Love to Explore' : 'Category Distribution'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.category_distribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.category_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, 'Objects']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Objects and Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Objects */}
        <Card className="kids-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-500" />
              <span>{userMode === 'kid' ? 'My Favorite Objects' : 'Most Detected Objects'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(stats.top_objects || leaderboard.slice(0, 8)).map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' : 'bg-purple-400'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-purple-700 capitalize">
                      {item.class_name.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-purple-600">{item.count}</div>
                    <div className="text-xs text-gray-500">detections</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fun Facts */}
        <Card className="kids-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-purple-500" />
              <span>{userMode === 'kid' ? 'Cool Facts About Me!' : 'Statistics Summary'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-bold text-purple-700">
                  {userMode === 'kid' ? 'Exploration Accuracy' : 'Average Confidence'}
                </div>
                <div className="text-lg font-semibold text-purple-600">
                  {Math.round(stats.avg_confidence * 100)}% accuracy rate
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <div className="text-2xl mb-2">🏆</div>
                <div className="font-bold text-blue-700">
                  {userMode === 'kid' ? 'Favorite Discovery' : 'Top Detection'}
                </div>
                <div className="text-lg font-semibold text-blue-600 capitalize">
                  {stats.most_detected.replace('_', ' ')}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="text-2xl mb-2">🌟</div>
                <div className="font-bold text-green-700">
                  {userMode === 'kid' ? 'Explorer Level' : 'Activity Level'}
                </div>
                <div className="text-lg font-semibold text-green-600">
                  {achievement?.level || 'Active Explorer'}
                </div>
              </div>

              {userMode === 'kid' && (
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="text-2xl mb-2">🎉</div>
                  <div className="font-bold text-orange-700">Keep Exploring!</div>
                  <div className="text-sm text-orange-600">
                    You're doing amazing! Try to find {100 - stats.total_detections > 0 ? 100 - stats.total_detections : 'more'} objects to reach the next level!
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Encouragement Message for Kids */}
      {userMode === 'kid' && (
        <Card className="bg-gradient-to-r from-rainbow-50 to-purple-50 border-2 border-rainbow-200">
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-4xl">🌈✨</div>
            <h3 className="text-2xl font-bold text-purple-700">
              You're an Amazing Explorer!
            </h3>
            <p className="text-purple-600 text-lg">
              Keep discovering new things and learning about the world around you. 
              Every object you find teaches you something new!
            </p>
            <div className="flex justify-center space-x-2 text-2xl">
              <span>🔍</span>
              <span>📸</span>
              <span>🎯</span>
              <span>🌟</span>
              <span>🏆</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AnalyticsPage
