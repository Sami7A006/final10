import { Ingredient } from '../types/ingredient';
import * as cheerio from 'cheerio';

// Comprehensive ingredient database with safety ratings and properties
const ingredientDatabase: Record<string, {
  baseScore: number;
  category: string;
  concerns: string[];
  benefits: string[];
  scientificName?: string;
  restrictions?: string[];
}> = {
  // Preservatives
  'paraben': {
    baseScore: 7,
    category: 'Preservative',
    concerns: ['Endocrine disruption', 'Reproductive toxicity'],
    benefits: ['Effective preservation', 'Extends product shelf life'],
    restrictions: ['Restricted in EU']
  },
  'phenoxyethanol': {
    baseScore: 4,
    category: 'Preservative',
    concerns: ['Potential skin irritation', 'Allergic reactions in sensitive individuals'],
    benefits: ['Broad spectrum preservation', 'Stable in formulations']
  },
  'sodium benzoate': {
    baseScore: 3,
    category: 'Preservative',
    concerns: ['Potential irritation at high concentrations'],
    benefits: ['Natural origin option', 'Effective against mold']
  },

  // Surfactants
  'sodium lauryl sulfate': {
    baseScore: 4,
    category: 'Surfactant',
    concerns: ['Skin irritation', 'Barrier disruption'],
    benefits: ['Effective cleansing', 'Good foaming']
  },
  'cocamidopropyl betaine': {
    baseScore: 3,
    category: 'Surfactant',
    concerns: ['Mild skin sensitization'],
    benefits: ['Gentle cleansing', 'Reduces irritation from other surfactants']
  },

  // Emollients
  'glycerin': {
    baseScore: 1,
    category: 'Emollient',
    concerns: [],
    benefits: ['Hydration', 'Skin barrier support'],
    scientificName: 'Glycerol'
  },
  'hyaluronic acid': {
    baseScore: 1,
    category: 'Humectant',
    concerns: [],
    benefits: ['Deep hydration', 'Anti-aging properties'],
    scientificName: 'Sodium Hyaluronate'
  },

  // Antioxidants
  'vitamin e': {
    baseScore: 1,
    category: 'Antioxidant',
    concerns: [],
    benefits: ['Antioxidant protection', 'Skin conditioning'],
    scientificName: 'Tocopherol'
  },
  'vitamin c': {
    baseScore: 1,
    category: 'Antioxidant',
    concerns: ['Stability issues'],
    benefits: ['Brightening', 'Collagen support'],
    scientificName: 'Ascorbic Acid'
  },

  // UV Filters
  'titanium dioxide': {
    baseScore: 2,
    category: 'UV Filter',
    concerns: ['Potential inhalation risk (powder form)'],
    benefits: ['Broad spectrum protection', 'Stable sun protection'],
    scientificName: 'TiO2'
  },
  'zinc oxide': {
    baseScore: 2,
    category: 'UV Filter',
    concerns: ['White cast on skin'],
    benefits: ['Natural sun protection', 'Skin soothing'],
    scientificName: 'ZnO'
  }
};

const fetchEWGData = async (ingredient: string): Promise<Partial<Ingredient> | null> => {
  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ewg-search`;
    const response = await fetch(`${apiUrl}?ingredient=${encodeURIComponent(ingredient)}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      }
    });

    if (!response.ok) {
      console.warn(`Failed to fetch EWG data for ${ingredient}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    if (data.error) {
      console.warn(`EWG data error for ${ingredient}: ${data.error}`);
      return null;
    }

    const $ = cheerio.load(data.html);
    
    const firstResult = $('.product-listing').first();
    if (!firstResult.length) {
      return null;
    }

    const scoreText = firstResult.find('.product-score').text().trim();
    const scoreMatch = scoreText.match(/\d+/);
    const score = scoreMatch ? parseInt(scoreMatch[0]) : null;

    const concerns = firstResult.find('.product-concerns li')
      .map((_, el) => $(el).text().trim())
      .get()
      .join(', ');

    const functionText = firstResult.find('.product-details .function').text().trim();
    const useText = firstResult.find('.product-details .common-use').text().trim();

    // Combine EWG data with our database
    const dbMatch = findIngredientInDatabase(ingredient);
    const finalScore = score || (dbMatch ? dbMatch.baseScore : calculateDefaultScore(ingredient));

    return {
      ewgScore: finalScore,
      safetyLevel: getSafetyLevel(finalScore),
      reasonForConcern: concerns || (dbMatch ? dbMatch.concerns.join(', ') : getDefaultConcern(finalScore)),
      function: functionText || (dbMatch ? dbMatch.category : getIngredientFunction(ingredient)),
      commonUse: useText || getCommonUse(ingredient),
      scientificName: dbMatch?.scientificName,
      benefits: dbMatch?.benefits?.join(', '),
      restrictions: dbMatch?.restrictions?.join(', ')
    };
  } catch (error) {
    console.warn(`Error fetching EWG data for ${ingredient}:`, error);
    return null;
  }
};

const findIngredientInDatabase = (ingredient: string): typeof ingredientDatabase[keyof typeof ingredientDatabase] | null => {
  const normalizedInput = ingredient.toLowerCase();
  
  // Direct match
  if (normalizedInput in ingredientDatabase) {
    return ingredientDatabase[normalizedInput];
  }

  // Partial match
  for (const [key, value] of Object.entries(ingredientDatabase)) {
    if (normalizedInput.includes(key) || key.includes(normalizedInput)) {
      return value;
    }
  }

  return null;
};

const calculateDefaultScore = (ingredient: string): number => {
  const riskPatterns = {
    high: {
      score: 7,
      patterns: [
        /paraben/i, /phthalate/i, /formaldehyde/i, /triclosan/i,
        /bha/i, /bht/i, /toluene/i, /petroleum/i, /lead/i, /mercury/i,
        /hydroquinone/i, /oxybenzone/i, /coal tar/i, /ethanolamines/i
      ]
    },
    moderate: {
      score: 4,
      patterns: [
        /peg-\d+/i, /phenoxyethanol/i, /sodium lauryl sulfate/i,
        /propylene/i, /butylene/i, /synthetic/i, /fragrance/i,
        /dmdm/i, /diazolidinyl/i, /quaternium/i
      ]
    },
    low: {
      score: 2,
      patterns: [
        /water/i, /aqua/i, /aloe/i, /glycerin/i, /vitamin/i,
        /panthenol/i, /allantoin/i, /zinc/i, /titanium dioxide/i,
        /hyaluronic/i, /ceramide/i, /peptide/i
      ]
    },
    veryLow: {
      score: 1,
      patterns: [
        /^water$/i, /^aloe vera$/i, /^glycerin$/i,
        /^vitamin (a|b|c|d|e)$/i, /^zinc oxide$/i,
        /^green tea$/i, /^chamomile$/i, /^calendula$/i
      ]
    }
  };

  for (const [risk, { patterns, score }] of Object.entries(riskPatterns)) {
    if (patterns.some(pattern => pattern.test(ingredient))) {
      return score;
    }
  }

  return 5; // Default moderate score
};

const getSafetyLevel = (score: number): string => {
  if (score <= 2) return 'Low Concern';
  if (score <= 6) return 'Moderate Concern';
  return 'High Concern';
};

const getDefaultConcern = (score: number): string => {
  if (score <= 2) return 'Generally recognized as safe with extensive safety data';
  if (score <= 6) return 'Moderate safety concerns, may require more research';
  return 'High safety concerns, potential risks identified';
};

const getIngredientFunction = (ingredient: string): string => {
  const functions: { [key: string]: string[] } = {
    'Preservative': [
      'paraben', 'phenoxyethanol', 'benzoate', 'sorbate', 'formaldehyde',
      'methylisothiazolinone', 'benzyl alcohol', 'potassium sorbate'
    ],
    'Surfactant': [
      'lauryl', 'laureth', 'sodium', 'cocamide', 'sulfate', 'betaine',
      'decyl glucoside', 'coco-glucoside', 'polysorbate'
    ],
    'Emollient': [
      'oil', 'butter', 'glycerin', 'lanolin', 'dimethicone', 'squalane',
      'ceramide', 'fatty acid', 'triglyceride', 'caprylic'
    ],
    'Fragrance': [
      'fragrance', 'parfum', 'aroma', 'essential oil', 'limonene',
      'linalool', 'citral', 'geraniol'
    ],
    'UV Filter': [
      'benzophenone', 'avobenzone', 'titanium dioxide', 'zinc oxide',
      'octinoxate', 'oxybenzone', 'octocrylene', 'homosalate'
    ],
    'Antioxidant': [
      'tocopherol', 'vitamin', 'retinol', 'ascorbic', 'niacinamide',
      'flavonoid', 'polyphenol', 'resveratrol'
    ],
    'Humectant': [
      'glycerin', 'hyaluronic', 'urea', 'propylene glycol', 'butylene glycol',
      'sodium pca', 'sorbitol', 'panthenol'
    ],
    'Emulsifier': [
      'cetyl', 'stearic', 'glyceryl', 'polysorbate', 'cetearyl',
      'peg', 'sorbitan', 'carbomer'
    ]
  };

  const lowerIngredient = ingredient.toLowerCase();
  for (const [func, keywords] of Object.entries(functions)) {
    if (keywords.some(keyword => lowerIngredient.includes(keyword))) {
      return func;
    }
  }

  return 'Other/Unknown';
};

const getCommonUse = (ingredient: string): string => {
  const uses: { [key: string]: string[] } = {
    'Moisturizing agent': [
      'glycerin', 'oil', 'butter', 'hyaluronic', 'dimethicone',
      'squalane', 'ceramide', 'fatty acid', 'jojoba'
    ],
    'Cleansing agent': [
      'lauryl', 'laureth', 'cocamide', 'sulfate', 'glucoside',
      'betaine', 'sodium cocoyl', 'decyl'
    ],
    'Preservative system': [
      'paraben', 'phenoxyethanol', 'benzoate', 'formaldehyde',
      'methylisothiazolinone', 'potassium sorbate'
    ],
    'Fragrance component': [
      'fragrance', 'parfum', 'aroma', 'essential oil', 'limonene',
      'linalool', 'citral', 'geraniol'
    ],
    'Sun protection': [
      'benzophenone', 'avobenzone', 'titanium', 'zinc oxide',
      'octinoxate', 'oxybenzone', 'octocrylene'
    ],
    'Antioxidant protection': [
      'tocopherol', 'vitamin', 'retinol', 'ascorbic', 'niacinamide',
      'flavonoid', 'polyphenol'
    ],
    'Thickening agent': [
      'carbomer', 'xanthan', 'cellulose', 'guar', 'carrageenan',
      'acacia', 'agar', 'alginate'
    ],
    'Skin conditioning': [
      'aloe', 'panthenol', 'allantoin', 'chamomile', 'calendula',
      'green tea', 'collagen', 'peptide'
    ]
  };

  const lowerIngredient = ingredient.toLowerCase();
  for (const [use, keywords] of Object.entries(uses)) {
    if (keywords.some(keyword => lowerIngredient.includes(keyword))) {
      return use;
    }
  }

  return 'Various applications';
};

export const analyzeIngredients = async (ingredientList: string): Promise<Ingredient[]> => {
  const ingredientsArray = ingredientList
    .toLowerCase()
    .split(/[,;\n]+/)
    .map(item => item.trim())
    .filter(item => item && item.length > 1);

  const analyzedIngredients: Ingredient[] = [];

  for (const name of ingredientsArray) {
    const ewgData = await fetchEWGData(name);
    const dbMatch = findIngredientInDatabase(name);
    
    analyzedIngredients.push({
      name: name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      function: ewgData?.function || (dbMatch ? dbMatch.category : getIngredientFunction(name)),
      ewgScore: ewgData?.ewgScore || (dbMatch ? dbMatch.baseScore : calculateDefaultScore(name)),
      safetyLevel: ewgData?.safetyLevel || (dbMatch ? getSafetyLevel(dbMatch.baseScore) : getSafetyLevel(calculateDefaultScore(name))),
      reasonForConcern: ewgData?.reasonForConcern || (dbMatch ? dbMatch.concerns.join(', ') : getDefaultConcern(calculateDefaultScore(name))),
      commonUse: ewgData?.commonUse || getCommonUse(name),
      scientificName: dbMatch?.scientificName,
      benefits: dbMatch?.benefits?.join(', '),
      restrictions: dbMatch?.restrictions?.join(', ')
    });
  }

  return analyzedIngredients;
};