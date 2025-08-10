// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.mmowl.top/v1',
  apiKey: import.meta.env.VITE_API_KEY || '',
  model: 'gpt-4o-mini',
  maxTokens: 2000,
  temperature: 0.1
}

// Enhanced field mapping for Chinese to English conversion
export const FIELD_MAPPING = {
  // Basic fields
  '产品名称': 'productName',
  'productName': 'productName',
  '名称': 'productName',
  '品名': 'productName',
  
  // Serving size
  '每份量': 'servingSize',
  'servingSize': 'servingSize',
  '份量': 'servingSize',
  '规格': 'servingSize',
  '每100克': 'servingSize',
  '每100ml': 'servingSize',
  
  // Energy
  '热量': 'energyKcal',
  'energyKcal': 'energyKcal',
  '能量': 'energyKcal',
  '卡路里': 'energyKcal',
  '千焦': 'energyKj',
  'energyKj': 'energyKj',
  'kJ': 'energyKj',
  
  // Protein
  '蛋白质': 'protein',
  'protein': 'protein',
  
  // Fat
  '脂肪': 'fat',
  'fat': 'fat',
  '总脂肪': 'fat',
  
  // Saturated fat
  '饱和脂肪': 'saturatedFat',
  'saturatedFat': 'saturatedFat',
  
  // Carbohydrates
  '碳水化合物': 'carbohydrates',
  'carbohydrates': 'carbohydrates',
  '碳水': 'carbohydrates',
  '总碳水化合物': 'carbohydrates',
  
  // Sugars
  '糖': 'sugars',
  'sugars': 'sugars',
  '添加糖': 'sugars',
  '总糖': 'sugars',
  
  // Sodium
  '钠': 'sodium',
  'sodium': 'sodium',
  
  // Fiber
  '膳食纤维': 'fiber',
  'fiber': 'fiber',
  '纤维': 'fiber',
  
  // Ingredients
  '成分': 'ingredients',
  'ingredients': 'ingredients',
  '配料': 'ingredients',
  '原料': 'ingredients'
} as const

// Unit patterns for extraction
export const UNIT_PATTERNS = {
  energy: [/(\d+(?:\.\d+)?)\s*kcal/i, /(\d+(?:\.\d+)?)\s*千卡/i],
  energyKj: [/(\d+(?:\.\d+)?)\s*kJ/i, /(\d+(?:\.\d+)?)\s*千焦/i],
  weight: [/(\d+(?:\.\d+)?)\s*g/i, /(\d+(?:\.\d+)?)\s*克/i],
  sodium: [/(\d+(?:\.\d+)?)\s*mg/i, /(\d+(?:\.\d+)?)\s*毫克/i]
}

// Default values for missing fields
export const DEFAULT_VALUES = {
  productName: '未知产品',
  energyKcal: 0,
  energyKj: 0,
  protein: 0,
  fat: 0,
  carbohydrates: 0,
  sugars: 0,
  sodium: 0,
  ingredients: [],
  servingSize: '每100克'
}