import React from 'react';
import { CalendarRange, Utensils, Salad, TrendingUp, TrendingDown } from 'lucide-react';
import { DietPlan } from '../../types/dietPlan';

interface DietPlanResultProps {
  plan: DietPlan;
  calorieInfo: {
    maintenance: number;
    target: number;
    deficit: number;
  };
}

const DietPlanResult: React.FC<DietPlanResultProps> = ({ plan, calorieInfo }) => {
  const isGain = calorieInfo.target > calorieInfo.maintenance;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-fadeIn transition-colors duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Your Personalized Diet Plan
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Based on your goals and preferences, here's your customized nutrition plan.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/30">
          <h3 className="font-medium text-green-800 dark:text-green-400 mb-2 flex items-center gap-2">
            <CalendarRange className="h-5 w-5" />
            Plan Overview
          </h3>
          <div className="space-y-2">
            <p className="text-green-700 dark:text-green-300 text-sm">
              <span className="font-medium">Goal:</span> {plan.goal}
            </p>
            <p className="text-green-700 dark:text-green-300 text-sm">
              <span className="font-medium">Duration:</span> {plan.duration}
            </p>
            <div className="pt-2 space-y-1">
              <p className="text-green-700 dark:text-green-300 text-sm">
                <span className="font-medium">Maintenance Calories:</span> {calorieInfo.maintenance} calories/day
              </p>
              <p className="text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
                <span className="font-medium">Target Calories:</span>
                {calorieInfo.target} calories/day
                {isGain ? (
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
              </p>
              <p className="text-green-700 dark:text-green-300 text-sm">
                <span className="font-medium">Daily {isGain ? 'Surplus' : 'Deficit'}:</span> {calorieInfo.deficit} calories
              </p>
            </div>
            <p className="text-green-700 dark:text-green-300 text-sm">
              <span className="font-medium">Recommended Macros:</span> {plan.macros.protein}% protein, {plan.macros.carbs}% carbs, {plan.macros.fat}% fat
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Utensils className="h-5 w-5 text-green-500" />
            Meal Plan
          </h3>
          
          <div className="space-y-4">
            {plan.mealPlan.map((day, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Day {index + 1}
                </h4>
                <div className="space-y-3">
                  {day.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="pl-4 border-l-2 border-green-400">
                      <h5 className="font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {meal.type}
                      </h5>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm space-y-1">
                        {meal.foods.map((food, foodIndex) => (
                          <li key={foodIndex}>{food}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <Salad className="h-5 w-5 text-green-500" />
            Tips & Recommendations
          </h3>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 pl-1">
            {plan.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DietPlanResult;