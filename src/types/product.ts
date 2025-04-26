export interface ProductReview {
  source: string;
  title: string;
  content: string;
  rating?: number;
  url: string;
  date: string;
}

export interface Product {
  name: string;
  brand?: string;
  category?: string;
  ewgScore?: number;
  ingredients: string[];
  reviews: ProductReview[];
  safetyLevel: string;
  concerns: string[];
}