# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + TypeScript nutrition analysis application called "血压守护者" (Blood Pressure Guardian) designed specifically for people with hypertension. It helps users analyze nutrition facts from food labels and provides personalized dietary recommendations.

## Key Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (includes TypeScript compilation)
- `npm run preview` - Preview production build

## Architecture

### Application Flow
The app follows a 3-step wizard flow:
1. **User Info Collection** (`UserInfoForm.vue`) - Gather user demographics and health data
2. **Nutrition Analysis** (`ImageUpload.vue`) - Upload food label images or manual input for OCR analysis
3. **Results Display** (`NutritionCard.vue`) - Show personalized nutrition recommendations

### Core Components

#### App.vue (Main Container)
- Manages step navigation between the 3 main stages
- Contains the food guide modal that shows dietary restrictions and recommendations
- Uses responsive design with gradient background

#### ImageUpload.vue (Dual Analysis Interface)
- **Camera Recognition**: Upload images for OCR analysis using GPT-4o-mini
- **Manual Input**: Text-based nutrition data entry
- **API Integration**: Calls external API at `https://api.mmowl.top` with key `sk-7L1K38HbTsTUkYexHNwrKUSkuO4GaTHfyVHaz4tF9juJ2awC`
- **Field Mapping**: Handles Chinese-to-English field name conversion (e.g., "产品名称" → "productName")

#### NutritionAnalysis.ts (Business Logic)
- **Calorie Calculation**: Uses Mifflin-St Jeor BMR formula with activity factors
- **Scoring System**: 100-point scale deducting for high sodium, sugar, saturated fat
- **Recommendation Levels**: 5-tier system from "cannotEat" to "eatAsYouLike"
- **Health Tips**: Context-aware suggestions based on user's hypertension status

#### FoodGuide.vue (Reference Data)
- **Avoid Foods**: Categorized lists of high-sodium, high-fat, high-sugar, and stimulating foods
- **Recommended Foods**: Potassium-rich, magnesium-rich, calcium-rich, and Omega-3 foods
- **Diet Tips**: Practical guidelines for hypertension management

### Type System
- `UserInfo`: Demographics, activity level, health conditions
- `NutritionInfo`: Product name, macros, micronutrients, ingredients
- `RecommendationLevel`: 5-level rating system with visual styling
- `NutritionAdvice`: Combines recommendations with health tips and issues

### Technical Implementation

#### Image Analysis Flow
1. Image uploaded as base64 data URL
2. Sent to GPT-4o-mini with vision capabilities
3. Returns Chinese field names that get mapped to English
4. Numeric values extracted from strings with units
5. Automatic kcal/kJ conversion if only one is provided

#### Recommendation Algorithm
- Primary focus on sodium content (critical for hypertension)
- Secondary scoring for sugar, saturated fat, fiber, protein
- Health tips personalized based on user's hypertension status
- Visual star rating (1-5 stars) with color-coded headers

#### UI/UX Patterns
- Element Plus UI library with custom styling
- Progress indicator showing 3-step workflow
- Tabbed interface for dual input methods
- Modal overlays for reference information
- Responsive design for mobile devices

## Development Notes

- The app uses Chinese language throughout the interface
- API integration handles both image OCR and text analysis
- Error handling includes fallback to simulated data when API calls fail
- Field name mapping is critical due to Chinese responses from GPT
- Nutrition scoring prioritizes hypertension-specific concerns (sodium first)