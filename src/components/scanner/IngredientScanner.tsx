import React, { useState } from 'react';
import { Scan, ArrowLeft, AlertTriangle } from 'lucide-react';
import { analyzeIngredients } from '../../utils/ingredientAnalyzer';
import IngredientResults from './IngredientResults';
import ImageCapture from './ImageCapture';
import { Ingredient } from '../../types/ingredient';

interface IngredientScannerProps {
  onNavigate?: (page: string) => void;
}

const IngredientScanner: React.FC<IngredientScannerProps> = ({ onNavigate }) => {
  const [ingredients, setIngredients] = useState('');
  const [analyzedIngredients, setAnalyzedIngredients] = useState<Ingredient[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!ingredients.trim()) {
      setError('Please enter ingredients to analyze');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const results = await analyzeIngredients(ingredients);
      if (results.length === 0) {
        setError('No valid ingredients found. Please check your input and try again.');
        return;
      }
      setAnalyzedIngredients(results);
    } catch (err) {
      setError('Failed to analyze ingredients. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTextExtracted = (text: string) => {
    if (!text.trim()) {
      setError('No text could be extracted from the image. Please try again or enter ingredients manually.');
      return;
    }
    setIngredients(text);
    setAnalyzedIngredients([]);
    setError(null);
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
          Ingredient Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Scan or paste ingredients to analyze their safety and potential concerns.
        </p>
        
        <div className="space-y-6">
          <ImageCapture onTextExtracted={handleTextExtracted} />
          
          <textarea
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                      focus:ring-2 focus:ring-green-500 focus:border-transparent 
                      resize-none transition-colors duration-200"
            placeholder="Paste ingredients here (e.g., Water, Glycerin, Fragrance, Sodium Lauryl Sulfate...)"
            value={ingredients}
            onChange={(e) => {
              setIngredients(e.target.value);
              setError(null);
            }}
          />
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
          
          {ingredients && (
            <button
              onClick={handleAnalyze}
              disabled={!ingredients.trim() || isAnalyzing}
              className={`
                flex items-center justify-center gap-2 w-full py-2 px-4 rounded-md 
                text-white font-medium transition-all duration-200
                ${
                  !ingredients.trim() || isAnalyzing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 active:bg-green-700'
                }
              `}
            >
              <Scan className="h-5 w-5" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Ingredients'}
            </button>
          )}
        </div>
      </div>

      {analyzedIngredients.length > 0 && <IngredientResults ingredients={analyzedIngredients} />}
    </div>
  );
};

export default IngredientScanner;