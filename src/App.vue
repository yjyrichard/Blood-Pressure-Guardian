<script setup lang="ts">
import { ref } from 'vue'
import UserInfoForm from './components/UserInfoForm.vue'
import ImageUpload from './components/ImageUpload.vue'
import NutritionCard from './components/NutritionCard.vue'
import FoodGuide from './components/FoodGuide.vue'
import type { UserInfo, NutritionInfo } from './types'

const Step = {
  USER_INFO: 'user_info',
  IMAGE_UPLOAD: 'image_upload',
  RESULT: 'result'
} as const

type Step = typeof Step[keyof typeof Step]

const currentStep = ref<Step>(Step.USER_INFO)
const userInfo = ref<UserInfo | null>(null)
const nutritionInfo = ref<NutritionInfo | null>(null)
const showFoodGuide = ref<boolean>(false)

const handleUserInfoSubmit = (info: UserInfo) => {
  userInfo.value = info
  currentStep.value = Step.IMAGE_UPLOAD
}

const handleImageAnalysisComplete = (nutrition: NutritionInfo) => {
  nutritionInfo.value = nutrition
  currentStep.value = Step.RESULT
}

const handleRestart = () => {
  currentStep.value = Step.USER_INFO
  userInfo.value = null
  nutritionInfo.value = null
}

const handleBack = () => {
  if (currentStep.value === Step.IMAGE_UPLOAD) {
    currentStep.value = Step.USER_INFO
  } else if (currentStep.value === Step.RESULT) {
    currentStep.value = Step.IMAGE_UPLOAD
  }
}
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>🩺 血压守护者</h1>
      <p>@Author: Richard赤子</p>
      <p>高血压人群营养建议助手</p>
      <div class="header-actions">
        <el-button type="primary" size="large" @click="showFoodGuide = true" icon="Food">
          🍎 高血压饮食指南
        </el-button>
      </div>
    </header>

    <main class="main-content">
      <!-- 进度指示器 -->
      <div class="progress-indicator" v-if="currentStep !== Step.USER_INFO">
        <el-steps :active="currentStep === Step.IMAGE_UPLOAD ? 2 : 3" finish-status="success">
          <el-step title="个人信息" />
          <el-step title="图片识别" />
          <el-step title="营养建议" />
        </el-steps>
      </div>

      <!-- 用户信息表单 -->
      <UserInfoForm v-if="currentStep === Step.USER_INFO" @submit="handleUserInfoSubmit" />

      <!-- 图片上传 -->
      <ImageUpload v-else-if="currentStep === Step.IMAGE_UPLOAD" @analysis-complete="handleImageAnalysisComplete" @back="handleBack" />

      <!-- 营养建议卡 -->
      <NutritionCard v-else-if="currentStep === Step.RESULT && userInfo && nutritionInfo" :user-info="userInfo"
        :nutrition-info="nutritionInfo" @restart="handleRestart" @back="handleBack" />
    </main>

    <!-- 高血压饮食指南弹窗 -->
    <el-dialog v-model="showFoodGuide" title="🍎 高血压饮食指南" width="90%" max-width="800px"
      :before-close="() => showFoodGuide = false">
      <FoodGuide />
    </el-dialog>

    <footer class="app-footer">
      <p>💡 本工具仅供营养参考，不能替代专业医疗建议</p>
      <p>如有健康问题请咨询专业医生或营养师</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.app-header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.app-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.app-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.header-actions {
  margin-top: 20px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.progress-indicator {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.app-footer {
  text-align: center;
  color: white;
  margin-top: 40px;
  opacity: 0.8;
}

.app-footer p {
  margin: 5px 0;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
  }

  .app-header p {
    font-size: 1rem;
  }

  .app-container {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .app-header h1 {
    font-size: 1.5rem;
  }

  .progress-indicator {
    padding: 15px;
  }
}
</style>
