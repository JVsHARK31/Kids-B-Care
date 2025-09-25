import { useState } from 'react'
import { 
  Utensils, 
  TrendingUp, 
  Heart, 
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Star
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getNutritionInfo, KIDS_DAILY_VALUES } from '../lib/nutritionDatabase'

const MealAnalysis = ({ detectedFoods, userMode = 'kid' }) => {
  if (!detectedFoods || detectedFoods.length === 0) return null

  // Calculate total nutrition for the meal
  const totalNutrition = detectedFoods.reduce((total, food) => {
    const nutrition = getNutritionInfo(food.class_name)
    if (!nutrition) return total

    return {
      calories: total.calories + nutrition.nutrition.calories,
      protein: total.protein + nutrition.nutrition.protein,
      carbs: total.carbs + nutrition.nutrition.carbs,
      fat: total.fat + nutrition.nutrition.fat,
      fiber: total.fiber + nutrition.nutrition.fiber,
      sugar: total.sugar + nutrition.nutrition.sugar,
      sodium: total.sodium + nutrition.nutrition.sodium,
      calcium: total.calcium + (nutrition.nutrition.calcium || 0),
      iron: total.iron + (nutrition.nutrition.iron || 0),
      vitaminC: total.vitaminC + (nutrition.nutrition.vitaminC || 0),
      vitaminA: total.vitaminA + (nutrition.nutrition.vitaminA || 0)
    }
  }, {
    calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, 
    sugar: 0, sodium: 0, calcium: 0, iron: 0, vitaminC: 0, vitaminA: 0
  })

  // Calculate average health score
  const avgHealthScore = Math.round(
    detectedFoods.reduce((sum, food) => {
      const nutrition = getNutritionInfo(food.class_name)
      return sum + (nutrition?.kidFriendly?.healthScore || 5)
    }, 0) / detectedFoods.length
  )

  // Daily values for kids
  const dailyValues = KIDS_DAILY_VALUES.ages_4_8

  const getDailyPercentage = (value, dailyValue) => {
    return Math.min(100, Math.round((value / dailyValue) * 100))
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100'
    if (score >= 6) return 'text-yellow-600 bg-yellow-100'
    if (score >= 4) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getRecommendation = () => {
    if (totalNutrition.sodium > 800) {
      return {
        type: 'warning',
        message: userMode === 'kid' ? 'Makanan ini agak asin! Minum air putih yang banyak ya! 💧' : 'Tinggi sodium - pastikan anak minum air yang cukup'
      }
    }
    if (totalNutrition.sugar > 20) {
      return {
        type: 'caution', 
        message: userMode === 'kid' ? 'Wah, manis sekali! Jangan lupa sikat gigi setelah makan! 🦷' : 'Tinggi gula - monitor konsumsi gula harian'
      }
    }
    if (avgHealthScore >= 8) {
      return {
        type: 'excellent',
        message: userMode === 'kid' ? 'Makanan super sehat! Bagus banget untuk tumbuh kembang! 🌟' : 'Makanan sangat bergizi dan seimbang untuk anak'
      }
    }
    if (avgHealthScore >= 6) {
      return {
        type: 'good',
        message: userMode === 'kid' ? 'Makanan yang cukup sehat! Tambah sayur hijau akan lebih baik! 🥬' : 'Makanan cukup sehat, bisa ditambah sayuran'
      }
    }
    return {
      type: 'moderate',
      message: userMode === 'kid' ? 'Boleh sesekali, tapi jangan terlalu sering ya! 😊' : 'Sebaiknya dikombinasi dengan makanan lebih sehat'
    }
  }

  const recommendation = getRecommendation()

  return (
    <div className="space-y-6">
      {/* Meal Overview Card - TikTok Style */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Utensils className="w-6 h-6 text-purple-600" />
              <span className="text-purple-800">
                {userMode === 'kid' ? 'Analisis Makananku 🍽️' : 'Analisis Nutrisi Meal'}
              </span>
            </div>
            <Badge className={`${getScoreColor(avgHealthScore)} border-none px-3 py-1`}>
              <Star className="w-4 h-4 mr-1" />
              {avgHealthScore}/10
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Food Items Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {detectedFoods.map((food, index) => {
              const nutrition = getNutritionInfo(food.class_name)
              if (!nutrition) return null
              
              return (
                <div key={index} className="text-center p-3 bg-white rounded-lg shadow-sm border">
                  <div className="text-2xl mb-1">{nutrition.emoji}</div>
                  <div className="text-sm font-semibold text-gray-700">{nutrition.name}</div>
                  <Badge className={`text-xs ${getScoreColor(nutrition.kidFriendly?.healthScore || 5)}`}>
                    {nutrition.kidFriendly?.healthScore}/10
                  </Badge>
                </div>
              )
            })}
          </div>

          {/* Total Nutrition - TikTok Style Display */}
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <h3 className="font-bold text-lg text-purple-700 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Total Nutrisi Makanan Ini:
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Calories */}
              <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                <Zap className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-orange-600">{Math.round(totalNutrition.calories)}</div>
                <div className="text-xs text-gray-600">Kalori</div>
                <div className="text-xs text-orange-500 font-medium">
                  {getDailyPercentage(totalNutrition.calories, dailyValues.calories)}% harian
                </div>
              </div>

              {/* Protein */}
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <Heart className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-blue-600">{totalNutrition.protein.toFixed(1)}g</div>
                <div className="text-xs text-gray-600">Protein</div>
                <div className="text-xs text-blue-500 font-medium">
                  {getDailyPercentage(totalNutrition.protein, dailyValues.protein)}% harian
                </div>
              </div>

              {/* Carbs */}
              <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                <Zap className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-green-600">{totalNutrition.carbs.toFixed(1)}g</div>
                <div className="text-xs text-gray-600">Karbohidrat</div>
                <div className="text-xs text-green-500 font-medium">
                  {getDailyPercentage(totalNutrition.carbs, dailyValues.carbs)}% harian
                </div>
              </div>

              {/* Calcium */}
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <Shield className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-purple-600">{Math.round(totalNutrition.calcium)}mg</div>
                <div className="text-xs text-gray-600">Kalsium</div>
                <div className="text-xs text-purple-500 font-medium">
                  {getDailyPercentage(totalNutrition.calcium, dailyValues.calcium)}% harian
                </div>
              </div>
            </div>

            {/* Nutrition Progress Bars */}
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Protein</span>
                  <span>{totalNutrition.protein.toFixed(1)}g / {dailyValues.protein}g</span>
                </div>
                <Progress value={getDailyPercentage(totalNutrition.protein, dailyValues.protein)} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Kalsium</span>
                  <span>{Math.round(totalNutrition.calcium)}mg / {dailyValues.calcium}mg</span>
                </div>
                <Progress value={getDailyPercentage(totalNutrition.calcium, dailyValues.calcium)} className="h-2" />
              </div>

              {totalNutrition.vitaminC > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Vitamin C</span>
                    <span>{totalNutrition.vitaminC.toFixed(1)}mg / {dailyValues.vitaminC}mg</span>
                  </div>
                  <Progress value={getDailyPercentage(totalNutrition.vitaminC, dailyValues.vitaminC)} className="h-2" />
                </div>
              )}
            </div>
          </div>

          {/* Health Recommendation */}
          <Alert className={`border-2 ${
            recommendation.type === 'excellent' ? 'border-green-200 bg-green-50' :
            recommendation.type === 'good' ? 'border-blue-200 bg-blue-50' :
            recommendation.type === 'warning' ? 'border-orange-200 bg-orange-50' :
            recommendation.type === 'caution' ? 'border-red-200 bg-red-50' :
            'border-purple-200 bg-purple-50'
          }`}>
            <div className="flex">
              {recommendation.type === 'excellent' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {recommendation.type === 'good' && <Info className="h-5 w-5 text-blue-500" />}
              {recommendation.type === 'warning' && <AlertTriangle className="h-5 w-5 text-orange-500" />}
              {recommendation.type === 'caution' && <AlertTriangle className="h-5 w-5 text-red-500" />}
              {recommendation.type === 'moderate' && <Info className="h-5 w-5 text-purple-500" />}
            </div>
            <AlertDescription className={`${
              recommendation.type === 'excellent' ? 'text-green-700' :
              recommendation.type === 'good' ? 'text-blue-700' :
              recommendation.type === 'warning' ? 'text-orange-700' :
              recommendation.type === 'caution' ? 'text-red-700' :
              'text-purple-700'
            } font-medium`}>
              {recommendation.message}
            </AlertDescription>
          </Alert>

          {/* Quick Stats Like TikTok */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-200">
            <h4 className="font-bold text-purple-800 mb-3 text-center">
              📊 {userMode === 'kid' ? 'Ringkasan Nutrisi' : 'Nutrition Summary'}
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-purple-600">{Math.round(totalNutrition.calories)}</div>
                <div className="text-xs text-purple-500">Kalori</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">{totalNutrition.protein.toFixed(1)}g</div>
                <div className="text-xs text-blue-500">Protein</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{Math.round(totalNutrition.calcium)}mg</div>
                <div className="text-xs text-green-500">Kalsium</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MealAnalysis
