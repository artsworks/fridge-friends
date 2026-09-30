# Research Brief — Kawaii Kitchen (working title)

Ingredient-inventory → recipe-suggestion web app with a cute chibi/kawaii food aesthetic and a
playful "kitchen bench" interaction metaphor. This document is the research input for the
implementation plan.

## 1. Product concept

The user owns what SuperCook/MyFridgeFood do badly as a product moment: they are utilitarian
index pages. Both "stop at the same point: a list, not a decision" (Pann, 2026). Our wedge is
**delight-first**: the kitchen itself is the interface — a fridge, pantry, and freezer you
open, full of little alive ingredient characters. Pulling ingredients onto the bench updates
recipe suggestions live; the app answers "what can I make tonight?" with personality.

Target PoC: single-page static web app, ~20 curated recipes, ~40–60 ingredients, no backend.

## 2. Competitive UX scan

### SuperCook (the pattern to beat)
- **Staples assumption**: "The only ingredients we assume you have are salt, pepper and water."
  A staples/ignore-basics toggle keeps results honest.
- **Ingredient picker**: expandable category groups (Pantry Essentials ~40, Vegetables & Greens
  ~100, Dairy, Proteins, Spices, Mushrooms...). Each ingredient is a toggle chip that highlights
  when selected. Search-as-you-type across all categories.
- **Results**: "You can make N recipes with your ingredients", ranked by ingredient coverage;
  filters for meal type, key ingredient, excluded ingredients, cuisine, diet, max ingredient
  count, cook/prep time, and "1 missing ingredient" suggestions (deliberately shows recipes one
  item short — a shopping nudge).
- **Matching**: canonical normalization links variants ("chicken" ≈ "chicken breast" ≈
  "boneless skinless chicken breast").

### MyFridgeFood
- Checkbox grid of common ingredients → recipes. Radically simple, no account. Proof that the
  zero-setup instant-gratification loop is the core value.

### RecipeRadar (open-source prior art)
- Treats recipe search as an information-retrieval problem: tokenize ingredient lines, index,
  score by relevance, weigh missing ingredients. Useful scoring prior art.

### Spoonacular `findByIngredients` (API precedent)
- `ranking`: maximize used ingredients (1) vs minimize missing ingredients (2);
  `ignorePantry: true` drops water/salt/flour. Confirms the two-knob scoring model:
  coverage + missing-count with a pantry exemption list. **Do not use the API** for the PoC —
  a curated local dataset gives full control and zero key/latency dependency.

## 3. Matching engine — PoC design

Data model (all local JSON/TS, no backend):

- `Ingredient { id, name, category, defaultLocation: fridge|pantry|freezer, aliases[] }`
- `Recipe { id, name, cuisine: australian|asian, ingredients: [{ingredientId, required, staple}], steps, dishAsset }`
- `Staple` flag or a global `STAPLE_IDS` set (salt, pepper, water, oil, sugar, flour?) —
  exempt from matching; shown as "assumed".

Scoring, per recipe:
1. `haveCount` = required ingredient ids present in the selected set (via canonical ids +
   alias resolution).
2. `missing[]` = required ids absent, excluding staples.
3. Rank: `missing.length` asc → `coverage` desc → prefer recipes using rare selected
   ingredients (small TF-IDF-style bonus so picking kimchi + rice surfaces kimchi fried rice
   over plain rice dishes).
4. Buckets for UI: **Can make now** (missing = 0), **Almost there** (missing ≤ 2, show the
   missing item chips — drives the "one more thing" loop), **Missing 3+** (collapsed).

Plurals/synonyms handled by alias lists on canonical ids; no stemming needed at this corpus
size.

## 4. Recipe corpus — 20 seeded recipes (planner to finalize)

Chosen for a heavily overlapping ingredient pool so matches cascade as items are added.

**Australian (~10):** spaghetti bolognese, chicken parmigiana, meat pie / sausage rolls,
shepherd's pie, roast chicken + veg, lamb chops + minted peas, steak & chips, bacon & egg
roll, frittata, pavlova (or garlic-butter prawns).

**Asian (~10):** egg fried rice, kimchi fried rice, teriyaki chicken, gyudon (beef bowl),
omurice, okonomiyaki, tamagoyaki, onigiri, miso soup, chicken katsu curry, gyoza, bulgogi +
rice (12 is fine — trim to balance).

**Shared ingredient pool (~45):** rice, eggs, chicken (breast/thigh), beef mince, lamb chops,
steak, bacon, onion, garlic, spring onion, carrot, potato, peas, corn, cabbage, mushrooms,
capsicum, tomato, spinach, cheese, milk, butter, cream, flour, panko breadcrumbs, bread,
pastry, soy sauce, mirin, dashi stock, miso paste, kimchi, nori, sesame oil, sesame seeds,
ginger, sake, gochujang, curry roux, noodles (udon/ramen), tofu, sugar, salt, pepper, oil,
water, kewpie mayo, tonkatsu/okonomi sauce, ketchup, pasta/spaghetti, passata, herbs
(parsley), lemon.

Every recipe and ingredient needs a cute SVG asset — budget ~60 ingredient + ~20 dish assets.

## 5. Art direction — cute chibi/kawaii food style

Style language (Korean/Japanese sticker aesthetic):
- **Thick rounded outlines** (consistent stroke weight), **pastel palette** with one warm
  accent, **soft shapes** — no sharp corners.
- **Faces**: black oval/dot eyes, tiny upward smile or "w" mouth, **pink oval blush marks
  under the eyes** (the single strongest kawaii signal), occasional sparkle highlights.
- **Chibi proportions**: rounded, slightly squat; the food's silhouette stays recognizable —
  cuteness comes from the face + palette, not distortion.
- Faces are emotional hooks: happy on the shelf, excited (sparkly eyes) when dragged, blissful
  on the bench, sleepy/frosty in the freezer.

**Recommended asset strategy — parameterized SVG components, not generated images.**
Precedent: `react-kawaii` (elizabetdev/react-kawaii, MIT) — hand-authored SVG React
components exposing `size`, `color`, `mood` props. Adopt that architecture in-repo:
- A shared `KawaiiFace` component (eyes/mouth/blush variants keyed by `mood`).
- Per-food `body` path data + palette in a registry → `<KawaiiFood id="egg" mood="happy"/>`.
- Consistency is automatic, assets are tiny, and they animate natively (SVG transform/
  opacity, blink via eye-scale keyframes, jiggle on spring).
- `generate_image` only as a **style reference board**, never shipping raster for icons.

## 6. Interaction & animation stack

**Stack: Vite + React + TypeScript + `motion` (motion.dev, successor of Framer Motion) + CSS.**

- `motion`: declarative springs, `layout` animations for live reordering, `AnimatePresence`
  for mount/unmount, and built-in `drag`/`whileDrag` gestures — likely covers bench dragging
  without dnd-kit; keep `@dnd-kit/core` as fallback only if hit-testing gets fiddly.
- GSAP: unnecessary here — Motion is declarative, MIT, and smaller for this use.
- Optional juice: `use-sound` for pops/swooshes, CSS-generated confetti or `canvas-confetti`
  on a perfect match.

**Kitchen metaphor layout:**
- Three zones, each a styled container you "open": **Fridge** (cool white-blue, door swing,
  fresh jiggle), **Pantry** (warm wood shelf, lazy bob), **Freezer** (frosted glass, shiver,
  frosted-over items that defrost when pulled out).
- **Kitchen bench** = the drop zone / staging area along the bottom. Drag (or tap-to-toss) an
  ingredient onto it → lands with a spring bounce + pop; it sits on the bench happily.
- Right/top rail: recipe cards that **live-reorder** as coverage changes; each shows the
  dish's own cute asset, match ring/percent, and missing-item chips. Full match = celebration
  burst + the bench ingredients cheer.
- Small "assumed staples" ribbon (salt/pepper/oil icons) so the model is legible.

Micro-interactions that sell it: idle blink/breathe, hover wiggle, drag-excited faces,
squash-and-stretch on drop, frost particles from the freezer, fridge-door light glow.

## 7. Open questions for the planning session

1. Layout: desktop-first landscape kitchen; is mobile drag-to-bench in scope for PoC
   (tap-to-add fallback recommended)?
2. Persistence: localStorage of the stocked kitchen — in scope?
3. Accessibility: keyboard alternative to drag (focus + Enter to send to bench)?
4. Sound: include a tiny sfx pass or skip for PoC?
5. Recipe detail: modal with steps, or cards-only PoC?
6. Name/branding: `kawaii-kitchen` placeholder — pick a real name.

## 8. Sources

- Pann — "SuperCook vs MyFridgeFood" (2026): the "list, not a decision" critique.
- eathealthy365 — "How Does SuperCook Work?" (2026): aggregation + matching mechanics.
- SuperCook homepage: staples assumption, category sizes.
- "Tech Skills for Older Adults" (YouTube, 2024): SuperCook filter inventory.
- Spoonacular docs: `findByIngredients` ranking/ignorePantry model.
- RecipeRadar: IR-style ingredient scoring prior art.
- `react-kawaii` (MIT): parameterized cute SVG component architecture + `mood` API.
- Clearly.sh kawaii-food style notes: blush marks as the key signal; silhouette fidelity.
- Motion.dev "GSAP vs Motion": declarative React spring/layout animation comparison.
