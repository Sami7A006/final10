import React from 'react';
import { Camera, Scale, Salad, MessageSquareText } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const features = [
  {
    icon: Camera,
    title: 'Ingredient Scanner',
    description: 'Scan product labels to analyze ingredients for safety',
    path: 'scanner'
  },
  {
    icon: Scale,
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index and get health insights',
    path: 'bmi'
  },
  {
    icon: Salad,
    title: 'Indian Diet Plans',
    description: 'Get personalized Indian diet plans based on your goals',
    path: 'diet'
  },
  {
    icon: MessageSquareText,
    title: 'Health Assistant',
    description: 'Chat with our AI to get personalized health advice',
    path: 'chat'
  }
];

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Your Personal Health Assistant
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Analyze ingredients, track health metrics, and get personalized diet plans
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
              <button
                onClick={() => onNavigate(feature.path)}
                className="mt-4 w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
              >
                Get Started
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;