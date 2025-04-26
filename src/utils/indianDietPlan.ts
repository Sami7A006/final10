import { DietPlan, MealPlan, Meal } from '../types/dietPlan';

const indianMealOptions = {
  vegetarian: {
    breakfast: [
      "Idli with sambar and coconut chutney",
      "Poha with peanuts and vegetables",
      "Besan cheela with mint chutney",
      "Upma with mixed vegetables",
      "Masala dosa with potato filling"
    ],
    lunch: [
      "Dal, brown rice, mixed vegetable curry, raita",
      "Rajma chawal with salad",
      "Chole bhature with onions",
      "Paneer bhurji with roti and dal",
      "Vegetable pulao with dal tadka"
    ],
    dinner: [
      "Palak paneer with roti",
      "Mixed dal khichdi with vegetables",
      "Baingan bharta with roti",
      "Vegetable curry with quinoa",
      "Moong dal khichdi with vegetables"
    ],
    snacks: [
      "Roasted chana",
      "Fruit chaat",
      "Sprouts bhel",
      "Dhokla",
      "Buttermilk with roasted cumin"
    ]
  },
  nonVegetarian: {
    breakfast: [
      "Egg bhurji with paratha",
      "Chicken sandwich with mint chutney",
      "Keema paratha with curd",
      "Egg dosa with coconut chutney",
      "Chicken upma"
    ],
    lunch: [
      "Chicken curry with rice and dal",
      "Fish curry with rice and vegetables",
      "Mutton biryani with raita",
      "Egg curry with roti and dal",
      "Chicken pulao with raita"
    ],
    dinner: [
      "Grilled fish with vegetables",
      "Chicken tikka with roti",
      "Egg curry with brown rice",
      "Tandoori chicken with dal",
      "Fish tikka with quinoa"
    ],
    snacks: [
      "Boiled eggs with black pepper",
      "Chicken tikka",
      "Fish cutlet",
      "Egg whites with vegetables",
      "Grilled chicken strips"
    ]
  }
};

const generateIndianMealPlan = (
  isVegetarian: boolean,
  days: number
): MealPlan => {
  const dietType = isVegetarian ? indianMealOptions.vegetarian : indianMealOptions.nonVegetarian;
  const mealPlan: MealPlan = [];

  for (let i = 0; i < days; i++) {
    const dayMeals: Meal[] = [
      {
        type: 'Breakfast',
        foods: [dietType.breakfast[Math.floor(Math.random() * dietType.breakfast.length)]]
      },
      {
        type: 'Lunch',
        foods: [dietType.lunch[Math.floor(Math.random() * dietType.lunch.length)]]
      },
      {
        type: 'Dinner',
        foods: [dietType.dinner[Math.floor(Math.random() * dietType.dinner.length)]]
      },
      {
        type: 'Snacks',
        foods: [
          dietType.snacks[Math.floor(Math.random() * dietType.snacks.length)],
          dietType.snacks[Math.floor(Math.random() * dietType.snacks.length)]
        ]
      }
    ];
    
    mealPlan.push({ meals: dayMeals });
  }
  
  return mealPlan;
};

const calculateDailyCalories = (
  currentWeight: number,
  targetWeight: number,
  activityLevel: string,
  timeframe: string
): { maintenance: number; target: number; deficit: number } => {
  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  // Calculate BMR using the Mifflin-St Jeor Equation
  const bmr = (10 * currentWeight) + (6.25 * 170) - (5 * 25) + 5; // Assuming average height and age
  const maintenanceCalories = Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));

  // Calculate weeks from timeframe
  const weeks = parseInt(timeframe.split('_')[0]) || 12;
  
  // Calculate required weekly weight change
  const totalWeightChange = targetWeight - currentWeight;
  const weeklyChange = totalWeightChange / weeks;
  
  // Calculate daily calorie adjustment (1kg of weight = 7700 calories)
  const dailyCalorieAdjustment = Math.round((weeklyChange * 7700) / 7);
  
  return {
    maintenance: maintenanceCalories,
    target: maintenanceCalories + dailyCalorieAdjustment,
    deficit: Math.abs(dailyCalorieAdjustment)
  };
};

const getIndianDietTips = (goal: string, isVegetarian: boolean): string[] => {
  const commonTips = [
    "Include dal or legumes in at least two meals",
    "Use healthy cooking oils like mustard or coconut oil",
    "Include seasonal vegetables in your meals",
    "Drink buttermilk or chaas for better digestion",
    "Include probiotics like curd or yogurt daily"
  ];

  const goalSpecificTips: { [key: string]: string[] } = {
    weight_loss: [
      "Replace rice with millets like ragi or jowar",
      "Use more vegetables and less oil in cooking",
      "Choose steamed idli over fried foods",
      "Include more protein-rich sprouts and legumes",
      "Avoid deep fried snacks and sweets"
    ],
    muscle_gain: [
      "Include protein-rich foods like paneer or lean meat",
      "Add nuts and seeds to your breakfast",
      "Include eggs or protein shake post workout",
      "Choose whole grain rotis over refined flour",
      "Include protein in every meal"
    ]
  };

  const dietaryTips = isVegetarian ? [
    "Combine dal and rice for complete protein",
    "Include vitamin B12 supplements",
    "Use tofu and paneer for protein",
    "Include nuts and seeds daily"
  ] : [
    "Choose lean cuts of meat",
    "Include fish twice a week",
    "Trim visible fat from meat",
    "Include both plant and animal protein"
  ];

  return [
    ...commonTips,
    ...(goalSpecificTips[goal] || []),
    ...dietaryTips
  ];
};

export const createIndianDietPlan = (
  goal: string,
  isVegetarian: boolean,
  timeframe: string,
  currentWeight: number,
  targetWeight: number,
  activityLevel: string
): DietPlan => {
  const days = 7;
  const calorieInfo = calculateDailyCalories(currentWeight, targetWeight, activityLevel, timeframe);
  
  return {
    goal: goal,
    duration: timeframe,
    dailyCalories: calorieInfo.target,
    maintenanceCalories: calorieInfo.maintenance,
    macros: {
      protein: isVegetarian ? 25 : 30,
      carbs: 55,
      fat: isVegetarian ? 20 : 15
    },
    mealPlan: generateIndianMealPlan(isVegetarian, days),
    tips: getIndianDietTips(goal, isVegetarian)
  };
};