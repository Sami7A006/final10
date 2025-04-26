import { Product, ProductReview } from '../types/product';
import { analyzeIngredients } from './ingredientAnalyzer';

const fetchEWGData = async (query: string): Promise<any> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ewg-search?query=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || 'Failed to fetch EWG data');
    }

    const data = await response.json();
    if (!data || data.error) {
      throw new Error(data.error || 'Invalid response from EWG search');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching EWG data:', error);
    throw error; // Re-throw to handle in the UI
  }
};

const fetchRedditReviews = async (productName: string): Promise<ProductReview[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reddit-reviews?product=${encodeURIComponent(productName)}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    });
    if (!response.ok) throw new Error('Reddit API request failed');
    return await response.json();
  } catch (error) {
    console.error('Error fetching Reddit reviews:', error);
    return [];
  }
};

export const searchProduct = async (query: string): Promise<Product | null> => {
  try {
    const ewgData = await fetchEWGData(query);
    if (!ewgData) return null;

    const redditReviews = await fetchRedditReviews(query);
    
    const product: Product = {
      name: ewgData.name,
      brand: ewgData.brand,
      category: ewgData.category,
      ewgScore: ewgData.score,
      ingredients: ewgData.ingredients || [],
      reviews: redditReviews,
      safetyLevel: getSafetyLevel(ewgData.score),
      concerns: ewgData.concerns || []
    };

    return product;
  } catch (error) {
    console.error('Error searching product:', error);
    throw error; // Re-throw to handle in the UI
  }
};

const getSafetyLevel = (score: number): string => {
  if (score <= 2) return 'Low Concern';
  if (score <= 6) return 'Moderate Concern';
  return 'High Concern';
};