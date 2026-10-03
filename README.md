# Fridge Friends

A kitchen you play with. Ingredient characters live in the fridge, pantry and freezer. Drag or tap them onto the kitchen bench and the recipe cards re-rank as you go.

It is a static single-page app with no backend. All ingredient and recipe data is local, and your bench is saved in `localStorage` under `fridge-friends:v1`.

## Run it

Needs Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

## Checks

```bash
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run test       # vitest run
npm run build      # vite build, output in dist/
```

## How to use it

- Open a zone and tap an ingredient to toss it onto the bench. Tap it on the bench to send it home.
- Drag an ingredient and drop it anywhere inside the bench.
- Keyboard: Tab to an ingredient and press Enter or Space.
- Search accepts aliases, so "scallion" finds spring onion and "mince" finds beef mince.
- Salt, pepper, water and oil are always assumed. They never count as missing.
- Recipe cards are grouped into "Ready now", "Almost there" (one or two missing) and "Later". Click a card for steps and to add the missing ingredients.

## URL flags

| Flag | What it does |
| --- | --- |
| `?assets` | Dev only. Grid of every SVG body, mood, dish and staple. |
| `?plush` | Dev only. 3D PlushFriend next to its SVG twin, plus the 3D roster. |
| `?stress` | Loads 12 ingredients onto the bench. |
| `?fps` | Shows frame rate, render scale and 3D or SVG mode. |
| `?svg` | Forces the SVG renderer. |
| `?3d` | Opts into the 3D renderer. SVG is the default. |
| `?losecontext` | Drops the WebGL context after 3 seconds to test the SVG fallback. |

## Layout

- `src/data` has 51 stockable ingredients, 4 staples and 20 recipes.
- `src/lib/match.ts` ranks recipes by IDF-weighted coverage. `src/lib/aliases.ts` resolves search terms.
- `src/assets` has the SVG characters and dishes. `KawaiiFace` draws the 7 moods.
- `src/three` has the optional 3D PlushFriend. The default SVG mode does not load the WebGL renderer.
- `?3d`, `?plush` and `?losecontext` load one shared R3F canvas with drei `<View>` slots. Missing WebGL2 or context loss returns chips to SVG.
- Dragged chips always use SVG. Idle 3D chips update at 30fps, while excited chips update each frame.

## Compare rendering performance

Open `?3d&fps&stress` and `?svg&fps&stress` on the same device and viewport. Both load 12 bench ingredients.
Wait for the landing animations to finish before you compare frame rates. The overlay counts browser animation frames, not completed GPU renders.
Use browser performance traces to check frame times during drags. The `?plush` page compares the 3D models with their SVG versions.
- `src/state` has the reducer, context and persistence.

The plan and art direction are in `docs/PLAN.md` and `docs/assets/art-direction/kawaii-moodboard.png`.
