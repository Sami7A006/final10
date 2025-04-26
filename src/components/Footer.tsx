import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 py-6 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 md:mb-0">
            © {new Date().getFullYear()} NutriNexus. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span className="text-gray-600 dark:text-gray-400 text-sm">for your health</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;