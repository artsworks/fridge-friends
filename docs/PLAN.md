# Fridge Friends — Implementation Plan

A delight-first "what can I make tonight?" PoC. Static SPA: **Vite + React + TypeScript + `motion`** (motion.dev). No backend, no APIs — all data is local TS modules. The kitchen *is* the interface: FRIDGE / PANTRY / FREEZER zones full of living chibi ingredient characters; drag or tap them onto the KITCHEN BENCH; recipe cards re-rank live.

Working title is now locked: **Fridge Friends** (repo name: `fridge-friends`).

---

## 0. Locked decisions (read first)

| # | Decision | Why |
|---|----------|-----|
| D1 | Stack: Vite + React 18 + TS strict + `motion` (npm pkg `motion`, imports from `motion/react`) + plain CSS. No Tailwind, no state lib, no router. | Brief stack; single screen needs no router; `useReducer`+context covers state. |
| D2 | Drag = **`motion`'s built-in `drag` + pointer-up hit-test against the bench rect**. @dnd-kit is NOT installed. | One dep, springs/moods stay in the same animation system; hit-test is ~15 lines (`onDragEnd` → `info.point` inside `getBoundingClientRect()`). dnd-kit's transform model fights `layout` animations for zero benefit at this scale. |
| D3 | Staples = **`salt`, `pepper`, `water`, `oil`** only. Flour & sugar are *stocked pantry items*, not assumed. | Tight exemption keeps matching honest (SuperCook parity) and makes pantry stocking meaningful. |
| D4 | Corpus = **20 recipes: 8 Australian / 12 Asian; 55-entry ingredient registry (51 stockable + 4 staples)**. | Deliberate overlap: 38/51 stockable items appear in ≥2 recipes so matches cascade. |
| D5 | Optional ingredients never count as missing; they render as neutral "nice to have" chips. | Prevents topping/garnish items from blocking "can make now". |
| D6 | Assets = parameterized SVG React components (react-kawaii architecture): one `KawaiiFace` + a body-path data registry. No raster ships. | Consistency is structural, assets are ~1 KB each, animate natively. |
| D7 | Persistence = **yes**, versioned localStorage (`fridge-friends:v1`). | 15 lines, high perceived-product value. |
| D8 | Sound = **skip for PoC**. | Visual juice carries the PoC; avoids autoplay-policy plumbing. Revisit later. |
| D9 | Recipe detail = **minimal modal included** (name, dish asset, have/missing lists, 3–5 steps). | Steps data already exists; a card that does nothing on tap feels broken. |
| D10 | Mobile = tap-to-add is the primary gesture; drag still works via pointer events. | Motion `drag` handles touch; tap is more reliable on small screens. |
| D11 | Keyboard a11y in scope: every chip is a real `<button>`; Enter/Space adds to bench. | Drag is an enhancement, never the only path. |
| D12 | Tests = Vitest on the match engine only. | Scoring is the only pure logic worth pinning; UI stays manual-QA. |
| D13 | `canvas-confetti` for full-match celebration. | Tiny, purpose-built; CSS confetti is a false economy. |

---

## 1. Final corpus

### 1.1 Canonical ingredient registry (55)

`zone` = where the item lives. `cat` = category (`protein`, `dairy`, `produce`, `frozen`, `dry`, `condiment`, `staple`). Staples are never stocked in zones; they render in the staples ribbon.

**Fridge (20)**

| id | name | cat | aliases |
|---|---|---|---|
| `egg` | Egg | protein | eggs, hen egg |
| `chicken` | Chicken | protein | chicken breast, chicken thigh, chicken pieces, chicken drumstick |
| `beef_mince` | Beef Mince | protein | ground beef, minced beef, beef mince |
| `beef_sliced` | Beef Slices | protein | sliced beef, thin beef, beef strips, bulgogi beef, shaved beef |
| `steak` | Steak | protein | beef steak, sirloin, scotch fillet |
| `bacon` | Bacon | protein | bacon rashers, streaky bacon, shortcut bacon |
| `tofu` | Tofu | protein | bean curd, firm tofu |
| `cheese` | Cheese | dairy | mozzarella, cheddar, shredded cheese, tasty cheese, parmesan |
| `milk` | Milk | dairy | full cream milk |
| `butter` | Butter | dairy | unsalted butter |
| `spring_onion` | Spring Onion | produce | scallion, green onion, shallots (au) |
| `carrot` | Carrot | produce | carrots |
| `capsicum` | Capsicum | produce | bell pepper, red pepper |
| `tomato` | Tomato | produce | fresh tomato, tomatoes |
| `spinach` | Spinach | produce | baby spinach, spinach leaves |
| `mushroom` | Mushroom | produce | mushrooms, button mushrooms, shiitake |
| `cabbage` | Cabbage | produce | green cabbage, wombok, napa cabbage |
| `ginger` | Ginger | produce | fresh ginger |
| `kimchi` | Kimchi | produce | kimchee, napa kimchi |
| `lemon` | Lemon | produce | lemons |

**Pantry (26)**

| id | name | cat | aliases |
|---|---|---|---|
| `rice` | Rice | dry | steamed rice, cooked rice, jasmine rice, short grain rice |
| `spaghetti` | Spaghetti | dry | pasta, spaghetti pasta |
| `flour` | Flour | dry | plain flour, all purpose flour |
| `panko` | Panko | dry | panko breadcrumbs, breadcrumbs |
| `bread` | Bread | dry | bread roll, burger bun, white bread |
| `tuna` | Canned Tuna | protein | tinned tuna, tuna can, canned tuna in oil |
| `nori` | Nori | dry | seaweed, roasted seaweed, nori sheet |
| `dashi` | Dashi Stock | dry | dashi powder, dashi granules, japanese stock |
| `curry_roux` | Curry Roux | dry | japanese curry, curry blocks, golden curry |
| `sugar` | Sugar | dry | white sugar, caster sugar |
| `soy_sauce` | Soy Sauce | condiment | shoyu, light soy |
| `mirin` | Mirin | condiment | sweet rice wine, mirin seasoning |
| `sake` | Sake | condiment | cooking sake, rice wine |
| `miso_paste` | Miso Paste | condiment | miso, white miso, shiro miso |
| `gochujang` | Gochujang | condiment | korean chilli paste, gochu jang |
| `sesame_oil` | Sesame Oil | condiment | toasted sesame oil |
| `sesame_seeds` | Sesame Seeds | condiment | toasted sesame, sesame |
| `kewpie_mayo` | Kewpie Mayo | condiment | japanese mayonnaise, kewpie, mayo |
| `okonomi_sauce` | Okonomi Sauce | condiment | okonomiyaki sauce, tonkatsu sauce |
| `ketchup` | Tomato Ketchup | condiment | tomato sauce, ketchup |
| `passata` | Passata | condiment | tomato passata, crushed tomatoes, tomato puree |
| `herbs` | Mixed Herbs | condiment | parsley, mixed herbs, dried herbs, italian herbs |
| `onion` | Onion | produce | brown onion, yellow onion, onions |
| `garlic` | Garlic | produce | garlic cloves, garlic bulb |
| `potato` | Potato | produce | potatoes, russet potato |
| `pumpkin` | Pumpkin | produce | butternut pumpkin, kent pumpkin, squash |

**Freezer (5)**

| id | name | cat | aliases |
|---|---|---|---|
| `peas` | Frozen Peas | frozen | peas, green peas, garden peas |
| `corn` | Corn Kernels | frozen | frozen corn, sweet corn |
| `gyoza` | Frozen Gyoza | frozen | dumplings, frozen dumplings, potstickers |
| `puff_pastry` | Puff Pastry | frozen | pastry sheets, puff pastry sheets |
| `chips` | Frozen Chips | frozen | fries, french fries, frozen fries |

**Staples (assumed — ribbon only, exempt from matching)**

| id | name | cat |
|---|---|---|
| `salt` | Salt | staple |
| `pepper` | Pepper | staple |
| `water` | Water | staple |
| `oil` | Oil | staple |

### 1.2 Recipe corpus (20)

Ingredients listed as `req` (required, non-staple) / `opt` (optional — never counted missing). Staples per recipe are implicit (salt/pepper/oil/water as sensible).

**Australian (8)**

| id | name | req | opt |
|---|---|---|---|
| `spaghetti-bolognese` | Spaghetti Bolognese | spaghetti, beef_mince, onion, garlic, carrot, passata, herbs | cheese |
| `chicken-parmigiana` | Chicken Parmigiana | chicken, panko, flour, egg, passata, cheese | herbs |
| `sausage-rolls` | Sausage Rolls | puff_pastry, beef_mince, onion, egg, ketchup | herbs |
| `shepherds-pie` | Shepherd's Pie | beef_mince, onion, carrot, peas, potato, butter, milk, herbs | cheese |
| `roast-chicken-veg` | Roast Chicken & Veg | chicken, potato, carrot, pumpkin, onion, garlic, lemon, herbs | peas |
| `steak-and-chips` | Steak & Chips | steak, chips, butter, garlic | lemon, herbs |
| `bacon-egg-roll` | Bacon & Egg Roll | bread, bacon, egg, cheese, ketchup, butter | tomato |
| `frittata` | Loaded Frittata | egg, potato, onion, capsicum, tomato, mushroom, spinach, cheese | bacon, corn, herbs |

**Asian (12)**

| id | name | req | opt |
|---|---|---|---|
| `egg-fried-rice` | Egg Fried Rice | rice, egg, spring_onion, carrot, peas, corn, garlic, soy_sauce, sesame_oil | bacon |
| `kimchi-fried-rice` | Kimchi Fried Rice | rice, kimchi, egg, spring_onion, gochujang, soy_sauce, sesame_oil | sesame_seeds, cheese, tofu |
| `teriyaki-chicken` | Teriyaki Chicken | chicken, soy_sauce, mirin, sugar, ginger, garlic, rice | spring_onion, sesame_seeds, sake |
| `gyudon` | Gyudon (Beef Bowl) | beef_sliced, onion, dashi, soy_sauce, mirin, sake, sugar, ginger, rice | egg, spring_onion, cabbage |
| `omurice` | Omurice | rice, egg, chicken, onion, ketchup, butter | peas, corn, spring_onion |
| `okonomiyaki` | Okonomiyaki | cabbage, flour, egg, dashi, bacon, okonomi_sauce, kewpie_mayo, spring_onion | nori, corn |
| `tamagoyaki` | Tamagoyaki | egg, dashi, soy_sauce, sugar, mirin | nori |
| `onigiri` | Tuna Mayo Onigiri | rice, nori, tuna, kewpie_mayo | sesame_seeds |
| `miso-soup` | Miso Soup | dashi, miso_paste, tofu, spring_onion | spinach, mushroom |
| `chicken-katsu-curry` | Chicken Katsu Curry | chicken, panko, flour, egg, curry_roux, potato, carrot, onion, rice | spring_onion |
| `pan-fried-gyoza` | Pan-Fried Gyoza | gyoza, soy_sauce, sesame_oil, spring_onion | garlic, rice |
| `bulgogi-beef` | Bulgogi Beef Bowl | beef_sliced, onion, garlic, soy_sauce, sugar, sesame_oil, rice, spring_onion, sesame_seeds, carrot, mushroom | capsicum, spinach, gochujang, cabbage, kimchi |

### 1.3 Coverage logic — why this corpus cascades

Frequency (required uses, not counting optional):

- **Core (≥5 recipes)**: egg 10 · onion 9 · rice 8 · soy_sauce 7 · garlic 7 · spring_onion 8 · carrot 6
- **Hubs (3–4)**: chicken 5 · potato 5 · butter 4 · dashi 4 · sugar 4 · sesame_oil 4 · peas 4 · beef_mince 3 · flour 3 · herbs 3 · ketchup 3 · cheese 3 · ginger 3 · mirin 3
- **Bridge (2)**: beef_sliced, bacon, mushroom, passata, panko, kewpie_mayo, milk(1→see below), …
- **Rare (1 required use)**: steak, tuna, gyoza, corn, cabbage, pumpkin, lemon, kimchi, nori, spaghetti, bread, puff_pastry, chips, curry_roux, sake, miso_paste, gochujang, sesame_seeds, okonomi_sauce, milk, capsicum, tomato, spinach

The rare tail is *intentional*: the IDF-weighted coverage (§2) makes grabbing kimchi or curry_roux do visible work, and every rare item still has ≥1 recipe so no asset is dead. Opt-outlets (bulgogi/kimchi-rice absorb kimchi, gochujang, tofu, spinach…) give rare items a second job as bonuses without gatekeeping matches.

---

## 2. Data model & matching engine

### 2.1 Types (`src/lib/types.ts`)

```ts
export type Zone = 'fridge' | 'pantry' | 'freezer';
export type Category = 'protein' | 'dairy' | 'produce' | 'frozen' | 'dry' | 'condiment' | 'staple';
export type Mood = 'idle' | 'happy' | 'excited' | 'bliss' | 'sleepy' | 'frost' | 'shock';

export interface Ingredient {
  id: string;            // canonical snake_case id
  name: string;
  cat: Category;
  zone: Zone;            // staples: 'pantry' (never rendered as a zone chip)
  aliases: string[];
  staple?: boolean;
  shelfAsset?: string;   // optional body-variant id for in-zone display (§3.4)
}

export interface RecipeIngredient { id: string; optional?: boolean }
export interface Recipe {
  id: string;
  name: string;
  cuisine: 'australian' | 'asian';
  ingredients: RecipeIngredient[];   // staples included where sensible; excluded from scoring
  blurb: string;                     // one cute line on the card
  steps: string[];                   // 3–5 short steps for the modal
  dishAsset: string;                 // key into dishes.ts
}

export type Bucket = 'now' | 'almost' | 'later';
export interface RankedRecipe {
  recipe: Recipe;
  coverage: number;        // 0..1 IDF-weighted coverage of required non-staple ids
  have: string[];          // matched required ids
  missing: string[];       // unmatched required ids (staples excluded)
  missingOptional: string[];
  bucket: Bucket;
}
```

### 2.2 Scoring (`src/lib/match.ts`) — refinement of brief §3

The brief's "coverage + missing-count + rare bonus" is folded into one principled score: **IDF-weighted coverage**. Document frequency `df(id)` counts recipes that *require* the ingredient (optional doesn't count — rare condiments keep their weight).

```ts
const N = RECIPES.length;                                   // 20
const df = new Map<string, number>();                       // required-use counts
const idf = (id: string) => Math.log(1 + N / (df.get(id) ?? N)); // unseen ids ~ 0 weight

export function rank(selected: Set<string>): RankedRecipe[] {
  return RECIPES.map(r => {
    const req  = r.ingredients.filter(i => !i.optional && !STAPLE_IDS.has(i.id)).map(i => i.id);
    const opt  = r.ingredients.filter(i =>  i.optional && !STAPLE_IDS.has(i.id)).map(i => i.id);
    const have = req.filter(id =>  selected.has(id));
    const miss = req.filter(id => !selected.has(id));
    const w    = req.reduce((s, id) => s + idf(id), 0);
    const wh   = have.reduce((s, id) => s + idf(id), 0);
    return { recipe: r, have, missing: miss,
             missingOptional: opt.filter(id => !selected.has(id)),
             coverage: w ? wh / w : 0,
             bucket: miss.length === 0 ? 'now' : miss.length <= 2 ? 'almost' : 'later' };
  }).sort((a, b) =>
    BUCKET_ORDER[a.bucket] - BUCKET_ORDER[b.bucket] ||
    b.coverage - a.coverage ||
    a.missing.length - b.missing.length ||
    a.recipe.name.localeCompare(b.recipe.name));
}
```

- `missing` chips on a card sort by IDF desc (most distinctive gap first).
- Rank #1 overall gets a "chef's pick" badge when selection is non-empty.
- Empty selection → rail shows a friendly empty state, not 20 collapsed cards.

**Worked example** — bench = `{rice, egg, spring_onion, kimchi, soy_sauce, sesame_oil}`:
- `kimchi-fried-rice`: missing `{gochujang}` → `almost`, coverage ≈ 0.86 → ranks **#1** (kimchi's IDF is max).
- `egg-fried-rice`: missing `{carrot, peas, corn, garlic}` → `later`.
- Plain "rice + egg" set (common items only) ranks egg-fried-rice but *not* above kimchi-fried-rice here — the rare-ingredient preference the brief wanted, for free.

**Vitest cases (M2 gate):** empty set → all `later`; full pantry → all `now` & coverage 1; staples never in `missing`; optional ids never in `missing`; the kimchi example above; alias map resolves `chicken breast` → `chicken`.

---

## 3. Asset system spec

### 3.1 Design tokens (`src/theme/tokens.ts`)

```ts
export const STROKE = { w: 3.5, color: '#3A2E2A', linecap: 'round', linejoin: 'round' } as const;
// Fills — pastel family, one warm accent. All bodies use these keys, never raw hex.
export const FILL = {
  cream:'#FFF6E9', rice:'#FFFDF6', eggwhite:'#FFF9EE', yolk:'#FFC93C',
  pink:'#FFC9D1', blush:'#F9A8B8', coral:'#FF8A5C',           // coral = single warm accent
  meat:'#F4A6AC', salmon:'#F7B8A0', steak:'#EF9B8F',
  leaf:'#9BD3A0', leafDark:'#6FBF78', carrot:'#F9A65B', pumpkin:'#F2994A',
  tomato:'#F97B7B', cabbage:'#C9E8B8', capsicum:'#F98D7C', spinach:'#7FC98B',
  cheese:'#FFD97D', milk:'#F4F9FF', butter:'#FFE9A8',
  bottle:'#C9B6A4', soy:'#6B4F3F', nori:'#4E6B57', miso:'#E8D9B8',
  freezer:'#D9EDF7', frost:'#BFE0F0', pastry:'#F5D9A8', dish:'#FFFFFF',
} as const;
export const FACE = { eye:'#3A2E2A', blush:'#F9A8B8', sparkle:'#FFD97D' } as const;
```

Canvas: **96×96 viewBox** for everything (dishes too). Light direction top-left: optional 12–18%-opacity white highlight ellipse upper-left on large fills.

### 3.2 Component API

```tsx
<KawaiiFood id="egg" mood="excited" size={64} />           // ingredient body + face
<KawaiiDish id="omurice" size={120} />                     // dish asset (rail + modal)
<KawaiiFace mood="bliss" />                                // internal shared component
```

`KawaiiFood` = `<svg viewBox="0 0 96 96">` → body paths from registry → `<KawaiiFace>` positioned at the body's `face` anchor (`{x,y,s}` = center + scale). `size` sets outer width/height; stroke scales naturally inside the viewBox.

### 3.3 Mood map — `KawaiiFace` variants

| mood | eyes | mouth | blush | use |
|---|---|---|---|---|
| `idle` | dots | small smile | normal | zone shelf default (fridge/pantry) |
| `happy` | dots | open smile | normal | hover/tap in zone |
| `excited` | sparkle/stars | open smile | stronger | whileDrag, celebration |
| `bliss` | closed `∪∪` | `w` smile | normal | on the bench |
| `sleepy` | closed `−−` | tiny `o` | normal | pantry idle alternate |
| `frost` | closed `><` | wavy | blue-tinted | freezer dwell |
| `shock` | dots | `o` | none | invalid drop / bench-removal beat |

Blink is separate: a 4–7 s randomized `scaleY(0.1)` eye keyframe overlaid on `idle`/`happy` so characters feel alive without mood churn.

### 3.4 Registry format (`src/assets/bodies.ts`)

Data, not components — each entry is terse path data so all ~51 bodies share one render path:

```ts
export interface BodySpec {
  paths: { d: string; fill: keyof typeof FILL }[];  // ≤3 fills + ≤4 detail strokes
  face: { x: number; y: number; s: number };        // anchor, 0..96 space
  shelf?: BodySpec;                                  // optional in-zone variant
}
export const BODIES: Record<string, BodySpec> = {
  egg:      { paths:[{d:'M48 14c16 0 26 17 26 36 0 22-12 34-26 34S22 72 22 50c0-19 10-36 26-36z', fill:'eggwhite'}], face:{x:48,y:56,s:1} },
  soy_sauce:{ paths:[{d:'M38 10h20v12H38z',fill:'coral'},{d:'M30 30c0-6 8-10 18-10s18 4 18 10v46c0 6-8 10-18 10s-18-4-18-10V30z',fill:'bottle'}], face:{x:48,y:60,s:.9} },
  // ...
};
```

**Body variants** (the brief's `shelf` question): only 4 items justify a different in-zone silhouette — `egg` → egg-carton on the fridge shelf / single egg elsewhere; `peas`, `corn`, `chips`, `gyoza` → branded freezer bags in-zone / loose items on bench. Everything else: one body. `KawaiiFood` picks `shelf` when rendered inside a zone.

### 3.5 Per-asset drawing strategy

Group the 51 bodies into 6 shape-families so authoring stays mechanical and consistent:

| family | members | construction |
|---|---|---|
| blob produce | egg, tomato, onion, garlic, lemon, potato, pumpkin | single rounded blob + stem/leaves (≤2 extra paths) |
| leafy veg | carrot, capsicum, spinach, cabbage, mushroom, spring_onion, ginger, kimchi* | tapered/rounded body + leaf caps; kimchi = jar w/ red contents |
| cuts/protein | chicken(drumstick silhouette), beef_mince(scoop mound), beef_sliced(stacked sheets), steak, bacon(2 wavy strips), tuna(can), tofu(cube) | rounded slab + 1–2 marbling detail strokes |
| dairy | cheese(wedge w/ holes), milk(carton), butter(block + wrapper flap) | rounded rect family + fold lines |
| bottles/jars | soy_sauce, mirin, sake, kewpie_mayo, ketchup, okonomi_sauce, gochujang, miso_paste, passata, curry_roux(box), dashi(box), herbs(jar) | rounded rect + cap/label band (1–2 detail lines) |
| pantry/frozen packs | rice(sack), spaghetti(bundle in band), flour(bag), panko(box), bread(loaf or roll), nori(pack w/ sheet), sugar(bag), + the 4 freezer bags | trapezoid/bundle + crimp or tie mark |

**20 dish assets** (`dishes.ts`): uniform formula — plate/bowl ellipse (`dish` fill) + food mound + 2–3 garnish details + face on the mound; soups/noodle-adjacent add 2 steam wisps (animated `y`/`opacity` loop). Same 96 viewBox, slightly larger face scale allowed.

Authoring QA: a dev-only `/assets` route (M6) renders the full grid for a one-look consistency check — stroke weight, face anchor, palette discipline.

---

## 4. Interaction spec

### 4.1 Zones
- Each zone is a cabinet card: **Fridge** (cool `#D9EDF7`, door rotates open on a hinge `transform-origin`, interior glow), **Pantry** (warm wood `#F5D9A8` shelf, lazy bob idle), **Freezer** (frosted glass slides up, frost particles, dwell mood `frost`).
- One zone open at a time (all breakpoints — keeps the single-screen scan clean). Click/hover header toggles; opening another auto-closes the first (`AnimatePresence`).
- Inside: grid of `IngredientChip`s in authored registry order.

### 4.2 Getting items to the bench
- **Drag** (`motion` drag, `dragElastic={0.15}`, `whileDrag={{scale:1.12, rotate:4}}`, mood→`excited`): `onDragEnd` → `info.point` inside bench `getBoundingClientRect()` → add + land; else spring back with `shock` 300 ms → `idle`.
- **Tap/click** (primary on touch, keyboard for a11y): chip jumps to bench via keyframe arc — `x/y` tween to its bench slot through `y:-48` apex, then squash-and-stretch on landing (`scaleY 1→0.72→1.08→1`, ~380 ms spring), mood→`bliss`.
- Chips in zones are `<button>`s — Enter/Space = same toss. `aria-label="Add {name} to bench"`.
- Bench item click → arcs back home, brief `shock`→`happy`. Bench chips get a small `×` affordance on hover/focus.

### 4.3 Recipe rail
- `RecipeCard`s in one `<motion.ul layout>`; each card `layout` + `AnimatePresence` → live reorder as coverage changes (spring `stiffness 350 damping 30`).
- Card contents: dish asset, name, **match ring** (SVG circle, `stroke-dashoffset` tweened to `coverage`), `%` label, missing-required chips (coral) + missing-optional chips (neutral, "nice"), and for `now` a subtle glow.
- Buckets: `now` and `almost` expanded; `later` collapsed behind a "N more ideas" accordion (auto-expands first item only if nothing above).
- **Full-match celebration**: when a recipe's bucket *enters* `now` (diff prev/next rank by id): one `canvas-confetti` burst (~120 particles, brand palette), card pulse, all bench chips hop once in `excited` for ~1.5 s. Track celebrated ids per bench composition — re-celebrate only on a genuinely new entry.
- **Staples ribbon**: thin strip under the bench — tiny salt/pepper/water/oil kawaii icons + label "assumed in your kitchen" (tooltip explains the exemption).

### 4.4 Ambient life & accessibility
- Idle blink (§3.3), breathing `scale 1±0.015` 3 s loop on shelf items, freezer shiver, fridge light when open.
- `useReducedMotion()` → kill confetti, squash, bobbing; keep fades/opacity.
- State: `KitchenState = { bench: string[], openZone: Zone|null, celebrated: string[] }` in `useReducer` + context; persisted to `localStorage["fridge-friends:v1"]` (versioned; unknown ids dropped on load).

---

## 5. Layout — single screen, desktop-first

```
┌──────────────────────────────────────────────────────────────────┐
│  Fridge Friends 🍳            what can i make tonight?            │ header ~64px
├────────────────────────────────────────────┬─────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  RECIPE RAIL (scroll)│
│  │  FRIDGE  │  │  PANTRY  │  │ FREEZER  │  │  ┌────────────────┐  │
│  │ (open:   │  │          │  │          │  │  │★ Chef's pick   │  │
│  │  chips…) │  │          │  │          │  │  │ dish face ring │  │
│  └──────────┘  └──────────┘  └──────────┘  │  │ missing chips  │  │
│                                            │  └────────────────┘  │
│   KITCHEN BENCH  (drop zone / staging)     │  …cards live-reorder │
│  ┌──────────────────────────────────────┐  │                     │
│  │  🍳 😊  🍚 😊  🥕 😊   + empty slots  │  │  ▾ N more ideas     │
│  └──────────────────────────────────────┘  │                     │
│   assumed: 🧂 🌶 💧 🫗  (staples ribbon)   │                     │
└────────────────────────────────────────────┴─────────────────────┘
```

- Desktop ≥1024 px: rail = fixed right column (~360 px, independent scroll). Zones row across the top of the kitchen pane; bench spans the bottom; the whole screen fits 100 vh without page scroll (rail scrolls internally).
- Tablet/mobile <1024 px: single column — zones become an accordion strip (one open), then bench, then rail as a horizontal snap-scroll card strip under the bench (bench stays visible while scrolling rail). Tap-to-add is the hero gesture here.
- Bench accepts ~10 chips before internal horizontal scroll; chips wrap on wide screens.

---

## 6. Project structure, gates, milestones

### 6.1 File tree

```
fridge-friends/
  index.html
  package.json  tsconfig.json  vite.config.ts  eslint.config.js
  src/
    main.tsx  App.tsx
    theme/tokens.ts
    lib/types.ts  lib/match.ts  lib/match.test.ts  lib/persist.ts
    data/ingredients.ts  data/recipes.ts  data/staples.ts
    state/KitchenContext.tsx            // useReducer + context (D1)
    assets/KawaiiFace.tsx  assets/KawaiiFood.tsx  assets/KawaiiDish.tsx
    assets/bodies.ts  assets/dishes.ts
    components/ZoneCabinet.tsx          // variant: fridge|pantry|freezer
    components/IngredientChip.tsx
    components/Bench.tsx  components/BenchChip.tsx
    components/RecipeRail.tsx  components/RecipeCard.tsx  components/MatchRing.tsx
    components/StaplesRibbon.tsx  components/Celebration.tsx
    components/RecipeModal.tsx          // minimal (D9)
    components/AssetGallery.tsx         // dev-only /assets QA grid
    styles/global.css
```

Deps: `react`, `react-dom`, `motion`, `canvas-confetti`; dev: `vite`, `typescript`, `eslint` + `typescript-eslint` flat config, `vitest`, `@types/*`. That's the entire dep list — do not add more.

### 6.2 Quality gates (run before every milestone sign-off)

`npm run typecheck` (`tsc --noEmit`) · `npm run lint` · `npm run test` (vitest) · `npm run build`. Dev server: `npm run dev`.

### 6.3 Milestone sequence

1. **M1 — Scaffold & face**: vite+TS+eslint+`motion`; tokens; `KawaiiFace` renders all 7 moods on the demo screen. *Gate: build clean.*
2. **M2 — Corpus & engine**: `data/*`, `match.ts`, vitest cases (incl. §2.2 worked example). *Gate: tests green.*
3. **M3 — Zones & bench (no drag)**: cabinets open/close, tap-to-toss + keyboard add/remove, localStorage. *Gate: manual QA + reload persistence.*
4. **M4 — Motion & moods**: drag + bench hit-test + squash/stretch + mood transitions + frost/shiver + reduced-motion. *Gate: drag works desktop + touch emulation.*
5. **M5 — Recipe rail**: live rank, layout reorder, match ring, bucket accordion, chef's pick, celebration, modal, staples ribbon. *Gate: §2.2 example reproduces visually.*
6. **M6 — Full asset pass**: 51 bodies (+4 shelf variants) + 20 dishes + 4 staple icons; `/assets` QA grid; fix anchors/palette until consistent. *Bulk of remaining time.*
7. **M7 — Polish & ship**: mobile layout pass, a11y sweep (focus order, labels, reduced motion), README, final `typecheck+lint+test+build`.

---

## 7. Brief §7 open questions — all decided

| Q | Decision | One-liner |
|---|---|---|
| Mobile drag in scope? | Tap-to-add is primary; `motion` drag still works via pointer events. | Drag ships free; tap is the reliable small-screen path (D10). |
| localStorage persistence? | In scope, `fridge-friends:v1`. | Trivial cost, big product feel (D7). |
| Keyboard alternative? | Yes — real `<button>` chips, Enter/Space adds, focus-visible styling. | Drag is never the only path (D11). |
| Sound? | Skip for PoC. | Autoplay plumbing not worth it now (D8). |
| Recipe detail? | Minimal modal (asset, have/missing, 3–5 steps). | Steps data exists anyway; dead-end cards feel broken (D9). |
| Name? | **Fridge Friends** (`fridge-friends`). | Alliterative, cute, covers all three zones loosely, domain-clear. |

---

## 8. Amendment (v2): Three.js characters — explore 3D-like chibi rendering

**Change requested by the user (2026-09-30):** explore Three.js so the ingredient characters read as squishy *3D-like* chibi characters, not flat stickers — while keeping the moodboard's cuteness language (thick outline, pastel fills, dot-eye + tiny-smile + blush faces).

| # | Decision | Why |
|---|----------|-----|
| D14 | Character rendering is a **two-track build**: `KawaiiFood` (SVG, §3) ships regardless as the shelf/fallback renderer; `PlushFriend` (Three.js) is explored for hero moments. | WebGL context caps (~8–16/page) forbid ~60 per-chip canvases, and SVG already covers a11y/reduced-motion/failure paths. |
| D15 | Three.js via **`@react-three/fiber` + `@react-three/drei`** (adds to dep list — supersedes §6.1 "no additions"). | R3F is the React-idiomatic three layer; drei gives `Html`, soft shadows, `MeshToonMaterial`-adjacent helpers. |

### 8.1 Where 3D is allowed (context budget)

Browsers cap live WebGL contexts (~8–16). Budget: **≤ 8 canvases**.

- **Recommended hybrid (primary exploration):** zones keep SVG shelf chips; the moment a chip is dragged or lands on the bench it becomes a `PlushFriend` — bench items (≤ ~10 expected; cap display if more) each get one small R3F `<Canvas>` (~96–120 px). Dragging swaps shelf-SVG → floating 3D plush under the pointer. Fallback if context-starved or WebGL unavailable: SVG everywhere (D6 unaffected).
- **Alternative (if hybrid feels wrong):** ONE fullscreen `<Canvas>` behind the kitchen pane; 3D characters anchored to DOM rects via `drei/Html` projection. Fewer canvases but a harder layout-sync problem — only take this path if the hybrid underdelivers.
- Rail cards, staples ribbon, modal art: always SVG (`KawaiiDish` etc.) — 3D is for the living characters, not chrome.

### 8.2 `PlushFriend` look spec — keep the moodboard language

- **Body**: one squashed sphere/capsule (`SphereGeometry` scaled, or `CapsuleGeometry`) per ingredient + 1–2 attachment meshes (leaves, wrapper, cap) — the same 6 shape-families as §3.5 drive silhouette; recognizability from shape+palette, faces carry the cute.
- **Material**: `MeshToonMaterial` or lambert-style flat shading in §3.1 `FILL` colors; **outline via inverted-hull** (back-face scaled shell in `#3A2E2A`) to preserve the thick-outline look — non-negotiable, it's the moodboard's signature.
- **Face**: canvas-generated texture decal (`CanvasTexture`) OR small dark meshes floating ~1 mm off the surface; same 7-mood vocabulary as `KawaiiFace` (share the mood union). Blush = pink oval decals.
- **Squash & stretch is the whole point**: spring scale on land (`scale.y 1→0.72→1.08→1`), tilt with drag velocity (`rotation.z` ∝ `vx`), `motion` springs or `@react-spring/three` (only add if needed — `motion` can drive R3F props via `useFrame` reads).
- **Lighting**: hemisphere + one soft directional; no environment maps — flat & cute, not realistic.
- Idle: gentle breathing `scale ±0.015` + blink (eye-scale pulse) to mirror §3.3.

### 8.3 Acceptance for the 3D track (else ship SVG-only)

1. A `PlushFriend` of 4–5 representative foods (egg, carrot, soy_sauce, cheese wedge, gyoza) must look **as cute as the moodboard** — thick outline, blush, soft pastel toon shading. Screenshot A/B vs the SVG version in the report.
2. ~12 live 3D chips (bench full) at 60 fps on this VM's Chrome; graceful degradation to SVG when `WebGL2` unavailable or context count exceeded.
3. `useReducedMotion()` flattens to static pose (no squash/breathing).
4. If any of 1–3 fails: keep SVG-only, record the exploration + screenshots in the report (exploration outcome is still a deliverable).

### 8.4 Milestone impact

- New **M5b — PlushFriend exploration** between M5 and M6: spike `PlushFriend` for the 5 acceptance foods + hybrid swap (shelf-SVG → bench-3D) + the 8.3 checks. *Gate: 8.3 verdict recorded.*
- M6 scope unchanged (full SVG body set) — SVG is needed either way as shelf/fallback art.
- New deps allowed: `@react-three/fiber`, `@react-three/drei`, `three` (+ `@types/three`).
