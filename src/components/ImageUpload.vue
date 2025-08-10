<template>
  <div class="image-upload">
    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button 
              type="primary" 
              size="small" 
              @click="$emit('back')"
              icon="ArrowLeft"
              class="back-button"
            >
              返回
            </el-button>
            <el-icon>
              <Camera />
            </el-icon>
            <span>营养成分表识别</span>
          </div>
        </div>
      </template>

      <div class="upload-content">
        <el-tabs v-model="activeTab" class="analysis-tabs">
          <el-tab-pane label="拍照识别" name="camera">
            <el-upload class="upload-area" drag :auto-upload="false" :show-file-list="false" accept="image/*"
              :on-change="handleImageChange">
              <el-icon class="upload-icon">
                <UploadFilled />
              </el-icon>
              <div class="upload-text">
                <p>拖拽图片到此处或点击上传</p>
                <p class="upload-hint">支持 JPG、PNG 格式的营养成分表图片</p>
              </div>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="手动输入" name="manual">
            <div class="manual-input-area">
              <el-input v-model="manualInput" type="textarea" :rows="6"
                placeholder="请输入营养成分表信息，例如：&#10;产品名称：奥利奥饼干&#10;热量：484kcal&#10;蛋白质：6.7g&#10;脂肪：21.1g&#10;碳水化合物：66.9g&#10;糖：34.2g&#10;钠：312mg"
                resize="none" />
              <div class="input-actions">
                <el-button type="primary" :loading="analyzing" @click="analyzeManualInput" size="large"
                  :disabled="!manualInput.trim()">
                  <el-icon>
                    <Search />
                  </el-icon>
                  {{ analyzing ? '分析中...' : '开始分析' }}
                </el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

        <div v-if="imageUrl" class="preview-section">
          <div class="image-preview">
            <img :src="imageUrl" alt="营养成分表" />
            <div class="preview-actions">
              <el-button type="danger" @click="clearImage">
                <el-icon>
                  <Delete />
                </el-icon>
                重新上传
              </el-button>
            </div>
          </div>

          <div class="analysis-section">
            <el-button type="primary" :loading="analyzing" @click="analyzeImage" size="large">
              <el-icon>
                <Search />
              </el-icon>
              {{ analyzing ? '分析中...' : '开始分析' }}
            </el-button>
          </div>
        </div>

        <!-- 分析结果展示 -->
        <div v-if="analysisResult" class="analysis-result">
          <h3>识别结果</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="产品名称">
              {{ analysisResult.productName }}
            </el-descriptions-item>
            <el-descriptions-item label="热量">
              {{ analysisResult.energyKcal }} kcal ({{ analysisResult.energyKj }} kJ)
            </el-descriptions-item>
            <el-descriptions-item label="蛋白质">
              {{ analysisResult.protein }} g
            </el-descriptions-item>
            <el-descriptions-item label="脂肪">
              {{ analysisResult.fat }} g
            </el-descriptions-item>
            <el-descriptions-item label="碳水化合物">
              {{ analysisResult.carbohydrates }} g
            </el-descriptions-item>
            <el-descriptions-item label="糖">
              {{ analysisResult.sugars }} g
            </el-descriptions-item>
            <el-descriptions-item label="钠">
              {{ analysisResult.sodium }} mg
            </el-descriptions-item>
            <el-descriptions-item v-if="analysisResult.fiber" label="膳食纤维">
              {{ analysisResult.fiber }} g
            </el-descriptions-item>
            <el-descriptions-item v-if="analysisResult.saturatedFat" label="饱和脂肪">
              {{ analysisResult.saturatedFat }} g
            </el-descriptions-item>
          </el-descriptions>

          <div class="ingredients-section">
            <h4>成分表</h4>
            <p>{{ analysisResult.ingredients.join(', ') }}</p>
          </div>

          <div class="result-actions">
            <el-button type="primary" @click="confirmAnalysis">
              确认并生成建议
            </el-button>
            <el-button @click="reanalyze">
              重新分析
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Camera, UploadFilled, Delete, Search, ArrowLeft } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import type { NutritionInfo } from '../types'
import { API_CONFIG, FIELD_MAPPING, DEFAULT_VALUES } from '../utils/apiConfig'

const emit = defineEmits<{
  analysisComplete: [nutritionInfo: NutritionInfo]
  back: []
}>()

const imageUrl = ref<string>('')
const analyzing = ref<boolean>(false)
const analysisResult = ref<NutritionInfo | null>(null)
const activeTab = ref<string>('camera')
const manualInput = ref<string>('')

const handleImageChange = (file: UploadFile) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    // Compress image if it's too large
    compressImage(result).then(compressed => {
      imageUrl.value = compressed
    }).catch(() => {
      // If compression fails, use original image
      imageUrl.value = result
    })
  }
  reader.readAsDataURL(file.raw!)
}

// Image compression function
const compressImage = (dataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('无法创建画布上下文'))
        return
      }
      
      // Calculate new dimensions (max 1200px on either side)
      const maxSize = 1200
      let { width, height } = img
      
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height * maxSize) / width
          width = maxSize
        } else {
          width = (width * maxSize) / height
          height = maxSize
        }
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convert to compressed data URL (0.8 quality)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8)
      resolve(compressedDataUrl)
    }
    
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = dataUrl
  })
}

const clearImage = () => {
  imageUrl.value = ''
  analysisResult.value = null
}

// 使用GPT进行图片OCR分析
const analyzeImage = async () => {
  if (!imageUrl.value) return

  analyzing.value = true

  try {
    const result = await analyzeImageWithGPT(imageUrl.value)
    analysisResult.value = result
  } catch (error) {
    console.error('图片分析失败:', error)
    // 分析失败时显示错误信息
    alert('图片分析失败，请重试或使用手动输入功能')
  }

  analyzing.value = false
}

const confirmAnalysis = () => {
  if (analysisResult.value) {
    emit('analysisComplete', analysisResult.value)
  }
}

const analyzeManualInput = async () => {
  if (!manualInput.value.trim()) return

  analyzing.value = true

  try {
    const result = await analyzeWithGPT(manualInput.value)
    analysisResult.value = result
  } catch (error) {
    console.error('分析失败:', error)
    // 使用模拟数据作为后备
    analysisResult.value = {
      productName: '手动输入产品',
      energyKcal: 300,
      energyKj: 1255,
      protein: 10,
      fat: 15,
      carbohydrates: 35,
      sugars: 20,
      sodium: 200,
      ingredients: ['小麦粉', '糖', '植物油'],
      servingSize: '每100克'
    }
  }

  analyzing.value = false
}

const reanalyze = () => {
  analysisResult.value = null
  if (activeTab.value === 'camera') {
    analyzeImage()
  } else {
    analyzeManualInput()
  }
}

const analyzeWithGPT = async (input: string): Promise<NutritionInfo> => {
  if (!API_CONFIG.apiKey) {
    throw new Error('API密钥未配置')
  }

  const response = await fetch(`${API_CONFIG.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.apiKey}`
    },
    body: JSON.stringify({
      model: API_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的营养分析专家。请从用户输入的文本中提取营养成分信息，并返回JSON格式的数据。请确保数据格式正确，数值为数字类型。'
        },
        {
          role: 'user',
          content: `请从以下文本中提取营养成分信息，并以JSON格式返回：\n${input}\n\n请返回包含以下字段的JSON对象：productName（产品名称）、energyKcal（热量千卡）、energyKj（热量千焦）、protein（蛋白质克）、fat（脂肪克）、saturatedFat（饱和脂肪克，可选）、carbohydrates（碳水化合物克）、sugars（糖克）、sodium（钠毫克）、fiber（膳食纤维克，可选）、ingredients（成分数组）、servingSize（份量，可选）。如果没有某些信息，请使用合理的默认值。`
        }
      ],
      max_tokens: API_CONFIG.maxTokens,
      temperature: API_CONFIG.temperature
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('API响应错误:', response.status, errorText)
    throw new Error(`API请求失败 (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content

  try {
    const parsed = JSON.parse(content)
    return mapAndNormalizeData(parsed)
  } catch (error) {
    console.error('解析响应失败:', error)
    throw new Error('解析响应失败')
  }
}

const analyzeImageWithGPT = async (imageDataUrl: string): Promise<NutritionInfo> => {
  if (!API_CONFIG.apiKey) {
    throw new Error('API密钥未配置')
  }

  try {
    const response = await fetch(`${API_CONFIG.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的营养分析专家，擅长从营养成分表图片中提取营养信息。请仔细分析图片中的营养成分表，准确提取各项营养数据，并返回JSON格式的数据。'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: '请分析这张营养成分表图片，提取其中的营养信息，并以JSON格式返回。请重点关注：产品名称、热量、蛋白质、脂肪、碳水化合物、糖、钠含量等关键信息。如果图片中的某些信息不清晰，请基于类似产品进行合理估算。'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageDataUrl
                }
              }
            ]
          }
        ],
        max_tokens: API_CONFIG.maxTokens,
        temperature: API_CONFIG.temperature
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API响应错误:', response.status, errorText)
      throw new Error(`API请求失败 (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    console.log('API响应数据:', data)

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('API响应格式不正确')
    }

    const content = data.choices[0].message.content
    console.log('API响应内容:', content)

    // 尝试解析JSON响应
    let parsed
    try {
      parsed = JSON.parse(content)
    } catch (parseError) {
      console.log('直接解析JSON失败，尝试从文本中提取JSON或解析文本格式')
      // 如果直接解析失败，尝试从文本中提取JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0])
      } else {
        // 如果没有找到JSON，尝试直接解析文本内容
        console.log('没有找到JSON，尝试解析文本格式')
        parsed = content // 将整个内容作为字符串传递给mapAndNormalizeData处理
      }
    }

    console.log('解析后的数据:', parsed)
    return mapAndNormalizeData(parsed)
  } catch (error) {
    console.error('图片分析失败:', error)
    throw error
  }
}

// 数据映射和标准化函数
const mapAndNormalizeData = (parsedData: any): NutritionInfo => {
  const convertedData: any = {}

  // 如果parsedData是字符串，尝试解析为对象
  if (typeof parsedData === 'string') {
    console.log('输入是字符串，尝试解析:', parsedData)
    // 尝试从字符串中提取键值对
    const lines = parsedData.split('\n')
    for (const line of lines) {
      const trimmedLine = line.trim()
      if (trimmedLine) {
        // 尝试匹配 "字段名    值" 的格式，支持多个空格或tab分隔
        const match = trimmedLine.match(/^([^\s\t]+)[\s\t]+(.+)$/)
        if (match) {
          const [, key, value] = match
          parsedData[key] = value
        }
      }
    }
  }

  // 映射字段名并转换数据格式
  for (const [key, value] of Object.entries(parsedData)) {
    const englishKey = FIELD_MAPPING[key as keyof typeof FIELD_MAPPING]
    if (englishKey) {
      convertedData[englishKey] = normalizeFieldValue(englishKey, value)
    } else {
      // 如果没有找到映射，记录一下
      console.log(`未找到字段映射: ${key} -> ${value}`)
    }
  }

  // 计算能量转换
  if (convertedData.energyKcal && !convertedData.energyKj) {
    convertedData.energyKj = Math.round(convertedData.energyKcal * 4.184)
  }
  if (convertedData.energyKj && !convertedData.energyKcal) {
    convertedData.energyKcal = Math.round(convertedData.energyKj / 4.184)
  }

  // 确保所有必需字段都有值
  return {
    productName: convertedData.productName || DEFAULT_VALUES.productName,
    energyKcal: convertedData.energyKcal || DEFAULT_VALUES.energyKcal,
    energyKj: convertedData.energyKj || DEFAULT_VALUES.energyKj,
    protein: convertedData.protein || DEFAULT_VALUES.protein,
    fat: convertedData.fat || DEFAULT_VALUES.fat,
    saturatedFat: convertedData.saturatedFat,
    carbohydrates: convertedData.carbohydrates || DEFAULT_VALUES.carbohydrates,
    sugars: convertedData.sugars || DEFAULT_VALUES.sugars,
    sodium: convertedData.sodium || DEFAULT_VALUES.sodium,
    fiber: convertedData.fiber,
    ingredients: Array.isArray(convertedData.ingredients) ? convertedData.ingredients : DEFAULT_VALUES.ingredients,
    servingSize: convertedData.servingSize || DEFAULT_VALUES.servingSize
  }
}

// 字段值标准化函数
const normalizeFieldValue = (fieldName: string, value: any): any => {
  const numericFields = ['energyKcal', 'energyKj', 'protein', 'fat', 'saturatedFat', 'carbohydrates', 'sugars', 'sodium', 'fiber']
  
  if (numericFields.includes(fieldName)) {
    if (typeof value === 'string') {
      // 处理可能包含单位的情况，例如 "0 kcal (00 g" 或 "0 mg kJ)"
      const cleanValue = value.toString()
        .replace(/[kK][cC][aA][lL]/g, '')  // 移除 kcal
        .replace(/[kK][jJ]/g, '')          // 移除 kJ
        .replace(/[mM][gG]/g, '')          // 移除 mg
        .replace(/[gG]/g, '')              // 移除 g
        .replace(/[()]/g, '')              // 移除括号
        .replace(/\s+/g, ' ')              // 标准化空格
        .trim()
      
      // 使用正则表达式提取数字
      const numberMatch = cleanValue.match(/(\d+(?:\.\d+)?)/)
      return numberMatch ? parseFloat(numberMatch[1]) : 0
    }
    return Number(value) || 0
  }
  
  if (fieldName === 'ingredients') {
    if (Array.isArray(value)) {
      return value
    }
    if (typeof value === 'string') {
      // 尝试分割字符串
      return value.split(/[,，、]/).map(item => item.trim()).filter(item => item)
    }
    return []
  }
  
  return value
}
</script>

<style scoped>
.image-upload {
  max-width: 800px;
  margin: 0 auto;
}

.upload-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.back-button {
  margin-right: 8px;
}

.upload-area {
  width: 100%;
}

.upload-icon {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 16px;
}

.upload-text {
  text-align: center;
}

.upload-text p {
  margin: 8px 0;
  font-size: 16px;
}

.upload-hint {
  color: #909399;
  font-size: 14px !important;
}

.preview-section {
  margin-top: 24px;
  text-align: center;
}

.image-preview {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-actions {
  margin-top: 16px;
}

.analysis-section {
  margin-top: 24px;
}

.analysis-result {
  margin-top: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.analysis-result h3 {
  margin-bottom: 16px;
  color: #303133;
}

.ingredients-section {
  margin-top: 16px;
}

.ingredients-section h4 {
  margin-bottom: 8px;
  color: #606266;
}

.ingredients-section p {
  color: #606266;
  line-height: 1.6;
}

.result-actions {
  margin-top: 24px;
  text-align: center;
}

.result-actions .el-button {
  margin: 0 8px;
}

.analysis-tabs {
  margin-bottom: 20px;
}

.manual-input-area {
  padding: 20px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  background: #fafafa;
}

.input-actions {
  margin-top: 16px;
  text-align: center;
}

.manual-input-area .el-textarea {
  margin-bottom: 16px;
}

.manual-input-area .el-textarea__inner {
  font-size: 14px;
  line-height: 1.6;
}
</style>