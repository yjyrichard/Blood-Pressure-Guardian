<template>
  <div class="user-info-form">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <el-icon><User /></el-icon>
          <span>个人信息</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        label-position="top"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number
                v-model="formData.age"
                :min="1"
                :max="120"
                placeholder="请输入年龄"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="formData.gender">
                <el-radio label="male">男</el-radio>
                <el-radio label="female">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身高 (cm)" prop="height">
              <el-input-number
                v-model="formData.height"
                :min="50"
                :max="250"
                placeholder="请输入身高"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体重 (kg)" prop="weight">
              <el-input-number
                v-model="formData.weight"
                :min="20"
                :max="200"
                placeholder="请输入体重"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="活动水平" prop="activityLevel">
          <el-select v-model="formData.activityLevel" placeholder="请选择活动水平">
            <el-option label="久坐 (很少或没有运动)" value="sedentary" />
            <el-option label="轻度运动 (每周1-3次)" value="light" />
            <el-option label="中度运动 (每周3-5次)" value="moderate" />
            <el-option label="剧烈运动 (每周6-7次)" value="active" />
            <el-option label="非常剧烈 (体力劳动或每天训练)" value="veryActive" />
          </el-select>
        </el-form-item>

        <el-form-item label="健康状况" prop="hasHypertension">
          <el-checkbox-group v-model="formData.healthConditions">
            <el-checkbox label="hypertension">高血压</el-checkbox>
            <el-checkbox label="diabetes">糖尿病</el-checkbox>
            <el-checkbox label="hyperlipidemia">高血脂</el-checkbox>
            <el-checkbox label="gout">痛风</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="食物过敏史" prop="allergies">
          <el-select
            v-model="formData.allergies"
            multiple
            collapse-tags
            placeholder="请选择过敏食物（可选）"
          >
            <el-option label="花生" value="花生" />
            <el-option label="牛奶" value="牛奶" />
            <el-option label="鸡蛋" value="鸡蛋" />
            <el-option label="大豆" value="大豆" />
            <el-option label="小麦" value="小麦" />
            <el-option label="坚果" value="坚果" />
            <el-option label="海鲜" value="海鲜" />
            <el-option label="芝麻" value="芝麻" />
          </el-select>
        </el-form-item>

        <div class="calculated-info">
          <div class="bmi-info">
            <span>BMI: {{ bmi }}</span>
            <span :class="bmiStatus.class">{{ bmiStatus.text }}</span>
          </div>
          <div class="calories-info">
            <span>建议每日热量: {{ formData.dailyCalories }} kcal</span>
          </div>
        </div>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :disabled="!isFormValid">
            下一步
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { User } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { calculateDailyCalories } from '../utils/nutritionAnalysis'
import type { UserInfo } from '../types'

const emit = defineEmits<{
  submit: [userInfo: UserInfo]
}>()

const formRef = ref<FormInstance>()

const formData = reactive({
  age: 30,
  gender: 'male' as 'male' | 'female',
  height: 170,
  weight: 65,
  activityLevel: 'moderate' as const,
  healthConditions: [] as string[],
  allergies: [] as string[],
  dailyCalories: 0
})

const rules: FormRules = {
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  height: [{ required: true, message: '请输入身高', trigger: 'blur' }],
  weight: [{ required: true, message: '请输入体重', trigger: 'blur' }],
  activityLevel: [{ required: true, message: '请选择活动水平', trigger: 'change' }]
}

const bmi = computed(() => {
  return (formData.weight / ((formData.height / 100) ** 2)).toFixed(1)
})

const bmiStatus = computed(() => {
  const bmiValue = parseFloat(bmi.value)
  if (bmiValue < 18.5) return { text: '偏瘦', class: 'status-underweight' }
  if (bmiValue < 24) return { text: '正常', class: 'status-normal' }
  if (bmiValue < 28) return { text: '偏胖', class: 'status-overweight' }
  return { text: '肥胖', class: 'status-obese' }
})

const isFormValid = computed(() => {
  return formData.age && formData.height && formData.weight && formData.activityLevel
})

// 计算每日热量
const calculateCalories = () => {
  if (formData.age && formData.height && formData.weight && formData.activityLevel) {
    formData.dailyCalories = calculateDailyCalories(
      formData.gender,
      formData.age,
      formData.height,
      formData.weight,
      formData.activityLevel
    )
  }
}

// 监听表单数据变化，自动计算热量
watch([() => formData.age, () => formData.height, () => formData.weight, () => formData.activityLevel], 
  () => {
    calculateCalories()
  },
  { immediate: true }
)

const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      const userInfo: UserInfo = {
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        activityLevel: formData.activityLevel,
        dailyCalories: formData.dailyCalories,
        hasHypertension: formData.healthConditions.includes('hypertension'),
        otherConditions: formData.healthConditions.filter(c => c !== 'hypertension'),
        allergies: formData.allergies
      }
      emit('submit', userInfo)
    }
  })
}
</script>

<style scoped>
.user-info-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
}

.calculated-info {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin: 20px 0;
}

.bmi-info,
.calories-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}

.status-underweight { color: #2196F3; }
.status-normal { color: #4CAF50; }
.status-overweight { color: #FF9800; }
.status-obese { color: #F44336; }
</style>