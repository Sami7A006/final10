import React, { useState } from 'react';
import { CalendarDays, ChevronDown, ChevronUp } from 'lucide-react';

interface WeeklyProgressProps {
  currentWeight: number;
  targetWeight: number;
  weeks: number;
}

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({
  currentWeight,
  targetWeight,
  weeks
}) => {
  const [showAllWeeks, setShowAllWeeks] = useState(false);
  const weightDifference = targetWeight - currentWeight;
  const weeklyChange = weightDifference / weeks;
  const isGain = weightDifference > 0;

  // Generate weekly targets
  const weeklyTargets = Array.from({ length: weeks }, (_, index) => {
    const weekWeight = currentWeight + (weeklyChange * (index + 1));
    return {
      week: index + 1,
      weight: parseFloat(weekWeight.toFixed(1))
    };
  });

  const displayedWeeks = showAllWeeks ? weeklyTargets : weeklyTargets.slice(0, 4);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-5 w-5 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Weekly Weight Targets
        </h3>
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded-lg ${
          isGain 
            ? 'bg-blue-50 dark:bg-blue-900/20' 
            : 'bg-green-50 dark:bg-green-900/20'
        }`}>
          <p className={`text-sm font-medium ${
            isGain 
              ? 'text-blue-700 dark:text-blue-300' 
              : 'text-green-700 dark:text-green-300'
          }`}>
            Target {isGain ? 'Gain' : 'Loss'}: {Math.abs(parseFloat(weeklyChange.toFixed(2)))} kg per week
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedWeeks.map((target) => (
            <div
              key={target.week}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Week {target.week}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {target.weight} kg
              </p>
            </div>
          ))}
        </div>

        {weeks > 4 && (
          <button
            onClick={() => setShowAllWeeks(!showAllWeeks)}
            className="w-full mt-4 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            {showAllWeeks ? (
              <>
                Show Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default WeeklyProgress;