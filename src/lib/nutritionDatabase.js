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

  // Indonesian Foods
  'nasi': {
    name: 'Nasi Putih',
    category: 'Grains',
    emoji: '🍚',
    nutrition: {
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3,
      fiber: 0.4,
      sugar: 0.1,
      sodium: 1,
      potassium: 55,
      calcium: 28,
      iron: 0.8,
      vitaminB1: 0.1,
      vitaminB3: 1.6
    },
    benefits: [
      'Sumber energi utama dari karbohidrat',
      'Mengandung vitamin B untuk metabolisme',
      'Mudah dicerna oleh anak-anak',
      'Cocok dikombinasikan dengan lauk sehat'
    ],
    kidFriendly: {
      description: 'Makanan pokok yang memberikan energi untuk main dan belajar!',
      funFact: 'Nasi adalah makanan pokok lebih dari setengah penduduk dunia! 🌏',
      healthScore: 7
    }
  },

  'ayam': {
    name: 'Ayam',
    category: 'Protein',
    emoji: '🍗',
    nutrition: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      potassium: 256,
      calcium: 11,
      iron: 0.9,
      vitaminB6: 0.5,
      vitaminB12: 0.3
    },
    benefits: [
      'Protein tinggi untuk pertumbuhan otot',
      'Sumber vitamin B yang baik',
      'Rendah lemak jenuh',
      'Mengandung mineral penting'
    ],
    kidFriendly: {
      description: 'Protein hebat untuk tumbuh kuat dan sehat!',
      funFact: 'Ayam adalah salah satu sumber protein terbaik untuk anak-anak! 💪',
      healthScore: 9
    }
  },

  'ikan': {
    name: 'Ikan',
    category: 'Protein',
    emoji: '🐟',
    nutrition: {
      calories: 206,
      protein: 22,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sugar: 0,
      sodium: 59,
      potassium: 363,
      calcium: 16,
      iron: 0.2,
      omega3: 1.8,
      vitaminD: 10.9
    },
    benefits: [
      'Kaya omega-3 untuk perkembangan otak',
      'Protein berkualitas tinggi',
      'Sumber vitamin D alami',
      'Baik untuk kesehatan jantung'
    ],
    kidFriendly: {
      description: 'Makanan pintar yang membuat otak cerdas!',
      funFact: 'Ikan mengandung omega-3 yang membuat otak jadi super pintar! 🧠',
      healthScore: 10
    }
  },

  'tempe': {
    name: 'Tempe',
    category: 'Protein',
    emoji: '🟤',
    nutrition: {
      calories: 193,
      protein: 19,
      carbs: 9,
      fat: 11,
      fiber: 9,
      sugar: 0,
      sodium: 9,
      potassium: 412,
      calcium: 111,
      iron: 2.7,
      vitaminB12: 0.1,
      folate: 24
    },
    benefits: [
      'Protein nabati lengkap',
      'Tinggi serat untuk pencernaan',
      'Sumber probiotik alami',
      'Kaya mineral dan vitamin'
    ],
    kidFriendly: {
      description: 'Makanan tradisional Indonesia yang sangat bergizi!',
      funFact: 'Tempe dibuat dari kedelai yang difermentasi selama 2-3 hari! 🇮🇩',
      healthScore: 9
    }
  },

  'tahu': {
    name: 'Tahu',
    category: 'Protein',
    emoji: '⬜',
    nutrition: {
      calories: 76,
      protein: 8,
      carbs: 1.9,
      fat: 4.8,
      fiber: 0.3,
      sugar: 0.6,
      sodium: 7,
      potassium: 121,
      calcium: 350,
      iron: 5.4,
      magnesium: 37,
      zinc: 0.8
    },
    benefits: [
      'Protein nabati berkualitas',
      'Sangat tinggi kalsium',
      'Rendah kalori',
      'Mudah dicerna anak'
    ],
    kidFriendly: {
      description: 'Putih lembut dan penuh kalsium untuk tulang kuat!',
      funFact: 'Tahu mengandung kalsium lebih banyak dari susu! 🦴',
      healthScore: 8
    }
  },

  'sayur': {
    name: 'Sayuran Hijau',
    category: 'Vegetables',
    emoji: '🥬',
    nutrition: {
      calories: 23,
      protein: 2.9,
      carbs: 4.6,
      fat: 0.4,
      fiber: 2.6,
      sugar: 2.3,
      sodium: 28,
      potassium: 558,
      calcium: 99,
      iron: 1.5,
      vitaminA: 469,
      vitaminC: 30,
      vitaminK: 483,
      folate: 194
    },
    benefits: [
      'Sangat tinggi vitamin A dan C',
      'Kaya folat untuk pertumbuhan',
      'Tinggi serat dan rendah kalori',
      'Antioksidan untuk daya tahan tubuh'
    ],
    kidFriendly: {
      description: 'Sayuran hijau membuat mata tajam dan tubuh sehat!',
      funFact: 'Sayuran hijau mengandung klorofil yang membuat tanaman berwarna hijau! 🌱',
      healthScore: 10
    }
  },

  'sosis': {
    name: 'Sosis',
    category: 'Processed Meat',
    emoji: '🌭',
    nutrition: {
      calories: 301,
      protein: 12,
      carbs: 2,
      fat: 27,
      fiber: 0,
      sugar: 1.2,
      sodium: 1047,
      potassium: 204,
      calcium: 11,
      iron: 1.4,
      vitaminB12: 1.5,
      zinc: 2.4
    },
    benefits: [
      'Sumber protein untuk pertumbuhan',
      'Mengandung vitamin B12',
      'Sumber energi cepat'
    ],
    concerns: [
      'Tinggi sodium - batasi konsumsi',
      'Tinggi lemak jenuh',
      'Makanan olahan - konsumsi sesekali'
    ],
    kidFriendly: {
      description: 'Sosis enak tapi harus dimakan sedikit karena banyak garam!',
      funFact: 'Sosis pertama dibuat di Jerman lebih dari 500 tahun lalu! 🇩🇪',
      healthScore: 3
    }
  },

  'telur mata sapi': {
    name: 'Telur Mata Sapi',
    category: 'Protein',
    emoji: '🍳',
    nutrition: {
      calories: 196,
      protein: 14,
      carbs: 0.8,
      fat: 15,
      fiber: 0,
      sugar: 0.8,
      sodium: 207,
      potassium: 138,
      calcium: 56,
      iron: 1.8,
      vitaminA: 184,
      vitaminB12: 1.3,
      vitaminD: 41,
      choline: 294
    },
    benefits: [
      'Protein berkualitas tinggi dengan semua asam amino',
      'Kaya kolin untuk perkembangan otak',
      'Sumber vitamin D alami',
      'Mudah dicerna dan bergizi tinggi'
    ],
    kidFriendly: {
      description: 'Telur mata sapi mengandung semua nutrisi penting untuk tumbuh pintar dan kuat!',
      funFact: 'Kuning telur mengandung hampir semua vitamin yang dibutuhkan tubuh! 🧠',
      healthScore: 9
    }
  },

  'susu coklat': {
    name: 'Susu Coklat',
    category: 'Dairy',
    emoji: '🥛',
    nutrition: {
      calories: 83,
      protein: 3.4,
      carbs: 12,
      fat: 2.5,
      fiber: 0.4,
      sugar: 11,
      sodium: 59,
      potassium: 197,
      calcium: 118,
      iron: 0.3,
      vitaminD: 1.3,
      vitaminB12: 0.5
    },
    benefits: [
      'Kalsium tinggi untuk tulang dan gigi kuat',
      'Protein berkualitas untuk pertumbuhan',
      'Sumber energi dari karbohidrat',
      'Mengandung vitamin D dan B12'
    ],
    concerns: [
      'Tinggi gula tambahan',
      'Kalori lebih tinggi dari susu biasa'
    ],
    kidFriendly: {
      description: 'Susu coklat enak dan bergizi, tapi jangan terlalu sering karena manis!',
      funFact: 'Susu coklat ditemukan oleh apoteker Irlandia pada tahun 1828! 🍫',
      healthScore: 6
    }
  },

  'telur': {
    name: 'Telur',
    category: 'Protein',
    emoji: '🥚',
    nutrition: {
      calories: 155,
      protein: 13,
      carbs: 1.1,
      fat: 11,
      fiber: 0,
      sugar: 1.1,
      sodium: 124,
      potassium: 138,
      calcium: 50,
      iron: 1.2,
      vitaminA: 149,
      vitaminB12: 1.1,
      vitaminD: 20,
      choline: 294
    },
    benefits: [
      'Protein lengkap dengan semua asam amino',
      'Kaya kolin untuk perkembangan otak',
      'Sumber vitamin D alami',
      'Mudah diolah dan dicerna'
    ],
    kidFriendly: {
      description: 'Makanan super yang mengandung semua nutrisi penting!',
      funFact: 'Telur mengandung semua vitamin kecuali vitamin C! 🌟',
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
