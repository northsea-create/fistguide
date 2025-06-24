import { UserProfile, DailyMealPlan, MealPlan } from '../types';

export function calculateMealPlan(profile: UserProfile): DailyMealPlan {
  // Step 1: Calculate base value
  const baseValue = (10 * profile.weight) + (6.25 * profile.height) - 150;
  
  // Step 2: Calculate total calories based on goal
  let multiplier: number;
  switch (profile.goal) {
    case 'reduce':
      multiplier = 1.1;
      break;
    case 'balanced':
      multiplier = 1.3;
      break;
    case 'gain':
      multiplier = 1.5;
      break;
    default:
      multiplier = 1.3;
  }
  
  const totalCalories = baseValue * multiplier;
  
  // Step 3: Convert to daily portions
  const proteinPortions = (totalCalories * 0.4) / 150;
  const carbsPortions = (totalCalories * 0.4) / 150;
  const fatPortions = (totalCalories * 0.2) / 100;
  
  // Round to nearest 0.5
  const roundToHalf = (value: number) => Math.round(value * 2) / 2;
  
  const dailyProtein = roundToHalf(proteinPortions);
  const dailyCarbs = roundToHalf(carbsPortions);
  const dailyFat = roundToHalf(fatPortions);
  
  // Step 4: Distribute across meals (30% : 40% : 30%)
  const breakfast: MealPlan = {
    protein: roundToHalf(dailyProtein * 0.3),
    carbs: roundToHalf(dailyCarbs * 0.3),
    vegetables: 0, // No vegetables for breakfast
    fat: 0 // No fat for breakfast typically
  };
  
  const lunch: MealPlan = {
    protein: roundToHalf(dailyProtein * 0.4),
    carbs: roundToHalf(dailyCarbs * 0.4),
    vegetables: 2, // Fixed recommendation
    fat: roundToHalf(dailyFat * 0.5)
  };
  
  const dinner: MealPlan = {
    protein: roundToHalf(dailyProtein * 0.3),
    carbs: 0, // No carbs for dinner in this plan
    vegetables: 2, // Fixed recommendation
    fat: roundToHalf(dailyFat * 0.5)
  };
  
  return { breakfast, lunch, dinner };
}

export function getGoalLabel(goal: string): string {
  switch (goal) {
    case 'reduce':
      return '减脂塑形';
    case 'balanced':
      return '均衡营养';
    case 'gain':
      return '增肌增重';
    default:
      return '均衡营养';
  }
}

export function getGoalDescription(goal: string): string {
  switch (goal) {
    case 'reduce':
      return '科学减脂，塑造理想身材';
    case 'balanced':
      return '为身体和大脑提供每日活力';
    case 'gain':
      return '健康增重，增强肌肉量';
    default:
      return '为身体和大脑提供每日活力';
  }
}