<template>
  <div class="nutrition-card-container">
    <div class="nutrition-card" v-if="advice">
      <div class="card-header" :style="advice.recommendation.headerCss">
        <h2>{{ nutritionInfo.productName }}</h2>
        <p>个性化营养评估</p>
        <div class="recommendation-details">
          <div class="recommendation-lozenge">{{ advice.recommendation.text }}</div>
          <div class="star-rating">
            <span 
              v-for="i in 5" 
              :key="i" 
              class="star"
              :class="{ filled: i <= advice.recommendation.stars }"
            >
              ★
            </span>
          </div>
        </div>
      </div>
      
      <div class="card-body">
        <div class="warning-section">
          <h3 class="section-title">潜在问题</h3>
          <div class="warning-list">
            {{ advice.potentialIssues.join('；') || '暂无明显问题' }}
          </div>
        </div>
        
        <div class="tips-section">
          <h3 class="section-title">健康提示</h3>
          <ul class="tips-list">
            <li v-for="(tip, index) in advice.healthTips" :key="index">
              {{ tip }}
            </li>
          </ul>
        </div>

        <div class="nutrition-summary">
          <h3 class="section-title">营养成分概览</h3>
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <div class="nutrition-value">{{ nutritionInfo.energyKcal }}</div>
              <div class="nutrition-label">热量 (kcal)</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-value">{{ nutritionInfo.protein }}g</div>
              <div class="nutrition-label">蛋白质</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-value">{{ nutritionInfo.fat }}g</div>
              <div class="nutrition-label">脂肪</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-value">{{ nutritionInfo.sodium }}mg</div>
              <div class="nutrition-label">钠</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-value">{{ nutritionInfo.sugars }}g</div>
              <div class="nutrition-label">糖</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-value">{{ nutritionInfo.carbohydrates }}g</div>
              <div class="nutrition-label">碳水化合物</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card-actions">
      <el-button @click="$emit('back')" icon="ArrowLeft">
        返回上一步
      </el-button>
      <el-button type="primary" @click="generateNewAnalysis">
        <el-icon><Refresh /></el-icon>
        重新分析
      </el-button>
      <el-button @click="exportCard">
        <el-icon><Download /></el-icon>
        导出建议卡
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Refresh, Download } from '@element-plus/icons-vue'
import { generateNutritionAdvice } from '../utils/nutritionAnalysis'
import type { NutritionInfo, UserInfo, NutritionAdvice } from '../types'

interface Props {
  nutritionInfo: NutritionInfo
  userInfo: UserInfo
}

const props = defineProps<Props>()

const emit = defineEmits<{
  restart: []
  back: []
}>()

const advice = computed<NutritionAdvice>(() => {
  return generateNutritionAdvice(props.nutritionInfo, props.userInfo)
})

const generateNewAnalysis = () => {
  emit('restart')
}

const exportCard = () => {
  // 创建HTML内容用于导出
  const htmlContent = generateHTMLCard()
  
  // 创建下载链接
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.nutritionInfo.productName}-营养建议卡.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const generateHTMLCard = (): string => {
  const adviceData = advice.value
  const nutrition = props.nutritionInfo
  
  // 生成星级评分HTML
  const stars = Array(5).fill(0).map((_, i) => 
    `<span class="star" style="color: ${i < adviceData.recommendation.stars ? '#fff' : 'rgba(255,255,255,0.3)'}">★</span>`
  ).join('')

  // 生成健康提示HTML
  const tipsHTML = adviceData.healthTips.map(tip => 
    `<li>${tip}</li>`
  ).join('\n')

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>健康饮食建议卡 - ${nutrition.productName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }
  
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f7fa;
    padding: 20px; 
  }
  
  .nutrition-card {
    width: 100%; 
    max-width: 380px; 
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  }
  
  .card-header {
    color: white;
    padding: 20px;
    position: relative;
    text-align: left; 
  }
  
  .card-header h2 {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  .card-header p {
    font-size: 14px;
    opacity: 0.9; 
    margin-bottom: 15px;
  }

  .recommendation-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  .recommendation-lozenge {
    background: rgba(255,255,255,0.25); 
    padding: 6px 12px;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 500;
    backdrop-filter: blur(2px); 
    margin-right: 10px;
  }
  
  .star-rating {
    display: flex;
    align-items: center;
  }
  
  .star {
    color: #fff;
    font-size: 20px;
    margin-left: 1px;
    text-shadow: 0px 1px 2px rgba(0,0,0,0.2); 
  }
  
  .card-body {
    padding: 20px;
  }
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 15px 0; 
    color: #333;
  }

  .warning-section {
    margin-top: 0; 
  }

  .warning-list {
    background: #fffbeb; 
    padding: 12px 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #725c0d; 
    border-left: 5px solid #FFC107; 
  }
  
  .tips-section {
     margin-top: 25px;
  }

  .tips-list {
    list-style: none;
  }
  
  .tips-list li {
    position: relative;
    padding-left: 25px;
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 1.5;
    color: #444;
  }
  
  .tips-list li:before {
    content: "💡"; 
    position: absolute;
    left: 0;
    top: 0px; 
    font-size: 16px; 
  }

  .nutrition-summary {
    margin-top: 25px;
  }

  .nutrition-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 12px;
  }

  .nutrition-item {
    text-align: center;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .nutrition-value {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .nutrition-label {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
  }
</style>
</head>
<body>
  <div class="nutrition-card">
    <div class="card-header" style="${adviceData.recommendation.headerCss}">
      <h2>${nutrition.productName}</h2>
      <p>个性化营养评估</p>
      <div class="recommendation-details">
        <div class="recommendation-lozenge">${adviceData.recommendation.text}</div>
        <div class="star-rating">
          ${stars}
        </div>
      </div>
    </div>
    
    <div class="card-body">
      <div class="warning-section">
          <h3 class="section-title">潜在问题</h3>
          <div class="warning-list">
            ${adviceData.potentialIssues.join('；') || '暂无明显问题'}
          </div>
      </div>
      
      <div class="tips-section">
          <h3 class="section-title">健康提示</h3>
          <ul class="tips-list">
            ${tipsHTML}
          </ul>
      </div>

      <div class="nutrition-summary">
        <h3 class="section-title">营养成分概览</h3>
        <div class="nutrition-grid">
          <div class="nutrition-item">
            <div class="nutrition-value">${nutrition.energyKcal}</div>
            <div class="nutrition-label">热量 (kcal)</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">${nutrition.protein}g</div>
            <div class="nutrition-label">蛋白质</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">${nutrition.fat}g</div>
            <div class="nutrition-label">脂肪</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">${nutrition.sodium}mg</div>
            <div class="nutrition-label">钠</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">${nutrition.sugars}g</div>
            <div class="nutrition-label">糖</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">${nutrition.carbohydrates}g</div>
            <div class="nutrition-label">碳水化合物</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
}
</script>

<style scoped>
.nutrition-card-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.nutrition-card {
  width: 100%; 
  max-width: 380px; 
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  margin: 0 auto;
  text-align: left;
}

.card-header {
  color: white;
  padding: 20px;
  position: relative;
  text-align: left; 
}

.card-header h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 5px;
}

.card-header p {
  font-size: 14px;
  opacity: 0.9; 
  margin-bottom: 15px;
}

.recommendation-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.recommendation-lozenge {
  background: rgba(255,255,255,0.25); 
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 500;
  backdrop-filter: blur(2px); 
  margin-right: 10px;
}

.star-rating {
  display: flex;
  align-items: center;
}

.star {
  color: #fff;
  font-size: 20px;
  margin-left: 1px;
  text-shadow: 0px 1px 2px rgba(0,0,0,0.2); 
}

.star.filled {
  color: #fff;
}

.star:not(.filled) {
  color: rgba(255,255,255,0.3);
}

.card-body {
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 15px 0; 
  color: #333;
}

.warning-section {
  margin-top: 0; 
}

.warning-list {
  background: #fffbeb; 
  padding: 12px 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #725c0d; 
  border-left: 5px solid #FFC107; 
  line-height: 1.6;
}

.tips-section {
   margin-top: 25px;
}

.tips-list {
  list-style: none;
}

.tips-list li {
  position: relative;
  padding-left: 25px;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #444;
}

.tips-list li:before {
  content: "💡"; 
  position: absolute;
  left: 0;
  top: 0px; 
  font-size: 16px; 
}

.nutrition-summary {
  margin-top: 25px;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 12px;
}

.nutrition-item {
  text-align: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.nutrition-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.nutrition-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.card-actions {
  margin-top: 24px;
  text-align: center;
}

.card-actions .el-button {
  margin: 0 8px;
}
</style>