# 🩺 血压守护者 (Blood Pressure Guardian)

<div align="center">

![高血压营养分析](https://img.shields.io/badge/高血压-营养分析-red)
![Vue 3](https://img.shields.io/badge/Vue-3-green)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Element Plus](https://img.shields.io/badge/Element%20Plus-orange)

**基于AI的高血压人群营养建议助手**

[功能特色](#功能特色) • [快速开始](#快速开始) • [技术架构](#技术架构) • [项目结构](#项目结构) • [开发指南](#开发指南)

</div>

---

## 📋 项目简介

血压守护者是一个专为高血压人群设计的智能营养分析Web应用。通过AI图像识别技术，用户可以上传食品营养成分表图片，系统将自动分析并提供个性化的营养建议，帮助高血压患者更好地管理饮食健康。

### 🎯 核心功能

- 📸 **智能图像识别** - 使用GPT-4 Vision API识别营养成分表
- ✍️ **手动输入支持** - 支持文本形式的手动营养信息输入
- 🧮 **个性化评估** - 基于用户个人信息（年龄、性别、体重、运动习惯等）进行定制化分析
- ⭐ **五星评级系统** - 直观的食品适宜性评分（1-5星）
- 📋 **详细建议报告** - 包含潜在健康问题和专业营养建议
- 📄 **建议卡导出** - 支持HTML格式的营养建议卡导出
- 🍎 **饮食指南** - 内置高血压饮食指南参考资料

---

## ✨ 功能特色

### 1. 三步式工作流程
```
 Step 1: 个人信息 → Step 2: 图片识别 → Step 3: 营养建议
```

### 2. 双输入模式
- **拍照识别**：上传营养成分表图片，AI自动识别
- **手动输入**：直接输入营养信息文本

### 3. 智能分析算法
- 钠含量优先评估（高血压人群重点关注）
- 糖含量和饱和脂肪分析
- 膳食纤维和蛋白质评估
- 综合营养评分系统

### 4. 个性化推荐等级
- 🎉 **想咋吃就咋吃** (5星) - 最优选择
- ✅ **正常** (4星) - 健康选择
- 🟡 **少吃** (3星) - 适量食用
- ⚠️ **尝两口** (2星) - 少量尝试
- 🚫 **不能吃** (1星) - 避免食用

---

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/Blood-Pressure-Guardian.git
   cd Blood-Pressure-Guardian
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**
   
   复制环境变量模板：
   ```bash
   cp .env.example .env
   ```
   
   编辑 `.env` 文件，配置API密钥：
   ```env
   VITE_API_BASE_URL=https://api.mmowl.top/v1
   VITE_API_KEY=your-api-key-here
   NODE_ENV=development
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **构建生产版本**
   ```bash
   npm run build
   ```

6. **预览生产版本**
   ```bash
   npm run preview
   ```

---

## 🏗️ 技术架构

### 前端技术栈

| 技术 | 版本 | 描述 |
|------|------|------|
| Vue 3 | ^3.5.18 | 渐进式JavaScript框架 |
| TypeScript | ~5.8.3 | JavaScript的超集，提供静态类型检查 |
| Vite | ^7.1.0 | 新一代前端构建工具 |
| Element Plus | ^2.10.6 | Vue 3 UI组件库 |
| Element Plus Icons | ^2.3.2 | 图标库 |

### 核心依赖

```json
{
  "dependencies": {
    "@element-plus/icons-vue": "^2.3.2",
    "axios": "^1.11.0",
    "element-plus": "^2.10.6",
    "vue": "^3.5.18"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.1",
    "@vue/tsconfig": "^0.7.0",
    "typescript": "~5.8.3",
    "vite": "^7.1.0",
    "vue-tsc": "^3.0.5"
  }
}
```

### API集成

- **GPT-4 Vision API** - 用于图像识别和营养信息提取
- **自定义字段映射** - 中英文营养字段智能转换
- **图片压缩优化** - 自动压缩大图片以提高API调用效率

---

## 📁 项目结构

```
Blood-Pressure-Guardian/
├── public/                    # 静态资源
├── src/
│   ├── components/            # Vue组件
│   │   ├── UserInfoForm.vue   # 用户信息表单
│   │   ├── ImageUpload.vue    # 图片上传和识别
│   │   ├── NutritionCard.vue  # 营养建议卡片
│   │   └── FoodGuide.vue      # 饮食指南
│   ├── types/                 # TypeScript类型定义
│   │   └── index.ts          # 核心类型定义
│   ├── utils/                 # 工具函数
│   │   ├── apiConfig.ts      # API配置
│   │   └── nutritionAnalysis.ts # 营养分析算法
│   ├── App.vue               # 根组件
│   └── main.ts               # 应用入口
├── .env                      # 环境变量
├── .env.example             # 环境变量模板
├── .gitignore               # Git忽略文件
├── index.html               # HTML模板
├── package.json             # 项目配置
├── tsconfig.json            # TypeScript配置
├── vite.config.ts           # Vite配置
└── README.md               # 项目说明
```

---

## 🔧 开发指南

### 组件开发规范

1. **组件命名** - 使用PascalCase命名法
2. **Props定义** - 明确的类型定义和默认值
3. **事件发射** - 使用defineEmits定义事件
4. **样式组织** - 使用scoped样式避免污染

### TypeScript类型系统

```typescript
// 核心类型定义
interface UserInfo {
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

interface NutritionInfo {
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
```

### API配置管理

```typescript
// 环境变量配置
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.mmowl.top/v1',
  apiKey: import.meta.env.VITE_API_KEY || '',
  model: 'gpt-4o-mini',
  maxTokens: 2000,
  temperature: 0.1
}
```

### 字段映射系统

支持中英文营养字段的智能映射：

```typescript
export const FIELD_MAPPING = {
  '产品名称': 'productName',
  '热量': 'energyKcal',
  '蛋白质': 'protein',
  '脂肪': 'fat',
  '碳水化合物': 'carbohydrates',
  '糖': 'sugars',
  '钠': 'sodium',
  // ... 更多字段映射
}
```

---

## 🧮 核心算法

### 营养评分算法

系统采用多维度评分机制，重点关注高血压人群的健康需求：

```typescript
// 钠含量评估 (权重最高)
const sodiumPer100kcal = nutrition.sodium / (nutrition.energyKcal / 100)
if (sodiumPer100kcal > 100) {
  score -= 30  // 严重扣分
  reasons.push('钠含量过高')
}

// 糖含量评估
const sugarPer100kcal = nutrition.sugars / (nutrition.energyKcal / 100)
if (sugarPer100kcal > 15) {
  score -= 20
  reasons.push('添加糖过多')
}

// 饱和脂肪评估
if (nutrition.saturatedFat) {
  const saturatedFatRatio = nutrition.saturatedFat / nutrition.fat
  if (saturatedFatRatio > 0.5) {
    score -= 15
    reasons.push('饱和脂肪比例高')
  }
}
```

### 推荐等级划分

根据综合得分确定食品推荐等级：

| 得分范围 | 推荐等级 | 显示文本 | 星级 |
|----------|----------|----------|------|
| 85-100 | eatAsYouLike | 🎉 想咋吃就咋吃 | ⭐⭐⭐⭐⭐ |
| 70-84 | normal | ✅ 正常 | ⭐⭐⭐⭐ |
| 50-69 | eatLess | 🟡 少吃 | ⭐⭐⭐ |
| 30-49 | tryLittle | ⚠️ 尝两口 | ⭐⭐ |
| 0-29 | cannotEat | 🚫 不能吃 | ⭐ |

---

## 🎨 用户界面设计

### 设计原则

- **简洁直观** - 三步式工作流程，用户体验流畅
- **视觉层次** - 使用颜色和大小区分信息重要性
- **响应式设计** - 适配各种屏幕尺寸
- **无障碍访问** - 支持键盘导航和屏幕阅读器

### 色彩系统

- **主色调** - 蓝紫色渐变 (`#667eea` → `#764ba2`)
- **推荐等级色彩** - 从红色到绿色的渐变表示不同推荐级别
- **警告色彩** - 黄色用于注意事项，红色用于严重警告

### 响应式断点

```css
/* 移动设备 */
@media (max-width: 480px) { ... }

/* 平板设备 */
@media (max-width: 768px) { ... }

/* 桌面设备 */
@media (min-width: 769px) { ... }
```

---

## 🔒 安全与隐私

### 数据安全

- **本地处理** - 所有计算都在客户端完成
- **API加密** - 使用HTTPS协议传输数据
- **无存储** - 不存储用户个人信息和图片数据

### 环境变量管理

```gitignore
# 环境变量文件
.env
.env.local
.env.*.local
```

---

## 🚀 部署指南

### 构建优化

```bash
# 生产构建
npm run build

# 构建结果分析
npm run build -- --mode production
```

### 静态部署

构建后的 `dist` 文件夹可以部署到任何静态文件服务器：

```bash
# 部署到Nginx
sudo cp -r dist/* /var/www/html/

# 部署到Apache
sudo cp -r dist/* /var/www/html/
```

### 环境配置

生产环境需要配置正确的环境变量：

```env
VITE_API_BASE_URL=https://your-api-domain.com/v1
VITE_API_KEY=your-production-api-key
NODE_ENV=production
```

---

## 🤝 贡献指南

### 开发流程

1. Fork项目仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

### 代码规范

- 使用TypeScript进行类型检查
- 遵循Vue 3 Composition API规范
- 组件名使用PascalCase
- 文件名使用kebab-case

### 提交信息规范

```
feat: 添加新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Element Plus](https://element-plus.org/) - Vue 3组件库
- [OpenAI](https://openai.com/) - GPT-4 Vision API
- [Vite](https://vitejs.dev/) - 新一代前端构建工具

---

## 📞 联系我们

- **项目地址**: [GitHub Repository](https://github.com/your-username/Blood-Pressure-Guardian)
- **问题反馈**: [Issues](https://github.com/your-username/Blood-Pressure-Guardian/issues)
- **邮件联系**: your-email@example.com

---

<div align="center">

**💖 感谢使用血压守护者！**

![Star History](https://img.shields.io/github/stars/your-username/Blood-Pressure-Guardian?style=social)

</div>