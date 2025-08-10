<template>
  <div class="food-guide">
    <el-tabs v-model="activeTab" class="guide-tabs">
      <el-tab-pane label="🚫 忌口食物" name="avoid">
        <div class="food-list avoid-list">
          <div 
            v-for="category in avoidFoods" 
            :key="category.category"
            class="food-category"
          >
            <h3>{{ category.category }}</h3>
            <div class="food-items">
              <el-tag 
                v-for="food in category.items" 
                :key="food"
                type="danger"
                class="food-tag"
                size="large"
              >
                {{ food }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="✅ 推荐食物" name="recommend">
        <div class="food-list recommend-list">
          <div 
            v-for="category in recommendFoods" 
            :key="category.category"
            class="food-category"
          >
            <h3>{{ category.category }}</h3>
            <div class="food-items">
              <el-tag 
                v-for="food in category.items" 
                :key="food"
                type="success"
                class="food-tag"
                size="large"
              >
                {{ food }}
              </el-tag>
            </div>
            <div v-if="category.benefits" class="benefits">
              <p><strong>益处：</strong>{{ category.benefits }}</p>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="tips-section">
      <h3>💡 饮食小贴士</h3>
      <ul class="tips-list">
        <li v-for="tip in dietTips" :key="tip" class="tip-item">
          {{ tip }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('avoid')

// 忌口食物数据
const avoidFoods = [
  {
    category: '高盐食物',
    items: [
      '咸菜', '腊肉', '香肠', '火腿', '咸鱼', '豆腐乳', '榨菜', '酱油', '味精', '鸡精',
      '薯片', '方便面', '罐头食品', '腌制食品', '盐焗坚果', '海苔', '鱼露', '蚝油'
    ]
  },
  {
    category: '高脂肪食物',
    items: [
      '油炸食品', '肥肉', '动物内脏', '黄油', '奶油', '椰子油', '棕榈油',
      '巧克力', '蛋糕', '饼干', '冰淇淋', '薯条', '炸鸡', '油条', '麻花'
    ]
  },
  {
    category: '高糖食物',
    items: [
      '糖果', '蜂蜜', '果酱', '含糖饮料', '果汁', '汽水', '奶茶', '巧克力',
      '甜点', '月饼', '汤圆', '白糖', '红糖', '冰糖'
    ]
  },
  {
    category: '刺激性食物',
    items: [
      '辣椒', '花椒', '胡椒', '芥末', '大蒜', '洋葱', '咖啡', '浓茶',
      '酒精饮料', '白酒', '啤酒', '红酒', '香烟'
    ]
  }
]

// 推荐食物数据
const recommendFoods = [
  {
    category: '富含钾的食物',
    items: [
      '香蕉', '橙子', '土豆', '红薯', '菠菜', '番茄', '西兰花', '南瓜',
      '冬瓜', '黄瓜', '芹菜', '空心菜', '蘑菇', '金针菇', '山药', '芋头'
    ],
    benefits: '钾有助于平衡体内钠含量，帮助降低血压'
  },
  {
    category: '富含镁的食物',
    items: [
      '全谷物', '燕麦', '糙米', '藜麦', '杏仁', '腰果', '核桃', '芝麻',
      '豆类', '豆腐', '豆浆', '绿叶蔬菜', '香蕉', '黑巧克力'
    ],
    benefits: '镁有助于放松血管，改善血压'
  },
  {
    category: '富含钙的食物',
    items: [
      '低脂牛奶', '酸奶', '奶酪', '豆腐', '豆浆', '小鱼干', '芝麻',
      '杏仁', '西兰花', '白菜', '芥蓝', '甘蓝'
    ],
    benefits: '钙有助于维持正常的血压水平'
  },
  {
    category: '富含Omega-3的食物',
    items: [
      '三文鱼', '金枪鱼', '沙丁鱼', '鲭鱼', '亚麻籽', '奇亚籽', '核桃',
      '深海鱼油', '藻油'
    ],
    benefits: 'Omega-3脂肪酸有助于降低血压和减少炎症'
  },
  {
    category: '低钠调味品',
    items: [
      '柠檬汁', '醋', '香草', '姜', '蒜', '洋葱', '罗勒', '迷迭香',
      '百里香', '薄荷', '香菜', '低钠盐', '胡椒'
    ],
    benefits: '天然调味品可以减少盐的使用量'
  }
]

// 饮食小贴士
const dietTips = [
  '每日盐摄入量控制在5克以下',
  '多吃新鲜蔬菜水果，每日至少500克',
  '选择全谷物食品，少吃精制米面',
  '适量食用优质蛋白质，如鱼类、豆类',
  '避免饮酒，特别是烈性酒',
  '保持规律作息，避免暴饮暴食',
  '多喝水，每日1.5-2升',
  '适量运动，每周至少150分钟',
  '定期监测血压，遵医嘱用药',
  '保持心情愉快，避免精神紧张'
]
</script>

<style scoped>
.food-guide {
  max-height: 70vh;
  overflow-y: auto;
}

.guide-tabs {
  margin-bottom: 20px;
}

.food-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.food-category {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #409eff;
}

.avoid-list .food-category {
  border-left-color: #f56c6c;
}

.recommend-list .food-category {
  border-left-color: #67c23a;
}

.food-category h3 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.food-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.food-tag {
  margin: 0;
  padding: 6px 12px;
  font-size: 14px;
}

.benefits {
  background: #e8f5e8;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  color: #67c23a;
}

.benefits p {
  margin: 0;
}

.tips-section {
  margin-top: 24px;
  padding: 20px;
  background: #fff7e6;
  border-radius: 8px;
  border: 1px solid #ffd591;
}

.tips-section h3 {
  margin: 0 0 16px 0;
  color: #d46b08;
  font-size: 16px;
  font-weight: 600;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tip-item {
  padding: 8px 0;
  color: #606266;
  border-bottom: 1px dashed #ffe4b5;
  position: relative;
  padding-left: 20px;
}

.tip-item:last-child {
  border-bottom: none;
}

.tip-item::before {
  content: '💡';
  position: absolute;
  left: 0;
  top: 8px;
}

/* 滚动条样式 */
.food-guide::-webkit-scrollbar {
  width: 6px;
}

.food-guide::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.food-guide::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.food-guide::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>