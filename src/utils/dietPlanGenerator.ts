import { DietPlan, MealPlan, Meal } from '../types/dietPlan';

type DietPlanFormData = {
  goal: string;
  timeframe: string;
  dietaryRestrictions: string;
  currentWeight: string;
  targetWeight: string;
  activityLevel: string;
};

// Sample meal options for different diets
const mealOptions: { [key: string]: { [key: string]: string[] } } = {
  default: {
    breakfast: [
      "Oatmeal with berries and almonds",
      "Greek yogurt with honey and walnuts",
      "Whole grain toast with avocado and eggs",
      "Protein smoothie with spinach and fruit"
    ],
    lunch: [
      "Grilled chicken salad with olive oil dressing",
      "Quinoa bowl with roasted vegetables",
      "Turkey and avocado wrap with side salad",
      "Lentil soup with whole grain bread"
    ],
    dinner: [
      "Baked salmon with roasted vegetables",
      "Stir-fried tofu with brown rice and vegetables",
      "Lean beef with sweet potato and broccoli",
      "Chickpea curry with basmati rice"
    ],
    snack: [
      "Apple with almond butter",
      "Greek yogurt with berries",
      "Handful of mixed nuts",
      "Carrot sticks with hummus",
      "Protein bar"
    ]
  },
  weight_loss: {
    breakfast: [
      "Egg white omelet with spinach and tomatoes",
      "Protein smoothie with berries and almond milk",
      "Greek yogurt with cinnamon and a small apple",
      "Overnight oats with chia seeds and berries"
    ],
    lunch: [
      "Large salad with grilled chicken and light dressing",
      "Tuna wrap with lettuce instead of tortilla",
      "Zucchini noodles with turkey meatballs",
      "Vegetable soup with a small piece of whole grain bread"
    ],
    dinner: [
      "Grilled fish with steamed vegetables",
      "Cauliflower rice stir-fry with chicken",
      "Turkey burger (no bun) with sweet potato wedges",
      "Baked tofu with roasted Brussels sprouts"
    ],
    snack: [
      "Celery with small amount of peanut butter",
      "Hard-boiled egg",
      "Small handful of berries",
      "Cucumber slices",
      "Protein shake with water"
    ]
  },
  muscle_gain: {
    breakfast: [
      "Protein pancakes with banana and honey",
      "5-egg omelet with vegetables and cheese",
      "Oatmeal with protein powder, peanut butter and banana",
      "Whole grain toast with 4 scrambled eggs and avocado"
    ],
    lunch: [
      "Chicken breast with brown rice and broccoli",
      "Tuna sandwich on whole grain bread with extra protein",
      "Beef and bean burrito bowl with extra meat",
      "Turkey and cheese wrap with Greek yogurt"
    ],
    dinner: [
      "Grilled steak with sweet potato and vegetables",
      "Salmon with quinoa and asparagus",
      "Chicken thighs with rice and mixed vegetables",
      "Lean ground beef with pasta and tomato sauce"
    ],
    snack: [
      "Protein shake with milk and banana",
      "Greek yogurt with granola and honey",
      "Cottage cheese with pineapple",
      "Turkey and cheese roll-ups",
      "Peanut butter sandwich"
    ]
  }
};

// Generate a random meal plan
const generateMealPlan = (goal: string, days: number): MealPlan => {
  const mealPlan: MealPlan = [];
  const goalType = mealOptions[goal] || mealOptions.default;
  
  for (let i = 0; i < days; i++) {
    const dayMeals: Meal[] = [
      {
        type: 'Breakfast',
        foods: [goalType.breakfast[Math.floor(Math.random() * goalType.breakfast.length)]]
      },
      {
        type: 'Lunch',
        foods: [goalType.lunch[Math.floor(Math.random() * goalType.lunch.length)]]
      },
      {
        type: 'Dinner',
        foods: [goalType.dinner[Math.floor(Math.random() * goalType.dinner.length)]]
      },
      {
        type: 'Snacks',
        foods: [
          goalType.snack[Math.floor(Math.random() * goalType.snack.length)],
          goalType.snack[Math.floor(Math.random() * goalType.snack.length)]
        ]
      }
    ];
    
    mealPlan.push({ meals: dayMeals });
  }
  
  return mealPlan;
};

// Get tips based on goal
const getTips = (goal: string): string[] => {
  const commonTips = [
    "Drink at least 8 glasses of water daily",
    "Aim for 7-8 hours of sleep each night",
    "Plan and prepare meals in advance to stay on track",
    "Listen to your body's hunger and fullness cues"
  ];
  
  const goalSpecificTips: { [key: string]: string[] } = {
    weight_loss: [
      "Create a calorie deficit of 500 calories per day for 1 pound of weight loss per week",
      "Include protein in every meal to maintain muscle mass",
      "Focus on fiber-rich foods to keep you feeling full longer",
      "Limit processed foods and added sugars"
    ],
    muscle_gain: [
      "Eat in a calorie surplus of 250-500 calories above maintenance",
      "Consume 1.6-2.2g of protein per kg of bodyweight",
      "Time protein intake around workouts for optimal muscle synthesis",
      "Don't neglect carbohydrates, they fuel your workouts"
    ],
    maintenance: [
      "Adjust calories based on activity levels each day",
      "Focus on nutrient-dense whole foods",
      "Practice mindful eating to maintain weight",
      "Incorporate a variety of foods for balanced nutrition"
    ],
    overall_health: [
      "Eat a rainbow of fruits and vegetables daily",
      "Include sources of healthy fats like avocados, nuts, and olive oil",
      "Limit sodium and processed foods",
      "Practice mindful eating and enjoy your meals"
    ]
  };
  
  return [...commonTips, ...(goalSpecificTips[goal] || goalSpecificTips.overall_health)];
};

// Calculate daily calories based on inputs
const calculateDailyCalories = (formData: DietPlanFormData): number => {
  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  
  // Default to average values if not provided
  const weight = parseInt(formData.currentWeight) || 70; // kg
  const multiplier = activityMultipliers[formData.activityLevel] || 1.55;
  
  // Basic BMR formula (simplified)
  const bmr = weight * 24 * multiplier;
  
  // Adjust based on goal
  switch(formData.goal) {
    case 'weight_loss':
      return Math.round(bmr - 500);
    case 'muscle_gain':
      return Math.round(bmr + 500);
    default:
      return Math.round(bmr);
  }
};

// Calculate macros based on goal
const calculateMacros = (goal: string): { protein: number; carbs: number; fat: number } => {
  switch(goal) {
    case 'weight_loss':
      return { protein: 40, carbs: 30, fat: 30 };
    case 'muscle_gain':
      return { protein: 30, carbs: 50, fat: 20 };
    case 'maintenance':
      return { protein: 30, carbs: 40, fat: 30 };
    case 'overall_health':
      return { protein: 25, carbs: 45, fat: 30 };
    default:
      return { protein: 30, carbs: 40, fat: 30 };
  }
};

// Main function to create a diet plan
export const createDietPlan = (formData: DietPlanFormData): DietPlan => {
  const goalMap: { [key: string]: string } = {
    weight_loss: 'Weight Loss',
    muscle_gain: 'Muscle Gain',
    maintenance: 'Weight Maintenance',
    overall_health: 'Overall Health Improvement'
  };
  
  const timeframeMap: { [key: string]: string } = {
    '4_weeks': '4 Weeks',
    '8_weeks': '8 Weeks',
    '12_weeks': '12 Weeks',
    '24_weeks': '24 Weeks'
  };
  
  const days = formData.goal === 'weight_loss' ? 7 : 5; // More variety for weight loss plans
  
  return {
    goal: goalMap[formData.goal] || 'Custom Plan',
    duration: timeframeMap[formData.timeframe] || formData.timeframe,
    dailyCalories: calculateDailyCalories(formData),
    macros: calculateMacros(formData.goal),
    mealPlan: generateMealPlan(formData.goal, days),
    tips: getTips(formData.goal)
  };
};