import { FILL } from '../theme/tokens';

export type Vec3 = [number, number, number];

export type Geo =
  | { k: 'ball'; s: Vec3 }
  | { k: 'box'; s: Vec3; r: number }
  | { k: 'lathe'; pts: readonly (readonly [number, number])[] }
  | { k: 'capsule'; r: number; len: number }
  | { k: 'cyl'; rt: number; rb: number; h: number }
  | { k: 'wedge'; w: number; h: number; d: number };

export interface PartSpec {
  geo: Geo;
  color: string;
  pos?: Vec3;
  rot?: Vec3;
  /** skip the ink hull on tiny details (seeds, holes) */
  bare?: boolean;
}

export interface PlushSpec {
  body: PartSpec;
  parts?: PartSpec[];
  /** decal centre on the body front and its width in world units */
  face: { y: number; z: number; s: number };
  tone?: 'dark';
}

const ball = (color: string, s: Vec3, face = { y: 0, z: s[2], s: 0.9 }, parts?: PartSpec[]): PlushSpec => ({
  body: { geo: { k: 'ball', s }, color },
  face,
  parts,
});

const box = (color: string, s: Vec3, r = 0.2, parts?: PartSpec[], fy = 0, tone?: 'dark'): PlushSpec => ({
  body: { geo: { k: 'box', s, r }, color },
  face: { y: fy, z: s[2] / 2, s: Math.min(0.9, s[0] * 0.75) },
  parts,
  tone,
});

const leaf = (x: number, y: number, rz: number, color: string = FILL.leafDark, s = 1): PartSpec => ({
  geo: { k: 'ball', s: [0.14 * s, 0.3 * s, 0.1 * s] },
  color,
  pos: [x, y, 0],
  rot: [0, 0, rz],
});

const bottle = (color: string, cap: string, label: string, h = 1.55, tone: 'dark' | undefined = 'dark'): PlushSpec => {
  const w = 0.5;
  const neck = 0.2;
  const base = -h / 2;
  return {
    body: {
      geo: {
        k: 'lathe',
        pts: [[0.001, base], [w - 0.08, base], [w, base + 0.1], [w, base + h * 0.58], [w - 0.06, base + h * 0.68], [neck, base + h * 0.84], [neck, base + h], [0.001, base + h]],
      },
      color,
    },
    parts: [
      { geo: { k: 'cyl', rt: neck + 0.05, rb: neck + 0.05, h: 0.22 }, color: cap, pos: [0, base + h + 0.08, 0] },
      { geo: { k: 'cyl', rt: w + 0.012, rb: w + 0.012, h: h * 0.3 }, color: label, pos: [0, base + h * 0.26, 0], bare: true },
    ],
    face: { y: base + h * 0.4, z: w, s: 0.72 },
    tone,
  };
};

const squeeze = (color: string, cap: string): PlushSpec => ({
  body: { geo: { k: 'lathe', pts: [[0.001, -0.78], [0.36, -0.78], [0.5, -0.6], [0.55, 0.1], [0.42, 0.55], [0.14, 0.68], [0.001, 0.7]] }, color },
  parts: [{ geo: { k: 'cyl', rt: 0.06, rb: 0.2, h: 0.32 }, color: cap, pos: [0, 0.82, 0] }],
  face: { y: -0.1, z: 0.54, s: 0.78 },
});

const jar = (color: string, lid: string, h = 1.1, tone?: 'dark'): PlushSpec => ({
  body: { geo: { k: 'cyl', rt: 0.6, rb: 0.6, h }, color },
  parts: [{ geo: { k: 'cyl', rt: 0.64, rb: 0.64, h: 0.26 }, color: lid, pos: [0, h / 2 + 0.1, 0] }],
  face: { y: -0.05, z: 0.6, s: 0.82 },
  tone,
});

const bag = (color: string, band: string, parts: PartSpec[] = []): PlushSpec =>
  box(color, [1.25, 1.45, 0.62], 0.24, [{ geo: { k: 'box', s: [1.3, 0.26, 0.66], r: 0.1 }, color: band, pos: [0, 0.72, 0] }, ...parts], 0.05);

const window = (color: string, n: number, y = -0.38): PartSpec[] =>
  Array.from({ length: n }, (_, i) => ({
    geo: { k: 'ball', s: [0.1, 0.1, 0.06] },
    color,
    pos: [-0.35 + (0.7 / (n - 1)) * i, y + (i % 2) * 0.1, 0.31],
    bare: true,
  }));

const lumpy = (color: string, s: Vec3, lumps: Vec3[]): PlushSpec =>
  ball(color, s, { y: 0, z: s[2], s: 0.85 }, lumps.map((pos) => ({ geo: { k: 'ball', s: [0.34, 0.3, 0.3] }, color, pos })));

export const PLUSH: Record<string, PlushSpec> = {
  /* ---- §8.3 acceptance five: authored with extra care ---- */
  egg: {
    body: { geo: { k: 'lathe', pts: [[0.001, -0.78], [0.42, -0.72], [0.64, -0.46], [0.7, -0.08], [0.62, 0.32], [0.46, 0.62], [0.24, 0.79], [0.001, 0.83]] }, color: FILL.eggwhite },
    face: { y: -0.14, z: 0.69, s: 0.95 },
  },
  carrot: {
    body: { geo: { k: 'lathe', pts: [[0.001, -0.95], [0.12, -0.8], [0.3, -0.35], [0.5, 0.2], [0.56, 0.45], [0.46, 0.62], [0.001, 0.66]] }, color: FILL.carrot },
    parts: [leaf(-0.18, 0.86, 0.5), leaf(0, 0.95, 0), leaf(0.18, 0.86, -0.5)],
    face: { y: 0.18, z: 0.52, s: 0.78 },
  },
  soy_sauce: bottle(FILL.soy, FILL.tomato, FILL.cream),
  cheese: {
    body: { geo: { k: 'wedge', w: 1.55, h: 1.05, d: 0.9 }, color: FILL.cheese },
    parts: [
      { geo: { k: 'ball', s: [0.1, 0.1, 0.04] }, color: '#F2BE4E', pos: [0.4, -0.25, 0.46], bare: true },
      { geo: { k: 'ball', s: [0.07, 0.07, 0.04] }, color: '#F2BE4E', pos: [-0.5, -0.32, 0.46], bare: true },
      { geo: { k: 'ball', s: [0.08, 0.08, 0.04] }, color: '#F2BE4E', pos: [0.55, 0.1, 0.46], bare: true },
    ],
    face: { y: -0.18, z: 0.46, s: 0.78 },
  },
  gyoza: {
    body: { geo: { k: 'ball', s: [0.85, 0.52, 0.55] }, color: FILL.pastry },
    parts: [
      { geo: { k: 'capsule', r: 0.09, len: 1.1 }, color: FILL.pastry, pos: [0, 0.45, 0], rot: [0, 0, Math.PI / 2] },
      ...[-0.36, -0.12, 0.12, 0.36].map((x): PartSpec => ({ geo: { k: 'ball', s: [0.1, 0.16, 0.1] }, color: FILL.pastry, pos: [x, 0.55, 0], rot: [0, 0, -x * 0.8] })),
    ],
    face: { y: -0.05, z: 0.55, s: 0.8 },
  },

  /* ---- fridge ---- */
  chicken: ball(FILL.salmon, [0.72, 0.6, 0.55], { y: 0.05, z: 0.55, s: 0.8 }, [
    { geo: { k: 'capsule', r: 0.08, len: 0.5 }, color: FILL.cream, pos: [0.62, -0.45, 0], rot: [0, 0, 0.9] },
    { geo: { k: 'ball', s: [0.12, 0.12, 0.12] }, color: FILL.cream, pos: [0.86, -0.66, 0.06] },
    { geo: { k: 'ball', s: [0.12, 0.12, 0.12] }, color: FILL.cream, pos: [0.94, -0.54, -0.06] },
  ]),
  beef_mince: ball(FILL.meat, [0.72, 0.5, 0.6], { y: 0.02, z: 0.6, s: 0.8 }, [
    { geo: { k: 'cyl', rt: 0.9, rb: 0.8, h: 0.14 }, color: FILL.dish, pos: [0, -0.45, 0] },
  ]),
  beef_sliced: box(FILL.meat, [1.4, 0.34, 0.95], 0.14, [
    { geo: { k: 'box', s: [1.3, 0.3, 0.88], r: 0.12 }, color: FILL.steak, pos: [0.05, 0.28, -0.05] },
  ], 0),
  steak: box(FILL.steak, [1.45, 0.62, 1.0], 0.28, [
    { geo: { k: 'capsule', r: 0.07, len: 1.1 }, color: FILL.cream, pos: [0, 0.28, 0.5], rot: [0, 0, Math.PI / 2], bare: true },
  ]),
  bacon: box(FILL.pink, [1.5, 0.3, 0.8], 0.12, [
    { geo: { k: 'box', s: [1.52, 0.1, 0.82], r: 0.04 }, color: FILL.cream, pos: [0, 0.02, 0], bare: true },
  ]),
  tofu: box(FILL.cream, [1.1, 0.95, 0.95], 0.2),
  milk: box(FILL.milk, [0.95, 1.3, 0.9], 0.18, [
    { geo: { k: 'box', s: [0.95, 0.4, 0.62], r: 0.12 }, color: FILL.milk, pos: [0, 0.78, 0] },
    { geo: { k: 'cyl', rt: 0.12, rb: 0.12, h: 0.14 }, color: FILL.frost, pos: [0.22, 1.02, 0], bare: true },
    { geo: { k: 'box', s: [0.97, 0.32, 0.92], r: 0.06 }, color: FILL.frost, pos: [0, -0.4, 0], bare: true },
  ], 0.05),
  butter: box(FILL.butter, [1.35, 0.6, 0.85], 0.2, [
    { geo: { k: 'box', s: [1.2, 0.08, 0.7], r: 0.03 }, color: FILL.cream, pos: [0, 0.32, 0], bare: true },
  ], -0.02),
  spring_onion: {
    body: { geo: { k: 'capsule', r: 0.24, len: 0.6 }, color: FILL.cream },
    parts: [
      { geo: { k: 'capsule', r: 0.15, len: 0.7 }, color: FILL.leaf, pos: [-0.12, 0.85, 0], rot: [0, 0, 0.2] },
      { geo: { k: 'capsule', r: 0.15, len: 0.8 }, color: FILL.leafDark, pos: [0.1, 0.9, -0.02], rot: [0, 0, -0.15] },
    ],
    face: { y: -0.15, z: 0.24, s: 0.46 },
  },
  chilli: {
    body: { geo: { k: 'lathe', pts: [[0.001, -0.85], [0.1, -0.7], [0.28, -0.2], [0.36, 0.3], [0.34, 0.5], [0.001, 0.54]] }, color: FILL.tomato },
    parts: [{ geo: { k: 'capsule', r: 0.07, len: 0.3 }, color: FILL.leafDark, pos: [0, 0.7, 0] }],
    face: { y: 0.08, z: 0.34, s: 0.55 },
  },
  capsicum: ball(FILL.capsicum, [0.72, 0.68, 0.64], { y: -0.04, z: 0.64, s: 0.84 }, [
    { geo: { k: 'capsule', r: 0.08, len: 0.24 }, color: FILL.leafDark, pos: [0, 0.78, 0] },
  ]),
  tomato: ball(FILL.tomato, [0.74, 0.64, 0.66], { y: -0.04, z: 0.66, s: 0.86 }, [
    leaf(-0.14, 0.64, 1.2, FILL.leafDark, 0.8), leaf(0.14, 0.64, -1.2, FILL.leafDark, 0.8), leaf(0, 0.7, 0, FILL.leafDark, 0.7),
  ]),
  spinach: ball(FILL.spinach, [0.6, 0.82, 0.3], { y: -0.05, z: 0.3, s: 0.72 }, [
    { geo: { k: 'capsule', r: 0.06, len: 0.4 }, color: FILL.leafDark, pos: [0, -0.9, 0] },
  ]),
  mushroom: {
    body: { geo: { k: 'cyl', rt: 0.34, rb: 0.4, h: 0.7 }, color: FILL.cream },
    parts: [{ geo: { k: 'ball', s: [0.8, 0.5, 0.8] }, color: FILL.miso, pos: [0, 0.42, 0] }],
    face: { y: -0.14, z: 0.38, s: 0.62 },
  },
  cabbage: ball(FILL.cabbage, [0.78, 0.72, 0.72], { y: -0.08, z: 0.72, s: 0.86 }, [
    { geo: { k: 'ball', s: [0.5, 0.62, 0.2] }, color: FILL.leaf, pos: [-0.6, 0, 0.1], rot: [0, 0.6, 0] },
    { geo: { k: 'ball', s: [0.5, 0.62, 0.2] }, color: FILL.leaf, pos: [0.6, 0, 0.1], rot: [0, -0.6, 0] },
  ]),
  ginger: lumpy(FILL.miso, [0.66, 0.46, 0.46], [[-0.55, 0.28, 0], [0.5, 0.3, -0.05]]),
  kimchi: jar(FILL.tomato, FILL.cream, 1.05),
  lemon: ball(FILL.cheese, [0.78, 0.6, 0.6], { y: 0, z: 0.6, s: 0.84 }, [
    { geo: { k: 'ball', s: [0.12, 0.1, 0.1] }, color: FILL.cheese, pos: [-0.8, 0, 0], bare: true },
    { geo: { k: 'ball', s: [0.12, 0.1, 0.1] }, color: FILL.cheese, pos: [0.8, 0, 0], bare: true },
    leaf(0.12, 0.62, -1.1, FILL.leaf),
  ]),

  /* ---- pantry ---- */
  rice: bag(FILL.rice, FILL.coral, window(FILL.cream, 5)),
  spaghetti: box(FILL.cheese, [0.7, 1.55, 0.5], 0.16, [
    { geo: { k: 'box', s: [0.72, 0.3, 0.52], r: 0.08 }, color: FILL.leaf, pos: [0, -0.5, 0], bare: true },
  ], 0.12),
  flour: bag(FILL.cream, FILL.pastry),
  panko: bag(FILL.pastry, FILL.carrot, window(FILL.butter, 5)),
  bread: box(FILL.pastry, [1.2, 1.0, 0.75], 0.2, [
    { geo: { k: 'ball', s: [0.62, 0.34, 0.38] }, color: FILL.pastry, pos: [0, 0.5, 0] },
    { geo: { k: 'box', s: [1.0, 0.8, 0.02], r: 0.01 }, color: FILL.cream, pos: [0, -0.02, 0.38], bare: true },
  ], -0.05),
  tuna: jar(FILL.frost, FILL.bottle, 0.62),
  nori: box(FILL.nori, [1.35, 1.15, 0.12], 0.05, undefined, 0, 'dark'),
  curry_roux: box(FILL.coral, [1.3, 0.95, 0.5], 0.18, [
    { geo: { k: 'box', s: [1.32, 0.2, 0.52], r: 0.06 }, color: FILL.cheese, pos: [0, 0.32, 0], bare: true },
  ], -0.1),
  rice_noodles: bag(FILL.milk, FILL.leaf),
  sugar: bag(FILL.dish, FILL.pink),
  mirin: bottle(FILL.butter, FILL.leafDark, FILL.pink, 1.6, undefined),
  oyster_sauce: bottle(FILL.soy, FILL.cheese, FILL.coral, 1.45),
  kecap_manis: bottle(FILL.soy, FILL.leafDark, FILL.cheese, 1.5),
  gochujang: jar(FILL.tomato, FILL.soy, 0.8),
  sesame_oil: bottle(FILL.pumpkin, FILL.soy, FILL.cream, 1.4, undefined),
  sesame_seeds: jar(FILL.cream, FILL.leafDark, 0.95),
  kewpie_mayo: squeeze(FILL.butter, FILL.tomato),
  ketchup: squeeze(FILL.tomato, FILL.dish),
  passata: jar(FILL.tomato, FILL.leafDark, 1.2),
  herbs: jar(FILL.leaf, FILL.dish, 1.0),
  onion: {
    body: { geo: { k: 'lathe', pts: [[0.001, -0.62], [0.36, -0.56], [0.66, -0.2], [0.62, 0.22], [0.3, 0.52], [0.1, 0.66], [0.001, 0.72]] }, color: '#E9C7A6' },
    face: { y: -0.1, z: 0.64, s: 0.84 },
  },
  garlic: {
    body: { geo: { k: 'lathe', pts: [[0.001, -0.55], [0.4, -0.5], [0.62, -0.18], [0.54, 0.2], [0.2, 0.5], [0.08, 0.72], [0.001, 0.76]] }, color: FILL.cream },
    face: { y: -0.12, z: 0.6, s: 0.8 },
  },
  potato: lumpy(FILL.miso, [0.76, 0.6, 0.58], [[-0.4, 0.2, 0.1]]),
  pumpkin: ball(FILL.pumpkin, [0.82, 0.6, 0.7], { y: -0.04, z: 0.7, s: 0.86 }, [
    { geo: { k: 'capsule', r: 0.08, len: 0.2 }, color: FILL.leafDark, pos: [0, 0.66, 0], rot: [0, 0, 0.3] },
    leaf(0.22, 0.6, -1.3, FILL.leaf, 0.8),
  ]),

  /* ---- freezer ---- */
  peas: ball(FILL.leaf, [0.62, 0.62, 0.6], { y: 0, z: 0.6, s: 0.84 }, [
    { geo: { k: 'ball', s: [0.4, 0.4, 0.38] }, color: FILL.leafDark, pos: [-0.55, -0.35, -0.1] },
    { geo: { k: 'ball', s: [0.36, 0.36, 0.34] }, color: FILL.leaf, pos: [0.58, -0.38, -0.12] },
  ]),
  corn: {
    body: { geo: { k: 'capsule', r: 0.42, len: 0.8 }, color: FILL.cheese },
    parts: [
      leaf(-0.36, -0.2, 0.25, FILL.leaf, 2),
      leaf(0.36, -0.2, -0.25, FILL.leaf, 2),
    ],
    face: { y: 0.1, z: 0.42, s: 0.66 },
  },
  puff_pastry: box(FILL.pastry, [1.35, 0.35, 1.0], 0.12, [
    { geo: { k: 'box', s: [1.3, 0.3, 0.95], r: 0.1 }, color: FILL.butter, pos: [0, 0.25, 0] },
  ]),
  chips: box(FILL.tomato, [1.0, 0.9, 0.62], 0.18, [
    ...[-0.3, -0.1, 0.1, 0.3].map((x, i): PartSpec => ({ geo: { k: 'box', s: [0.12, 0.5, 0.12], r: 0.04 }, color: FILL.cheese, pos: [x, 0.6 + (i % 2) * 0.08, 0], rot: [0, 0, (i - 1.5) * 0.12] })),
  ], -0.08),
};

/** §8.3 moodboard sign-off set */
export const ACCEPTANCE = ['egg', 'carrot', 'soy_sauce', 'cheese', 'gyoza'] as const;
