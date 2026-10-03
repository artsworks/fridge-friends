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
- `?3d`, `?plush` and `?losecontext` load one R3F scene for all visible models. Missing WebGL2 or context loss returns chips to SVG.
- Dragged chips always use SVG. Idle 3D chips update at 30fps, while excited chips update each frame.
- The 3D canvas uses DPR 1. Idle frames skip rendering until 32ms have elapsed since the previous render.
- Reduced-motion models use demand rendering only after scene changes or scrolling.
- Models share merged geometry and materials. Each model uses one outline draw and one draw per body color, plus its face.
- Model preparation runs across animation frames. SVG remains visible until each 3D model renders.
- `src/state` has the reducer, context and persistence.

## Compare rendering performance

Open `?3d&fps&stress` and `?svg&fps&stress` on the same device and viewport. Both load 12 bench ingredients.
Wait for the landing animations to finish before you compare frame rates.
The 3D overlay counts renderer submissions. The SVG overlay counts browser animation frames. Neither measures completed GPU renders.
Idle 3D rendering targets 30 FPS. Excited models target the display refresh rate. Held shelf artwork uses SVG and does not increase that rate.
Use browser performance traces to check frame times during drags. The `?plush` page compares the 3D models with their SVG versions.

## Asset and resource budget

Runtime artwork uses inline SVG and procedural geometry. There are no runtime raster images or font files to compress.
Face textures use 128px canvases with anisotropy 2. Their pixel storage is one quarter of the previous 256px textures.
The documentation mood board is not part of the production build.
Vite keeps the WebGL bundle separate from the default SVG bundle. The deployment server must supply gzip or Brotli compression.

Geometry, hulls, merged models, toon materials and face textures use page-lifetime caches bounded by the authored models, colors and moods.
Individual face materials belong to their mesh and are disposed when the mesh unmounts.
Animation frames, context-loss listeners and timers are canceled on cleanup. Canvas teardown releases the renderer and WebGL context.

The renderer follows [R3F performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance),
[Three.js resource cleanup guidance](https://threejs.org/manual/en/cleanup.html), and
[MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices).
Verify a 120 FPS target on a hardware GPU with a 120 Hz display. A software-rendered 60 Hz browser cannot verify that target.

The plan and art direction are in `docs/PLAN.md` and `docs/assets/art-direction/kawaii-moodboard.png`.
