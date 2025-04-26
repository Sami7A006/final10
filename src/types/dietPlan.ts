export interface Meal {
  type: string;
  foods: string[];
}

export interface DayPlan {
  meals: Meal[];
}

export type MealPlan = DayPlan[];

export interface DietPlan {
  goal: string;
  duration: string;
  dailyCalories: number;
  maintenanceCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  mealPlan: MealPlan;
  tips: string[];
}