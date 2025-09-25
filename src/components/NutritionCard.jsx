import { useState } from 'react'
import { 
  Zap, 
  Heart, 
  Shield, 
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Star,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  getNutritionInfo, 
  getHealthRecommendations, 
  formatNutritionValue,
  getNutritionColor,
  KIDS_DAILY_VALUES 
} from '../lib/nutritionDatabase'
import { useAppContext } from '../App'

const NutritionCard = ({ detectedObject, className = '' }) => {
  const { userMode } = useAppContext()
  const [isExpanded, setIsExpanded] = useState(false)
  
  const nutritionInfo = getNutritionInfo(detectedObject.class_name)
  
  if (!nutritionInfo) {
    return null
  }

  const { nutrition, benefits, concerns, kidFriendly, name, emoji, category } = nutritionInfo
  const recommendations = getHealthRecommendations(nutrition, userMode === 'kid')
  const dailyValues = KIDS_DAILY_VALUES.ages_4_8 // Default to younger age group

  // Calculate percentage of daily values
  const getDailyPercentage = (value, dailyValue) => {
    return Math.min(100, (value / dailyValue) * 100)
  }

  // Get health score color
  const getHealthScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100'
    if (score >= 6) return 'text-yellow-600 bg-yellow-100'
    if (score >= 4) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  // Get health score description
  const getHealthScoreDescription = (score) => {
    if (score >= 8) return userMode === 'kid' ? 'Super Healthy!' : 'Excellent Choice'
    if (score >= 6) return userMode === 'kid' ? 'Pretty Good!' : 'Good Choice'
    if (score >= 4) return userMode === 'kid' ? 'Okay Sometimes' : 'Moderate Choice'
    return userMode === 'kid' ? 'Special Treat Only' : 'Limit Consumption'
  }

  return (
    <Card className={`${className} border-2 border-purple-200 shadow-lg`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <span className="text-3xl">{emoji}</span>
            <div>
              <h3 className="text-xl font-bold text-purple-700">{name}</h3>
              <p className="text-sm text-gray-600">{category}</p>
            </div>
          </CardTitle>
          
          {/* Health Score */}
          <div className={`px-3 py-2 rounded-full ${getHealthScoreColor(kidFriendly.healthScore)}`}>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span className="font-bold">{kidFriendly.healthScore}/10</span>
            </div>
          </div>
        </div>
        
        {/* Health Score Description */}
        <div className="text-center">
          <Badge className={`${getHealthScoreColor(kidFriendly.healthScore)} border-0`}>
            {getHealthScoreDescription(kidFriendly.healthScore)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Kid-friendly Description */}
        {userMode === 'kid' && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
            <p className="text-purple-700 font-medium text-center">
              {kidFriendly.description}
            </p>
            {kidFriendly.funFact && (
              <p className="text-sm text-purple-600 text-center mt-2 italic">
                💡 {kidFriendly.funFact}
              </p>
            )}
          </div>
        )}

        {/* Key Nutrition Facts */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <Zap className="w-6 h-6 text-orange-500 mx-auto mb-1" />
            <div className="font-bold text-orange-700">{nutrition.calories}</div>
            <div className="text-xs text-orange-600">
              {userMode === 'kid' ? 'Energy' : 'Calories'}
            </div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Heart className="w-6 h-6 text-blue-500 mx-auto mb-1" />
            <div className="font-bold text-blue-700">{formatNutritionValue(nutrition.protein)}</div>
            <div className="text-xs text-blue-600">
              {userMode === 'kid' ? 'Muscle Power' : 'Protein'}
            </div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <Shield className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <div className="font-bold text-green-700">{formatNutritionValue(nutrition.vitaminC, 'mg')}</div>
            <div className="text-xs text-green-600">
              {userMode === 'kid' ? 'Germ Fighter' : 'Vitamin C'}
            </div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <Sparkles className="w-6 h-6 text-purple-500 mx-auto mb-1" />
            <div className="font-bold text-purple-700">{formatNutritionValue(nutrition.fiber)}</div>
            <div className="text-xs text-purple-600">
              {userMode === 'kid' ? 'Tummy Helper' : 'Fiber'}
            </div>
          </div>
        </div>

        {/* Health Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 flex items-center space-x-2">
              <Info className="w-4 h-4" />
              <span>{userMode === 'kid' ? 'Good to Know!' : 'Health Notes'}</span>
            </h4>
            {recommendations.map((rec, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  rec.type === 'positive' ? 'bg-green-50 border-green-400' :
                  rec.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-red-50 border-red-400'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {rec.type === 'positive' ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                  )}
                  <p className={`text-sm ${
                    rec.type === 'positive' ? 'text-green-700' :
                    rec.type === 'warning' ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {rec.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expand/Collapse Button */}
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full border-2 border-purple-300 hover:bg-purple-50"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Show More Details
            </>
          )}
        </Button>

        {/* Detailed Nutrition Information */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-purple-200">
            {/* Detailed Nutrition Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h5 className="font-semibold text-purple-700">Macronutrients</h5>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Carbohydrates</span>
                    <span className={`font-medium ${getNutritionColor(nutrition.carbs, 'carbs')}`}>
                      {formatNutritionValue(nutrition.carbs)}
                    </span>
                  </div>
                  <Progress 
                    value={getDailyPercentage(nutrition.carbs, dailyValues.carbs)} 
                    className="h-2"
                  />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Fat</span>
                    <span className={`font-medium ${getNutritionColor(nutrition.fat, 'fat')}`}>
                      {formatNutritionValue(nutrition.fat)}
                    </span>
                  </div>
                  <Progress 
                    value={getDailyPercentage(nutrition.fat, dailyValues.fat)} 
                    className="h-2"
                  />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sugar</span>
                    <span className={`font-medium ${getNutritionColor(nutrition.sugar, 'sugar')}`}>
                      {formatNutritionValue(nutrition.sugar)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sodium</span>
                    <span className={`font-medium ${getNutritionColor(nutrition.sodium, 'sodium')}`}>
                      {formatNutritionValue(nutrition.sodium, 'mg')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-purple-700">Vitamins & Minerals</h5>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Calcium</span>
                    <span className="font-medium text-blue-600">
                      {formatNutritionValue(nutrition.calcium, 'mg')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Iron</span>
                    <span className="font-medium text-red-600">
                      {formatNutritionValue(nutrition.iron, 'mg')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Potassium</span>
                    <span className="font-medium text-green-600">
                      {formatNutritionValue(nutrition.potassium, 'mg')}
                    </span>
                  </div>
                  
                  {nutrition.vitaminA > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Vitamin A</span>
                      <span className="font-medium text-orange-600">
                        {formatNutritionValue(nutrition.vitaminA, 'μg')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Benefits and Concerns */}
            {(benefits || concerns) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits && (
                  <div className="space-y-2">
                    <h5 className="font-semibold text-green-700 flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Health Benefits</span>
                    </h5>
                    <ul className="space-y-1">
                      {benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-green-600 flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {concerns && (
                  <div className="space-y-2">
                    <h5 className="font-semibold text-orange-700 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Consider</span>
                    </h5>
                    <ul className="space-y-1">
                      {concerns.map((concern, index) => (
                        <li key={index} className="text-sm text-orange-600 flex items-start space-x-2">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default NutritionCard
