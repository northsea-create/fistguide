export interface UserProfile {
  goal: 'reduce' | 'balanced' | 'gain';
  height: number;
  weight: number;
}

export interface MealPlan {
  protein: number;
  carbs: number;
  vegetables: number;
  fat: number;
}

export interface DailyMealPlan {
  breakfast: MealPlan;
  lunch: MealPlan;
  dinner: MealPlan;
}

export type AppPage = 'setup' | 'dashboard' | 'guide';