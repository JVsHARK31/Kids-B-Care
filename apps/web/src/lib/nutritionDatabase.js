// Comprehensive Nutrition Database for Food Items
// Values are per 100g serving unless otherwise specified

export const NUTRITION_DATABASE = {
  // Fruits
  'apple': {
    name: 'Apple',
    category: 'Fruits',
    emoji: '🍎',
    nutrition: {
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      fiber: 2.4,
      sugar: 10,
      sodium: 1,
      potassium: 107,
      calcium: 6,
      iron: 0.1,
      vitaminC: 4.6,
      vitaminA: 54
    },
    benefits: [
      'Rich in fiber for healthy digestion',
      'Contains antioxidants for strong immunity',
      'Good source of vitamin C',
      'Helps keep teeth clean and healthy'
    ],
    kidFriendly: {
      description: 'Crunchy and sweet! Apples help keep your teeth strong and your tummy happy!',
      funFact: 'An apple a day keeps the doctor away! 🏥',
      healthScore: 9
    }
  },
  
  'banana': {
    name: 'Banana',
    category: 'Fruits',
    emoji: '🍌',
    nutrition: {
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12,
      sodium: 1,
      potassium: 358,
      calcium: 5,
      iron: 0.3,
      vitaminC: 8.7,
      vitaminB6: 0.4
    },
    benefits: [
      'High in potassium for heart health',
      'Natural energy boost from healthy sugars',
      'Good source of vitamin B6',
      'Contains fiber for digestion'
    ],
    kidFriendly: {
      description: 'Sweet and creamy! Bananas give you energy to play and run around!',
      funFact: 'Bananas are berries, but strawberries are not! 🤯',
      healthScore: 8
    }
  },

  'orange': {
    name: 'Orange',
    category: 'Fruits',
    emoji: '🍊',
    nutrition: {
      calories: 47,
      protein: 0.9,
      carbs: 12,
      fat: 0.1,
      fiber: 2.4,
      sugar: 9,
      sodium: 0,
      potassium: 181,
      calcium: 40,
      iron: 0.1,
      vitaminC: 53,
      folate: 40
    },
    benefits: [
      'Excellent source of vitamin C',
      'Boosts immune system',
      'Contains folate for healthy growth',
      'Rich in antioxidants'
    ],
    kidFriendly: {
      description: 'Juicy and tangy! Oranges help fight off germs and keep you healthy!',
      funFact: 'One orange has more vitamin C than you need for the whole day! 💪',
      healthScore: 9
    }
  },

  // Vegetables
  'broccoli': {
    name: 'Broccoli',
    category: 'Vegetables',
    emoji: '🥦',
    nutrition: {
      calories: 34,
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
      fiber: 2.6,
      sugar: 1.5,
      sodium: 33,
      potassium: 316,
      calcium: 47,
      iron: 0.7,
      vitaminC: 89,
      vitaminK: 102,
      folate: 63
    },
    benefits: [
      'Super high in vitamin C and K',
      'Contains powerful antioxidants',
      'Good source of fiber and protein',
      'Supports bone health with calcium'
    ],
    kidFriendly: {
      description: 'Like tiny green trees! Broccoli makes you super strong like a superhero!',
      funFact: 'Broccoli has more vitamin C than oranges! 🦸‍♂️',
      healthScore: 10
    }
  },

  'carrot': {
    name: 'Carrot',
    category: 'Vegetables',
    emoji: '🥕',
    nutrition: {
      calories: 41,
      protein: 0.9,
      carbs: 10,
      fat: 0.2,
      fiber: 2.8,
      sugar: 4.7,
      sodium: 69,
      potassium: 320,
      calcium: 33,
      iron: 0.3,
      vitaminA: 835,
      vitaminC: 5.9
    },
    benefits: [
      'Extremely high in vitamin A for eye health',
      'Contains beta-carotene antioxidants',
      'Good source of fiber',
      'Supports healthy vision'
    ],
    kidFriendly: {
      description: 'Orange and crunchy! Carrots help you see better, especially at night!',
      funFact: 'Eating carrots really can help you see in the dark! 👀',
      healthScore: 9
    }
  },

  // Proteins
  'hot dog': {
    name: 'Hot Dog',
    category: 'Processed Meat',
    emoji: '🌭',
    nutrition: {
      calories: 290,
      protein: 10,
      carbs: 4,
      fat: 26,
      fiber: 0,
      sugar: 1,
      sodium: 1090,
      potassium: 143,
      calcium: 24,
      iron: 0.8,
      vitaminC: 0,
      vitaminA: 0
    },
    benefits: [
      'Source of protein for muscle building',
      'Contains some B vitamins'
    ],
    concerns: [
      'Very high in sodium',
      'High in saturated fat',
      'Processed meat - eat in moderation'
    ],
    kidFriendly: {
      description: 'Tasty but should be a special treat! Too much salt for everyday eating.',
      funFact: 'Hot dogs are named after dachshund dogs because of their shape! 🐕',
      healthScore: 3
    }
  },

  'pizza': {
    name: 'Pizza',
    category: 'Fast Food',
    emoji: '🍕',
    nutrition: {
      calories: 266,
      protein: 11,
      carbs: 33,
      fat: 10,
      fiber: 2.3,
      sugar: 3.6,
      sodium: 598,
      potassium: 172,
      calcium: 144,
      iron: 1.2,
      vitaminC: 0.2,
      vitaminA: 76
    },
    benefits: [
      'Contains protein from cheese',
      'Source of calcium for bones',
      'Provides energy from carbohydrates'
    ],
    concerns: [
      'High in calories and fat',
      'High sodium content',
      'Best enjoyed in moderation'
    ],
    kidFriendly: {
      description: 'Yummy but should be a special treat! Has lots of cheese for strong bones.',
      funFact: 'Pizza was invented in Italy over 1000 years ago! 🇮🇹',
      healthScore: 4
    }
  },

  // Dairy
  'milk': {
    name: 'Milk',
    category: 'Dairy',
    emoji: '🥛',
    nutrition: {
      calories: 61,
      protein: 3.2,
      carbs: 4.8,
      fat: 3.3,
      fiber: 0,
      sugar: 5.1,
      sodium: 44,
      potassium: 150,
      calcium: 113,
      iron: 0.0,
      vitaminD: 1.3,
      vitaminB12: 0.5
    },
    benefits: [
      'Excellent source of calcium for strong bones',
      'High-quality protein for growth',
      'Contains vitamin D',
      'Good source of vitamin B12'
    ],
    kidFriendly: {
      description: 'Creamy and nutritious! Milk helps build strong bones and teeth!',
      funFact: 'A cow can produce about 6-7 gallons of milk per day! 🐄',
      healthScore: 8
    }
  },

  // Grains
  'bread': {
    name: 'Bread',
    category: 'Grains',
    emoji: '🍞',
    nutrition: {
      calories: 265,
      protein: 9,
      carbs: 49,
      fat: 3.2,
      fiber: 2.7,
      sugar: 5,
      sodium: 491,
      potassium: 100,
      calcium: 149,
      iron: 3.6,
      vitaminB1: 0.4,
      vitaminB3: 5.4
    },
    benefits: [
      'Good source of carbohydrates for energy',
      'Contains B vitamins',
      'Provides fiber (especially whole grain)',
      'Source of iron'
    ],
    kidFriendly: {
      description: 'Soft and filling! Bread gives you energy to play and learn all day!',
      funFact: 'Bread has been eaten by humans for over 14,000 years! 🏺',
      healthScore: 6
    }
  },

  // Sweets
  'cake': {
    name: 'Cake',
    category: 'Desserts',
    emoji: '🍰',
    nutrition: {
      calories: 257,
      protein: 4,
      carbs: 46,
      fat: 7,
      fiber: 0.9,
      sugar: 35,
      sodium: 242,
      potassium: 71,
      calcium: 96,
      iron: 1.8,
      vitaminA: 49,
      vitaminC: 0.1
    },
    benefits: [
      'Provides quick energy',
      'Contains some calcium from dairy ingredients'
    ],
    concerns: [
      'Very high in sugar',
      'High in calories',
      'Should be eaten as an occasional treat'
    ],
    kidFriendly: {
      description: 'Sweet and special! Cake is perfect for birthdays and celebrations!',
      funFact: 'The biggest cake ever made weighed over 128,000 pounds! 🎂',
      healthScore: 2
    }
  },

  'donut': {
    name: 'Donut',
    category: 'Desserts',
    emoji: '🍩',
    nutrition: {
      calories: 452,
      protein: 5,
      carbs: 51,
      fat: 25,
      fiber: 1.4,
      sugar: 23,
      sodium: 326,
      potassium: 65,
      calcium: 21,
      iron: 1.5,
      vitaminA: 17,
      vitaminC: 0.1
    },
    benefits: [
      'Provides quick energy'
    ],
    concerns: [
      'Very high in calories and fat',
      'High sugar content',
      'Should be an occasional treat only'
    ],
    kidFriendly: {
      description: 'Sweet and round! Donuts are yummy treats for very special times!',
      funFact: 'The donut hole was invented so sailors could hang donuts on ship wheels! ⚓',
      healthScore: 1
    }
  }
}

// Nutrition recommendations for kids (daily values)
export const KIDS_DAILY_VALUES = {
  ages_4_8: {
    calories: 1600,
    protein: 19,
    carbs: 130,
    fat: 25,
    fiber: 25,
    sodium: 1900,
    calcium: 1000,
    iron: 10,
    vitaminC: 25,
    vitaminA: 400
  },
  ages_9_13: {
    calories: 2000,
    protein: 34,
    carbs: 130,
    fat: 31,
    fiber: 31,
    sodium: 2200,
    calcium: 1300,
    iron: 8,
    vitaminC: 45,
    vitaminA: 600
  }
}

// Health score calculation
export const calculateHealthScore = (nutrition) => {
  let score = 5 // Base score

  // Positive factors
  if (nutrition.vitaminC > 20) score += 2
  if (nutrition.vitaminA > 100) score += 2
  if (nutrition.fiber > 3) score += 2
  if (nutrition.protein > 5) score += 1
  if (nutrition.potassium > 200) score += 1

  // Negative factors
  if (nutrition.sodium > 500) score -= 2
  if (nutrition.sugar > 15) score -= 2
  if (nutrition.fat > 20) score -= 1
  if (nutrition.calories > 300) score -= 1

  return Math.max(1, Math.min(10, score))
}

// Get nutrition info for detected object
export const getNutritionInfo = (className) => {
  const foodItem = NUTRITION_DATABASE[className.toLowerCase()]
  if (foodItem) {
    return {
      ...foodItem,
      healthScore: foodItem.kidFriendly?.healthScore || calculateHealthScore(foodItem.nutrition)
    }
  }
  return null
}

// Get health recommendations based on nutrition
export const getHealthRecommendations = (nutrition, isKid = true) => {
  const recommendations = []

  if (nutrition.calories > 300) {
    recommendations.push({
      type: 'warning',
      message: isKid ? 'This food has lots of energy! Great for active play!' : 'High calorie content - enjoy in moderation'
    })
  }

  if (nutrition.sugar > 15) {
    recommendations.push({
      type: 'caution',
      message: isKid ? 'Sweet treat! Remember to brush your teeth after!' : 'High sugar content - limit consumption'
    })
  }

  if (nutrition.sodium > 500) {
    recommendations.push({
      type: 'caution',
      message: isKid ? 'This food is quite salty! Drink water with it!' : 'High sodium content - monitor intake'
    })
  }

  if (nutrition.vitaminC > 20) {
    recommendations.push({
      type: 'positive',
      message: isKid ? 'Wow! This helps fight off germs and keeps you healthy!' : 'Excellent source of vitamin C'
    })
  }

  if (nutrition.calcium > 100) {
    recommendations.push({
      type: 'positive',
      message: isKid ? 'Great for strong bones and teeth!' : 'Good source of calcium'
    })
  }

  if (nutrition.fiber > 3) {
    recommendations.push({
      type: 'positive',
      message: isKid ? 'Helps keep your tummy happy and healthy!' : 'Good source of dietary fiber'
    })
  }

  return recommendations
}

// Format nutrition value for display
export const formatNutritionValue = (value, unit = 'g') => {
  if (value < 1) {
    return `${(value * 1000).toFixed(0)}m${unit}`
  }
  return `${value.toFixed(1)}${unit}`
}

// Get nutrition color coding
export const getNutritionColor = (value, type) => {
  const thresholds = {
    calories: { low: 100, high: 300 },
    sugar: { low: 5, high: 15 },
    sodium: { low: 100, high: 500 },
    fat: { low: 3, high: 15 },
    protein: { low: 5, high: 15 },
    fiber: { low: 2, high: 5 },
    vitaminC: { low: 10, high: 30 }
  }

  const threshold = thresholds[type]
  if (!threshold) return 'text-gray-600'

  if (type === 'sugar' || type === 'sodium' || type === 'fat' || type === 'calories') {
    // Lower is better for these
    if (value <= threshold.low) return 'text-green-600'
    if (value <= threshold.high) return 'text-yellow-600'
    return 'text-red-600'
  } else {
    // Higher is better for these
    if (value >= threshold.high) return 'text-green-600'
    if (value >= threshold.low) return 'text-yellow-600'
    return 'text-red-600'
  }
}

export default NUTRITION_DATABASE
