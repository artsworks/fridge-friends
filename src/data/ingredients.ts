import type { Category, Ingredient, Zone } from '../lib/types';
import { STAPLES } from './staples';

const i = (id: string, name: string, cat: Category, zone: Zone, aliases: string[], shelfAsset?: string): Ingredient =>
  shelfAsset ? { id, name, cat, zone, aliases, shelfAsset } : { id, name, cat, zone, aliases };

export const STOCKABLE: Ingredient[] = [
  // Fridge (21)
  i('egg', 'Egg', 'protein', 'fridge', ['eggs', 'hen egg'], 'egg_carton'),
  i('chicken', 'Chicken', 'protein', 'fridge', ['chicken breast', 'chicken thigh', 'chicken pieces', 'chicken drumstick']),
  i('beef_mince', 'Beef Mince', 'protein', 'fridge', ['ground beef', 'minced beef', 'beef mince']),
  i('beef_sliced', 'Beef Slices', 'protein', 'fridge', ['sliced beef', 'thin beef', 'beef strips', 'bulgogi beef', 'shaved beef']),
  i('steak', 'Steak', 'protein', 'fridge', ['beef steak', 'sirloin', 'scotch fillet']),
  i('bacon', 'Bacon', 'protein', 'fridge', ['bacon rashers', 'streaky bacon', 'shortcut bacon']),
  i('tofu', 'Tofu', 'protein', 'fridge', ['bean curd', 'firm tofu']),
  i('cheese', 'Cheese', 'dairy', 'fridge', ['mozzarella', 'cheddar', 'shredded cheese', 'tasty cheese', 'parmesan']),
  i('milk', 'Milk', 'dairy', 'fridge', ['full cream milk']),
  i('butter', 'Butter', 'dairy', 'fridge', ['unsalted butter']),
  i('spring_onion', 'Spring Onion', 'produce', 'fridge', ['scallion', 'green onion', 'shallots (au)']),
  i('chilli', 'Chilli', 'produce', 'fridge', ['red chilli', 'fresh chilli', 'birds eye chilli', 'chili']),
  i('carrot', 'Carrot', 'produce', 'fridge', ['carrots']),
  i('capsicum', 'Capsicum', 'produce', 'fridge', ['bell pepper', 'red pepper']),
  i('tomato', 'Tomato', 'produce', 'fridge', ['fresh tomato', 'tomatoes']),
  i('spinach', 'Spinach', 'produce', 'fridge', ['baby spinach', 'spinach leaves']),
  i('mushroom', 'Mushroom', 'produce', 'fridge', ['mushrooms', 'button mushrooms', 'shiitake']),
  i('cabbage', 'Cabbage', 'produce', 'fridge', ['green cabbage', 'wombok', 'napa cabbage']),
  i('ginger', 'Ginger', 'produce', 'fridge', ['fresh ginger']),
  i('kimchi', 'Kimchi', 'produce', 'fridge', ['kimchee', 'napa kimchi']),
  i('lemon', 'Lemon', 'produce', 'fridge', ['lemons']),
  // Pantry (25)
  i('rice', 'Rice', 'dry', 'pantry', ['steamed rice', 'cooked rice', 'jasmine rice', 'short grain rice']),
  i('spaghetti', 'Spaghetti', 'dry', 'pantry', ['pasta', 'spaghetti pasta']),
  i('flour', 'Flour', 'dry', 'pantry', ['plain flour', 'all purpose flour']),
  i('panko', 'Panko', 'dry', 'pantry', ['panko breadcrumbs', 'breadcrumbs']),
  i('bread', 'Bread', 'dry', 'pantry', ['bread roll', 'burger bun', 'white bread']),
  i('tuna', 'Canned Tuna', 'protein', 'pantry', ['tinned tuna', 'tuna can', 'canned tuna in oil']),
  i('nori', 'Nori', 'dry', 'pantry', ['seaweed', 'roasted seaweed', 'nori sheet']),
  i('curry_roux', 'Curry Roux', 'dry', 'pantry', ['japanese curry', 'curry blocks', 'golden curry']),
  i('rice_noodles', 'Rice Noodles', 'dry', 'pantry', ['flat rice noodles', 'ho fun', 'sen yai', 'rice sticks']),
  i('sugar', 'Sugar', 'dry', 'pantry', ['white sugar', 'caster sugar']),
  i('soy_sauce', 'Soy Sauce', 'condiment', 'pantry', ['shoyu', 'light soy']),
  i('mirin', 'Mirin', 'condiment', 'pantry', ['sweet rice wine', 'mirin seasoning']),
  i('oyster_sauce', 'Oyster Sauce', 'condiment', 'pantry', ['oyster flavoured sauce']),
  i('kecap_manis', 'Kecap Manis', 'condiment', 'pantry', ['sweet soy sauce', 'ketjap manis']),
  i('gochujang', 'Gochujang', 'condiment', 'pantry', ['korean chilli paste', 'gochu jang']),
  i('sesame_oil', 'Sesame Oil', 'condiment', 'pantry', ['toasted sesame oil']),
  i('sesame_seeds', 'Sesame Seeds', 'condiment', 'pantry', ['toasted sesame', 'sesame']),
  i('kewpie_mayo', 'Kewpie Mayo', 'condiment', 'pantry', ['japanese mayonnaise', 'kewpie', 'mayo']),
  i('ketchup', 'Tomato Ketchup', 'condiment', 'pantry', ['tomato sauce', 'ketchup']),
  i('passata', 'Passata', 'condiment', 'pantry', ['tomato passata', 'crushed tomatoes', 'tomato puree']),
  i('herbs', 'Mixed Herbs', 'condiment', 'pantry', ['parsley', 'mixed herbs', 'dried herbs', 'italian herbs']),
  i('onion', 'Onion', 'produce', 'pantry', ['brown onion', 'yellow onion', 'onions']),
  i('garlic', 'Garlic', 'produce', 'pantry', ['garlic cloves', 'garlic bulb']),
  i('potato', 'Potato', 'produce', 'pantry', ['potatoes', 'russet potato']),
  i('pumpkin', 'Pumpkin', 'produce', 'pantry', ['butternut pumpkin', 'kent pumpkin', 'squash']),
  // Freezer (5)
  i('peas', 'Frozen Peas', 'frozen', 'freezer', ['peas', 'green peas', 'garden peas'], 'peas_bag'),
  i('corn', 'Corn Kernels', 'frozen', 'freezer', ['frozen corn', 'sweet corn'], 'corn_bag'),
  i('gyoza', 'Frozen Dumplings', 'frozen', 'freezer', ['gyoza', 'dumplings', 'frozen dumplings', 'potstickers', 'jiaozi'], 'gyoza_bag'),
  i('puff_pastry', 'Puff Pastry', 'frozen', 'freezer', ['pastry sheets', 'puff pastry sheets']),
  i('chips', 'Frozen Chips', 'frozen', 'freezer', ['fries', 'french fries', 'frozen fries'], 'chips_bag'),
];

export const INGREDIENTS: Ingredient[] = [...STOCKABLE, ...STAPLES];

export const BY_ID: ReadonlyMap<string, Ingredient> = new Map(INGREDIENTS.map((x) => [x.id, x]));

export const STOCKABLE_IDS: ReadonlySet<string> = new Set(STOCKABLE.map((x) => x.id));

export const ZONES: { id: Zone; label: string; blurb: string }[] = [
  { id: 'fridge', label: 'Fridge', blurb: 'chilly friends' },
  { id: 'pantry', label: 'Pantry', blurb: 'shelf-stable pals' },
  { id: 'freezer', label: 'Freezer', blurb: 'frosty buddies' },
];

export const byZone = (zone: Zone): Ingredient[] => STOCKABLE.filter((x) => x.zone === zone);

export const nameOf = (id: string): string => BY_ID.get(id)?.name ?? id;
