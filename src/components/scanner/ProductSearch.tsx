import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { Product } from '../../types/product';
import { searchProduct } from '../../utils/productSearch';

interface ProductSearchProps {
  onProductFound: (product: Product) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onProductFound }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const product = await searchProduct(query);
      if (product) {
        onProductFound(product);
      } else {
        setError('Product not found. Try a different search term.');
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a product..."
          className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                    focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-green-500"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {isSearching && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;