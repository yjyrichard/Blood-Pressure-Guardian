export interface UserInfo {
  age: number
  gender: 'male' | 'female'
  height: number
  weight: number
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive'
  dailyCalories: number
  hasHypertension: boolean
  otherConditions: string[]
  allergies: string[]
}

export interface NutritionInfo {
  productName: string
  energyKcal: number
  energyKj: number
  protein: number
  fat: number
  saturatedFat?: number
  carbohydrates: number
  sugars: number
  sodium: number
  fiber?: number
  ingredients: string[]
  servingSize?: string
}

export interface RecommendationLevel {
  level: 'cannotEat' | 'tryLittle' | 'eatLess' | 'normal' | 'eatAsYouLike'
  text: string
  stars: number
  headerCss: string
}

export interface NutritionAdvice {
  recommendation: RecommendationLevel
  potentialIssues: string[]
  healthTips: string[]
}