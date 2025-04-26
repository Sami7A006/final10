import React from 'react';
import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import IngredientScanner from './components/scanner/IngredientScanner';
import BMICalculator from './components/bmi/BMICalculator';
import DietPlanCreator from './components/diet/DietPlanCreator';
import HealthChatbot from './components/chat/HealthChatbot';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'scanner':
        return <IngredientScanner onNavigate={setCurrentPage} />;
      case 'bmi':
        return <BMICalculator onNavigate={setCurrentPage} />;
      case 'diet':
        return <DietPlanCreator onNavigate={setCurrentPage} />;
      case 'chat':
        return <HealthChatbot onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
        <Header onNavigate={setCurrentPage} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {renderPage()}
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;