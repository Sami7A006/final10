import React from 'react';
import { ExternalLink, Star, AlertTriangle, Info } from 'lucide-react';
import { Product } from '../../types/product';

interface ProductResultsProps {
  product: Product;
}

const ProductResults: React.FC<ProductResultsProps> = ({ product }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {product.name}
          {product.brand && <span className="text-gray-500 text-sm ml-2">by {product.brand}</span>}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Safety Score</h3>
            <div className={`text-2xl font-bold ${
              product.ewgScore && product.ewgScore <= 2 ? 'text-green-500' :
              product.ewgScore && product.ewgScore <= 6 ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {product.ewgScore}/10
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              EWG Safety Rating
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Category</h3>
            <p className="text-gray-600 dark:text-gray-300">{product.category || 'Unknown'}</p>
          </div>
        </div>

        {product.concerns.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Key Concerns
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
              {product.concerns.map((concern, index) => (
                <li key={index}>{concern}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Ingredients
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      </div>

      {product.reviews.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Community Reviews
          </h3>
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div
                key={index}
                className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{review.title}</h4>
                  {review.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {review.rating}/5
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{review.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>From {review.source}</span>
                  <a
                    href={review.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                  >
                    View Source
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductResults;