import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { Ingredient } from '../../types/ingredient';
import SafetyBadge from './SafetyBadge';

interface IngredientResultsProps {
  ingredients: Ingredient[];
}

const IngredientResults: React.FC<IngredientResultsProps> = ({ ingredients }) => {
  // Group ingredients by safety level
  const highConcern = ingredients.filter(ing => ing.safetyLevel === 'High Concern');
  const moderateConcern = ingredients.filter(ing => ing.safetyLevel === 'Moderate Concern');
  const lowConcern = ingredients.filter(ing => ing.safetyLevel === 'Low Concern');

  // Calculate overall safety score
  const calculateOverallSafety = () => {
    const totalScore = ingredients.reduce((acc, ing) => acc + ing.ewgScore, 0);
    const avgScore = totalScore / ingredients.length;
    
    if (avgScore <= 2) return { level: 'Safe', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' };
    if (avgScore <= 4) return { level: 'Moderately Safe', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' };
    if (avgScore <= 6) return { level: 'Use with Caution', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
    return { level: 'Potentially Unsafe', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' };
  };

  const safety = calculateOverallSafety();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-fadeIn transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Ingredient Analysis Results
      </h2>

      <div className={`mb-6 p-4 rounded-lg ${safety.bg} border border-${safety.color}/20`}>
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className={`h-5 w-5 ${safety.color}`} />
          <h3 className={`font-medium ${safety.color}`}>Overall Safety Assessment</h3>
        </div>
        <p className={`${safety.color} font-medium`}>{safety.level}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Based on {ingredients.length} analyzed ingredients
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-medium text-red-800 dark:text-red-400">High Concern</h3>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300">{highConcern.length} ingredients</p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <h3 className="font-medium text-yellow-800 dark:text-yellow-400">Moderate Concern</h3>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">{moderateConcern.length} ingredients</p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/30">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="font-medium text-green-800 dark:text-green-400">Low Concern</h3>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">{lowConcern.length} ingredients</p>
        </div>
      </div>

      <div className="space-y-6">
        {ingredients.map((ingredient, index) => (
          <div 
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{ingredient.name}</h3>
              <SafetyBadge
                safetyLevel={ingredient.safetyLevel}
                ewgScore={ingredient.ewgScore}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  <span className="font-medium">Function:</span> {ingredient.function}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  <span className="font-medium">Common Use:</span> {ingredient.commonUse}
                </p>
              </div>
              
              <div>
                {ingredient.reasonForConcern && (
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p><span className="font-medium">Reason for Concern:</span> {ingredient.reasonForConcern}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientResults;