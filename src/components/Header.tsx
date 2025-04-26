import React from 'react';
import { Moon, Sun, Salad, Home } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-gray-800 dark:text-white hover:text-green-500 dark:hover:text-green-400 transition-colors"
          >
            <Salad className="h-8 w-8 text-green-500" />
            <h1 className="text-2xl font-bold">
              NutriNexus
            </h1>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Home"
          >
            <Home className="h-5 w-5" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header