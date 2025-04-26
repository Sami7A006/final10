import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface SafetyBadgeProps {
  safetyLevel: string;
  ewgScore: number;
}

const SafetyBadge: React.FC<SafetyBadgeProps> = ({ safetyLevel, ewgScore }) => {
  let bgColor = '';
  let textColor = '';
  let borderColor = '';
  let Icon = CheckCircle;

  switch (safetyLevel) {
    case 'High Concern':
      bgColor = 'bg-red-50 dark:bg-red-900/20';
      textColor = 'text-red-700 dark:text-red-300';
      borderColor = 'border-red-200 dark:border-red-800/30';
      Icon = AlertTriangle;
      break;
    case 'Moderate Concern':
      bgColor = 'bg-yellow-50 dark:bg-yellow-900/20';
      textColor = 'text-yellow-700 dark:text-yellow-300';
      borderColor = 'border-yellow-200 dark:border-yellow-800/30';
      Icon = AlertCircle;
      break;
    case 'Low Concern':
      bgColor = 'bg-green-50 dark:bg-green-900/20';
      textColor = 'text-green-700 dark:text-green-300';
      borderColor = 'border-green-200 dark:border-green-800/30';
      Icon = CheckCircle;
      break;
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${bgColor} ${borderColor}`}>
      <Icon className={`h-4 w-4 ${textColor}`} />
      <span className={`text-xs font-medium ${textColor}`}>
        {safetyLevel} (EWG: {ewgScore}/10)
      </span>
    </div>
  );
};

export default SafetyBadge;