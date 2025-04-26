import React, { useState, useEffect } from 'react';
import { Utensils, ArrowLeft, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { createIndianDietPlan } from '../../utils/indianDietPlan';
import DietPlanResult from './DietPlanResult';
import WeightProgressChart from './WeightProgressChart';
import WeeklyProgress from './WeeklyProgress';
import { DietPlan } from '../../types/dietPlan';

interface DietPlanCreatorProps {
  onNavigate?: (page: string) => void;
}

const DietPlanCreator: React.FC<DietPlanCreatorProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    currentWeight: '',
    targetWeight: '',
    activityLevel: '',
    dietaryType: 'vegetarian',
    targetDate: ''
  });
  
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [weightDifference, setWeightDifference] = useState<{
    type: 'gain' | 'loss' | null;
    amount: number;
  }>({ type: null, amount: 0 });
  const [calorieInfo, setCalorieInfo] = useState<{
    maintenance: number;
    target: number;
    deficit: number;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (formData.currentWeight && formData.targetWeight) {
      const current = parseFloat(formData.currentWeight);
      const target = parseFloat(formData.targetWeight);
      const diff = Math.abs(target - current);
      
      setWeightDifference({
        type: target > current ? 'gain' : target < current ? 'loss' : null,
        amount: parseFloat(diff.toFixed(1))
      });
    } else {
      setWeightDifference({ type: null, amount: 0 });
    }
  }, [formData.currentWeight, formData.targetWeight]);

  const calculateTimeframe = (targetDate: string): string => {
    const weeks = Math.ceil(
      (new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 7)
    );
    return `${weeks}_weeks`;
  };

  const determineGoal = (current: number, target: number): string => {
    if (target > current) return 'muscle_gain';
    if (target < current) return 'weight_loss';
    return 'maintenance';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    const currentWeightNum = parseFloat(formData.currentWeight);
    const targetWeightNum = parseFloat(formData.targetWeight);
    const goal = determineGoal(currentWeightNum, targetWeightNum);
    const timeframe = calculateTimeframe(formData.targetDate);

    setTimeout(() => {
      const plan = createIndianDietPlan(
        goal,
        formData.dietaryType === 'vegetarian',
        timeframe,
        currentWeightNum,
        targetWeightNum,
        formData.activityLevel
      );
      setDietPlan(plan);
      setCalorieInfo({
        maintenance: plan.maintenanceCalories,
        target: plan.dailyCalories,
        deficit: Math.abs(plan.dailyCalories - plan.maintenanceCalories)
      });
      setIsGenerating(false);
    }, 2000);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7); // Minimum 1 week from today
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1); // Maximum 1 year from today

  const isFormValid = () => {
    return formData.currentWeight && 
           formData.targetWeight && 
           formData.activityLevel && 
           formData.targetDate;
  };

  return (
    <div className="space-y-6">
      {onNavigate && (
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </button>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Indian Diet Plan Creator
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Create your personalized Indian diet plan based on your goals and preferences.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Weight (kg)
              </label>
              <input
                type="number"
                name="currentWeight"
                value={formData.currentWeight}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
                min="30"
                max="200"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Weight (kg)
              </label>
              <input
                type="number"
                name="targetWeight"
                value={formData.targetWeight}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
                min="30"
                max="200"
                step="0.1"
              />
            </div>

            {weightDifference.type && (
              <div className="md:col-span-2">
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                  weightDifference.type === 'gain' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                }`}>
                  {weightDifference.type === 'gain' ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                  <p className="font-medium">
                    Target Weight {weightDifference.type === 'gain' ? 'Gain' : 'Loss'}: {weightDifference.amount} kg
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="targetDate"
                  value={formData.targetDate}
                  onChange={handleChange}
                  min={minDate.toISOString().split('T')[0]}
                  max={maxDate.toISOString().split('T')[0]}
                  className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Activity Level
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Select activity level</option>
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light (1-3 days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="very_active">Very Active (2x per day)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Diet Type
              </label>
              <select
                name="dietaryType"
                value={formData.dietaryType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="nonVegetarian">Non-Vegetarian</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!isFormValid() || isGenerating}
            className={`
              flex items-center justify-center gap-2 w-full py-3 px-4 rounded-md 
              text-white font-medium transition-all duration-200
              ${
                !isFormValid() || isGenerating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 active:bg-green-700'
              }
            `}
          >
            <Utensils className="h-5 w-5" />
            {isGenerating ? 'Generating Plan...' : 'Generate Diet Plan'}
          </button>
        </form>
      </div>

      {formData.currentWeight && formData.targetWeight && formData.targetDate && (
        <>
          <WeightProgressChart
            currentWeight={parseFloat(formData.currentWeight)}
            targetWeight={parseFloat(formData.targetWeight)}
            timeframe={calculateTimeframe(formData.targetDate)}
          />
          <WeeklyProgress
            currentWeight={parseFloat(formData.currentWeight)}
            targetWeight={parseFloat(formData.targetWeight)}
            weeks={parseInt(calculateTimeframe(formData.targetDate))}
          />
        </>
      )}

      {dietPlan && calorieInfo && <DietPlanResult plan={dietPlan} calorieInfo={calorieInfo} />}
    </div>
  );
};

export default DietPlanCreator;