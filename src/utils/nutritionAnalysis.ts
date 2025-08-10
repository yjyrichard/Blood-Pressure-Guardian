import type { UserInfo, NutritionInfo, RecommendationLevel, NutritionAdvice } from '../types'

export function calculateDailyCalories(
  gender: 'male' | 'female',
  age: number,
  height: number,
  weight: number,
  activityLevel: string
): number {
  // BMR计算 (Mifflin-St Jeor公式)
  let bmr: number
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  // 活动系数
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  }

  return Math.round(bmr * (activityFactors[activityLevel as keyof typeof activityFactors] || 1.2))
}

export function getRecommendationLevel(
  nutrition: NutritionInfo,
  _userInfo: UserInfo
): RecommendationLevel {
  let score = 100
  let reasons: string[] = []

  // 钠含量评估 (高血压人群重点关注)
  const sodiumPer100kcal = nutrition.sodium / (nutrition.energyKcal / 100)
  if (sodiumPer100kcal > 100) {
    score -= 30
    reasons.push('钠含量过高')
  } else if (sodiumPer100kcal > 50) {
    score -= 15
    reasons.push('钠含量偏高')
  }

  // 糖含量评估
  const sugarPer100kcal = nutrition.sugars / (nutrition.energyKcal / 100)
  if (sugarPer100kcal > 15) {
    score -= 20
    reasons.push('添加糖过多')
  } else if (sugarPer100kcal > 8) {
    score -= 10
    reasons.push('糖含量偏高')
  }

  // 饱和脂肪评估
  if (nutrition.saturatedFat) {
    const saturatedFatRatio = nutrition.saturatedFat / nutrition.fat
    if (saturatedFatRatio > 0.5) {
      score -= 15
      reasons.push('饱和脂肪比例高')
    }
  }

  // 膳食纤维评估
  if (nutrition.fiber && nutrition.fiber < 2) {
    score -= 5
    reasons.push('膳食纤维不足')
  }

  // 蛋白质评估
  const proteinRatio = nutrition.protein * 4 / nutrition.energyKcal
  if (proteinRatio < 0.1) {
    score -= 5
    reasons.push('蛋白质含量偏低')
  }

  // 根据得分确定推荐等级
  if (score >= 85) {
    return {
      level: 'eatAsYouLike',
      text: '🎉 想咋吃就咋吃',
      stars: 5,
      headerCss: 'background: linear-gradient(135deg, #1976D2, #0D47A1);'
    }
  } else if (score >= 70) {
    return {
      level: 'normal',
      text: '✅ 正常',
      stars: 4,
      headerCss: 'background: linear-gradient(135deg, #4CAF50, #388E3C);'
    }
  } else if (score >= 50) {
    return {
      level: 'eatLess',
      text: '🟡 少吃',
      stars: 3,
      headerCss: 'background: linear-gradient(135deg, #FFC107, #FF8F00);'
    }
  } else if (score >= 30) {
    return {
      level: 'tryLittle',
      text: '⚠️ 尝两口',
      stars: 2,
      headerCss: 'background: linear-gradient(135deg, #FFA000, #FF6F00);'
    }
  } else {
    return {
      level: 'cannotEat',
      text: '🚫 不能吃',
      stars: 1,
      headerCss: 'background: linear-gradient(135deg, #D32F2F, #B71C1C);'
    }
  }
}

export function generateNutritionAdvice(
  nutrition: NutritionInfo,
  userInfo: UserInfo
): NutritionAdvice {
  const recommendation = getRecommendationLevel(nutrition, userInfo)
  
  const potentialIssues: string[] = []
  const healthTips: string[] = []

  // 分析潜在问题
  const sodiumPer100kcal = nutrition.sodium / (nutrition.energyKcal / 100)
  if (sodiumPer100kcal > 100) {
    potentialIssues.push(`钠含量严重超标 (${sodiumPer100kcal.toFixed(1)}mg/100kcal)，不利于血压控制`)
  } else if (sodiumPer100kcal > 50) {
    potentialIssues.push(`钠含量偏高 (${sodiumPer100kcal.toFixed(1)}mg/100kcal)，建议适量食用`)
  }

  const sugarPer100kcal = nutrition.sugars / (nutrition.energyKcal / 100)
  if (sugarPer100kcal > 15) {
    potentialIssues.push(`添加糖过多 (${sugarPer100kcal.toFixed(1)}g/100kcal)，可能导致体重增加`)
  }

  if (nutrition.saturatedFat && nutrition.saturatedFat > 5) {
    potentialIssues.push(`饱和脂肪含量高 (${nutrition.saturatedFat}g)，可能影响心血管健康`)
  }

  // 生成健康建议
  if (userInfo.hasHypertension && sodiumPer100kcal > 30) {
    healthTips.push('高血压患者应严格控制钠摄入，建议选择低钠食品')
  }

  if (sugarPer100kcal > 8) {
    healthTips.push('减少添加糖摄入，有助于维持健康体重')
  }

  if (nutrition.fiber && nutrition.fiber < 3) {
    healthTips.push('建议搭配富含膳食纤维的食物一起食用')
  }

  if (recommendation.level === 'cannotEat' || recommendation.level === 'tryLittle') {
    healthTips.push('建议寻找更健康的替代食品')
  }

  healthTips.push('保持均衡饮食，适量运动，定期监测血压')

  return {
    recommendation,
    potentialIssues,
    healthTips
  }
}