import type { Recipe, RecipeIngredient, Region } from '../lib/types';

const r = (ids: string): RecipeIngredient[] => ids.split(' ').filter(Boolean).map((id) => ({ id }));
const o = (ids: string): RecipeIngredient[] => ids.split(' ').filter(Boolean).map((id) => ({ id, optional: true }));

interface Def {
  id: string;
  name: string;
  region?: Region;
  req: string;
  opt: string;
  staples: string;
  blurb: string;
  steps: string[];
}

const au = (d: Def): Recipe => ({
  id: d.id, name: d.name, cuisine: 'australian',
  ingredients: [...r(d.req), ...o(d.opt), ...r(d.staples)],
  blurb: d.blurb, steps: d.steps, dishAsset: d.id,
});
const as = (d: Def): Recipe => ({ ...au(d), cuisine: 'asian', region: d.region });

export const RECIPES: Recipe[] = [
  // Australian (8)
  au({
    id: 'spaghetti-bolognese', name: 'Spaghetti Bolognese',
    req: 'spaghetti beef_mince onion garlic carrot passata herbs', opt: 'cheese', staples: 'salt pepper oil water',
    blurb: 'Saucy slurpy noodles in a big red hug.',
    steps: ['Soften diced onion, carrot and garlic in oil.', 'Brown the mince, breaking it up.', 'Add passata and herbs; simmer 20 min.', 'Boil spaghetti in salted water, toss with sauce.', 'Top with cheese if you have it.'],
  }),
  au({
    id: 'chicken-parmigiana', name: 'Chicken Parmigiana',
    req: 'chicken panko flour egg passata cheese', opt: 'herbs', staples: 'salt pepper oil',
    blurb: 'The pub classic, crunchy and melty.',
    steps: ['Flatten chicken; season.', 'Dredge in flour, egg, then panko.', 'Shallow-fry until golden.', 'Spoon passata over, pile on cheese.', 'Grill until bubbly.'],
  }),
  au({
    id: 'sausage-rolls', name: 'Sausage Rolls',
    req: 'puff_pastry beef_mince onion egg', opt: 'herbs ketchup', staples: 'salt pepper',
    blurb: 'Flaky little logs of happiness.',
    steps: ['Mix mince, grated onion, salt and pepper.', 'Pipe a log along a pastry strip; roll up.', 'Brush with beaten egg, cut into pieces.', 'Bake at 200°C for 25 min. Ketchup on the side.'],
  }),
  au({
    id: 'shepherds-pie', name: "Shepherd's Pie",
    req: 'beef_mince onion carrot peas potato butter milk', opt: 'cheese herbs', staples: 'salt pepper oil water',
    blurb: 'A cosy blanket of mash on a savoury bed.',
    steps: ['Boil potatoes; mash with butter and milk.', 'Brown mince with onion and carrot.', 'Stir in peas and a splash of water.', 'Spread mash on top (cheese optional).', 'Bake until golden.'],
  }),
  au({
    id: 'roast-chicken-veg', name: 'Roast Chicken & Veg',
    req: 'chicken potato carrot pumpkin onion garlic lemon herbs', opt: 'peas', staples: 'salt pepper oil',
    blurb: 'Sunday roast energy, any day of the week.',
    steps: ['Chop veg into chunks, toss in oil and salt.', 'Rub chicken with lemon, garlic and herbs.', 'Roast together at 200°C for ~50 min.', 'Rest 10 min, then carve and serve.'],
  }),
  au({
    id: 'steak-and-chips', name: 'Steak & Chips',
    req: 'steak chips butter garlic', opt: 'lemon herbs', staples: 'salt pepper oil',
    blurb: 'Sizzle, crunch, garlic butter. Done.',
    steps: ['Bake chips per the pack.', 'Season steak; sear in a hot pan.', 'Baste with butter and crushed garlic.', 'Rest 5 min; serve with the chips.'],
  }),
  au({
    id: 'bacon-egg-roll', name: 'Bacon & Egg Roll',
    req: 'bread bacon egg ketchup', opt: 'tomato cheese butter', staples: 'salt pepper oil',
    blurb: 'Weekend market breakfast in your hand.',
    steps: ['Crisp the bacon in a pan.', 'Fry an egg in the bacon fat.', 'Butter the roll if you like.', 'Stack bacon, egg and ketchup. Squish.'],
  }),
  au({
    id: 'frittata', name: 'Loaded Frittata',
    req: 'egg potato onion spinach cheese', opt: 'bacon corn herbs capsicum tomato mushroom', staples: 'salt pepper oil',
    blurb: 'Fridge-clearing hero, sliced like a cake.',
    steps: ['Fry sliced potato and onion until soft.', 'Wilt in spinach and any extras.', 'Pour over beaten eggs with cheese.', 'Cook low, then finish under the grill.'],
  }),
  // Japanese
  as({
    id: 'teriyaki-chicken', name: 'Teriyaki Chicken', region: 'japanese',
    req: 'chicken soy_sauce mirin sugar ginger garlic rice', opt: 'spring_onion sesame_seeds', staples: 'oil water',
    blurb: 'Glossy, sticky, sweet-salty bliss.',
    steps: ['Cook rice.', 'Pan-fry chicken thigh skin-side down until crisp.', 'Add soy, mirin, sugar, ginger and garlic.', 'Reduce until glossy; slice over rice.', 'Scatter spring onion and sesame.'],
  }),
  as({
    id: 'chicken-katsu-curry', name: 'Chicken Katsu Curry', region: 'japanese',
    req: 'chicken panko flour egg curry_roux potato carrot onion rice', opt: 'spring_onion', staples: 'oil water salt',
    blurb: 'Crunchy cutlet meets velvety curry.',
    steps: ['Simmer onion, carrot and potato in water.', 'Melt in curry roux until thick.', 'Crumb chicken: flour, egg, panko.', 'Fry until golden; slice.', 'Serve over rice with curry.'],
  }),
  as({
    id: 'onigiri', name: 'Tuna Mayo Onigiri', region: 'japanese',
    req: 'rice nori tuna kewpie_mayo', opt: 'sesame_seeds', staples: 'salt water',
    blurb: 'Pocket-sized triangles of joy.',
    steps: ['Cook short-grain rice; let it cool a little.', 'Mix tuna with Kewpie mayo.', 'Wet salted hands, shape rice around a spoon of filling.', 'Wrap with a strip of nori.'],
  }),
  // Korean
  as({
    id: 'kimchi-fried-rice', name: 'Kimchi Fried Rice', region: 'korean',
    req: 'rice kimchi egg spring_onion gochujang soy_sauce sesame_oil', opt: 'sesame_seeds cheese tofu', staples: 'oil',
    blurb: 'Tangy, spicy, crispy-bottomed comfort.',
    steps: ['Fry chopped kimchi in oil.', 'Add day-old rice, gochujang and soy.', 'Press flat to crisp the bottom.', 'Top with a fried egg, spring onion and sesame oil.'],
  }),
  as({
    id: 'bulgogi-beef', name: 'Bulgogi Beef Bowl', region: 'korean',
    req: 'beef_sliced onion garlic soy_sauce sugar sesame_oil rice spring_onion mushroom', opt: 'carrot sesame_seeds capsicum spinach gochujang cabbage kimchi', staples: 'oil pepper',
    blurb: 'Sweet-savoury beef piled high on rice.',
    steps: ['Marinate beef in soy, sugar, garlic and sesame oil.', 'Stir-fry onion and mushroom.', 'Add beef; cook fast over high heat.', 'Serve on rice with spring onion.'],
  }),
  as({
    id: 'bibimbap', name: 'Bibimbap', region: 'korean',
    req: 'rice egg spinach carrot mushroom gochujang sesame_oil', opt: 'beef_mince beef_sliced spring_onion sesame_seeds kimchi tofu', staples: 'oil salt',
    blurb: 'A rainbow bowl you mix into happiness.',
    steps: ['Blanch spinach; season with sesame oil.', 'Sauté carrot and mushroom separately.', 'Arrange everything over rice.', 'Crown with a fried egg and gochujang. Mix!'],
  }),
  // Chinese
  as({
    id: 'egg-fried-rice', name: 'Egg Fried Rice', region: 'chinese',
    req: 'rice egg spring_onion soy_sauce sesame_oil', opt: 'bacon carrot peas corn garlic', staples: 'oil salt',
    blurb: 'Five minutes, one wok, total comfort.',
    steps: ['Scramble eggs in a hot wok; set aside.', 'Fry cold rice until it hops.', 'Add soy, then the eggs back in.', 'Finish with spring onion and sesame oil.'],
  }),
  as({
    id: 'pan-fried-dumplings', name: 'Pan-Fried Dumplings (Guotie)', region: 'chinese',
    req: 'gyoza soy_sauce sesame_oil spring_onion', opt: 'garlic chilli rice', staples: 'oil water',
    blurb: 'Crispy bottoms, juicy middles.',
    steps: ['Fry frozen dumplings flat-side down in oil.', 'Add a splash of water; cover and steam.', 'Uncover and crisp again.', 'Dip in soy, sesame oil and spring onion.'],
  }),
  as({
    id: 'tomato-egg-stir-fry', name: 'Tomato & Egg Stir-Fry', region: 'chinese',
    req: 'tomato egg spring_onion sugar', opt: 'garlic rice', staples: 'oil salt',
    blurb: 'Silky eggs in a sweet tomato sauce.',
    steps: ['Softly scramble eggs; set aside.', 'Cook tomato wedges until saucy.', 'Season with sugar and salt.', 'Fold eggs back in; top with spring onion.'],
  }),
  // Southeast Asian
  as({
    id: 'pad-see-ew', name: 'Pad See Ew (Thai)', region: 'southeast-asian',
    req: 'rice_noodles chicken egg soy_sauce oyster_sauce sugar garlic', opt: 'chilli carrot cabbage', staples: 'oil',
    blurb: 'Smoky wide noodles with a wok kiss.',
    steps: ['Stir-fry garlic and sliced chicken.', 'Push aside; scramble an egg.', 'Add noodles, soy, oyster sauce and sugar.', 'Toss hard until charred at the edges.'],
  }),
  as({
    id: 'nasi-goreng', name: 'Nasi Goreng (Indonesian)', region: 'southeast-asian',
    req: 'rice egg kecap_manis garlic onion chilli', opt: 'chicken spring_onion tomato', staples: 'oil salt',
    blurb: 'Sweet-soy fried rice with a sunny egg.',
    steps: ['Pound or chop garlic, onion and chilli.', 'Fry the paste until fragrant.', 'Add rice and kecap manis; toss.', 'Top with a fried egg.'],
  }),
  as({
    id: 'chicken-banh-mi', name: 'Chicken Bánh Mì (Vietnamese)', region: 'southeast-asian',
    req: 'bread chicken carrot kewpie_mayo chilli soy_sauce', opt: 'spring_onion herbs', staples: 'salt pepper oil',
    blurb: 'Crackly roll, zingy pickles, happy lunch.',
    steps: ['Marinate chicken in soy; pan-fry.', 'Quick-pickle carrot ribbons.', 'Slather the roll with Kewpie.', 'Stuff with chicken, carrot and chilli.'],
  }),
];

export const RECIPE_BY_ID: ReadonlyMap<string, Recipe> = new Map(RECIPES.map((x) => [x.id, x]));

export const REGION_LABEL: Record<Region, { flag: string; label: string }> = {
  japanese: { flag: '🇯🇵', label: 'Japanese' },
  korean: { flag: '🇰🇷', label: 'Korean' },
  chinese: { flag: '🇨🇳', label: 'Chinese' },
  'southeast-asian': { flag: '🌏', label: 'SE Asian' },
};
