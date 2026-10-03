export type Zone = 'fridge' | 'pantry' | 'freezer';
export type Category = 'protein' | 'dairy' | 'produce' | 'frozen' | 'dry' | 'condiment' | 'staple';
export type Mood = 'idle' | 'happy' | 'excited' | 'bliss' | 'sleepy' | 'frost' | 'shock';
export type Region = 'japanese' | 'korean' | 'chinese' | 'southeast-asian';

export interface Ingredient {
  id: string;
  name: string;
  cat: Category;
  zone: Zone;
  aliases: string[];
  staple?: boolean;
  shelfAsset?: string;
}

export interface RecipeIngredient {
  id: string;
  optional?: boolean;
}

export type CookTool = 'wok' | 'pan' | 'pot' | 'oven' | 'bowl';

export interface Recipe {
  id: string;
  name: string;
  cuisine: 'australian' | 'asian';
  region?: Region;
  ingredients: RecipeIngredient[];
  blurb: string;
  steps: string[];
  dishAsset: string;
  tool: CookTool;
}

export type Bucket = 'now' | 'almost' | 'later';

export interface RankedRecipe {
  recipe: Recipe;
  coverage: number;
  have: string[];
  missing: string[];
  missingOptional: string[];
  bucket: Bucket;
}
