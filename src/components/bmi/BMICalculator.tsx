import React, { useState } from 'react';
import { Scale, Activity, ArrowLeft, ArrowRight, Target } from 'lucide-react';

interface BMICalculatorProps {
  onNavigate?: (page: string) => void;
}

const BMICalculator: React.FC<BMICalculatorProps> = ({ onNavigate }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState<number | null>(null);

  const calculateBMI = () => {
    const heightInM = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (heightInM > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInM * heightInM);
      setBMI(parseFloat(bmiValue.toFixed(1)));
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-500' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-500' };
    return { category: 'Obese', color: 'text-red-500' };
  };

  const calculateIdealWeights = (heightInCm: number) => {
    const heightInM = heightInCm / 100;
    const heightInInches = heightInCm / 2.54;

    // Robinson formula (1983)
    const robinsonMale = 52 + 1.9 * (heightInInches - 60);
    const robinsonFemale = 49 + 1.7 * (heightInInches - 60);

    // Miller formula (1983)
    const millerMale = 56.2 + 1.41 * (heightInInches - 60);
    const millerFemale = 53.1 + 1.36 * (heightInInches - 60);

    // Devine formula (1974)
    const devineMale = 50 + 2.3 * (heightInInches - 60);
    const devineFemale = 45.5 + 2.3 * (heightInInches - 60);

    // Hamwi formula (1964)
    const hamwiMale = 48 + 2.7 * (heightInInches - 60);
    const hamwiFemale = 45.5 + 2.2 * (heightInInches - 60);

    // BMI-based range (18.5-24.9)
    const bmiMin = (18.5 * heightInM * heightInM).toFixed(1);
    const bmiMax = (24.9 * heightInM * heightInM).toFixed(1);

    return {
      robinson: {
        male: robinsonMale.toFixed(1),
        female: robinsonFemale.toFixed(1)
      },
      miller: {
        male: millerMale.toFixed(1),
        female: millerFemale.toFixed(1)
      },
      devine: {
        male: devineMale.toFixed(1),
        female: devineFemale.toFixed(1)
      },
      hamwi: {
        male: hamwiMale.toFixed(1),
        female: hamwiFemale.toFixed(1)
      },
      bmiRange: {
        min: bmiMin,
        max: bmiMax
      }
    };
  };

  const getWeightDifference = (currentWeight: number, heightInCm: number) => {
    const idealWeights = calculateIdealWeights(heightInCm);
    const bmiMin = parseFloat(idealWeights.bmiRange.min);
    const bmiMax = parseFloat(idealWeights.bmiRange.max);

    if (currentWeight < bmiMin) {
      return {
        type: 'gain',
        amount: (bmiMin - currentWeight).toFixed(1)
      };
    } else if (currentWeight > bmiMax) {
      return {
        type: 'lose',
        amount: (currentWeight - bmiMax).toFixed(1)
      };
    }
    return null;
  };

  const handleDietPlan = () => {
    const goal = bmi && bmi > 25 ? 'weight_loss' : 
                bmi && bmi < 18.5 ? 'weight_gain' : 'maintenance';
    onNavigate?.('diet');
  };

  const idealWeights = height ? calculateIdealWeights(parseFloat(height)) : null;
  const weightDiff = height && weight ? 
    getWeightDifference(parseFloat(weight), parseFloat(height)) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {onNavigate && (
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </button>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Scale className="h-6 w-6 text-green-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            BMI Calculator
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter height in centimeters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter weight in kilograms"
            />
          </div>

          <button
            onClick={calculateBMI}
            className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 
                     transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Activity className="h-5 w-5" />
            Calculate BMI
          </button>
        </div>
      </div>

      {bmi !== null && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeIn">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Your Results
          </h3>
          
          <div className="text-center mb-6">
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {bmi}
            </p>
            <p className={`text-xl font-medium ${getBMICategory(bmi).color}`}>
              {getBMICategory(bmi).category}
            </p>
          </div>

          {idealWeights && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium text-blue-800 dark:text-blue-400">
                    Healthy BMI Range
                  </h4>
                </div>
                <p className="text-blue-700 dark:text-blue-300">
                  For your height of {height} cm, a healthy weight range is between{' '}
                  <span className="font-medium">{idealWeights.bmiRange.min}</span> and{' '}
                  <span className="font-medium">{idealWeights.bmiRange.max}</span> kg
                </p>
                {weightDiff && (
                  <p className="mt-2 text-blue-700 dark:text-blue-300">
                    You need to {weightDiff.type === 'lose' ? 'lose' : 'gain'}{' '}
                    <span className="font-medium">{weightDiff.amount}</span> kg to reach a healthy weight
                  </p>
                )}
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                  Ideal Weight Estimates
                </h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Robinson Formula (1983)
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Male: {idealWeights.robinson.male} kg
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Female: {idealWeights.robinson.female} kg
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Miller Formula (1983)
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Male: {idealWeights.miller.male} kg
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Female: {idealWeights.miller.female} kg
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Devine Formula (1974)
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Male: {idealWeights.devine.male} kg
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Female: {idealWeights.devine.female} kg
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hamwi Formula (1964)
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Male: {idealWeights.hamwi.male} kg
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Female: {idealWeights.hamwi.female} kg
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              BMI Categories:
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="text-blue-500">Underweight: &lt; 18.5</li>
              <li className="text-green-500">Normal weight: 18.5 - 24.9</li>
              <li className="text-yellow-500">Overweight: 25 - 29.9</li>
              <li className="text-red-500">Obese: ≥ 30</li>
            </ul>
          </div>

          {onNavigate && (
            <button
              onClick={handleDietPlan}
              className="mt-6 w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 
                       transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ArrowRight className="h-5 w-5" />
              Get Personalized Diet Plan
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BMICalculator;