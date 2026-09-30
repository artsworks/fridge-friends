import { circ, curve, D, ell, F, line, rpoly, rr, S, smooth, type P, type Part } from './shapes';
import type { FillKey } from '../theme/tokens';

export interface DishSpec {
  paths: Part[];
  face: { x: number; y: number; s: number };
  tone?: 'dark';
  steam?: boolean;
  shine?: readonly [number, number, number];
}

const face = (x: number, y: number, s = 1) => ({ x, y, s });

const plate = (): Part[] => [F(ell(48, 72, 42, 14), 'dish'), D(ell(48, 70, 30, 8), 'frost')];
const bowlBack = (): Part[] => [F(ell(48, 50, 38, 10), 'cream')];
const bowlFront = (fill: FillKey): Part[] => [
  F('M10 50C10 72 28 86 48 86S86 72 86 50C86 56 70 60 48 60S10 56 10 50Z', fill),
  D(curve([[22, 70], [48, 76], [74, 70]]), 'dish'),
];
const mound = (cx: number, cy: number, rx: number, ry: number): string =>
  smooth([[cx - rx, cy + ry * 0.4], [cx - rx * 0.8, cy - ry * 0.4], [cx - rx * 0.3, cy - ry], [cx + rx * 0.3, cy - ry], [cx + rx * 0.8, cy - ry * 0.4], [cx + rx, cy + ry * 0.4], [cx, cy + ry * 0.7]]);
const dots = (pts: readonly P[], r = 1.6) => pts.map((p) => circ(p[0], p[1], r)).join('');
const friedEgg = (cx: number, cy: number, s = 1): Part[] => [
  F(smooth([[cx - 18 * s, cy], [cx - 12 * s, cy - 10 * s], [cx, cy - 12 * s], [cx + 14 * s, cy - 9 * s], [cx + 18 * s, cy + 2 * s], [cx + 8 * s, cy + 10 * s], [cx - 10 * s, cy + 9 * s]]), 'eggwhite'),
  F(circ(cx, cy - 1 * s, 9 * s), 'yolk'),
];

export const DISHES: Record<string, DishSpec> = {
  'spaghetti-bolognese': {
    paths: [
      ...plate(),
      F(mound(48, 58, 34, 20), 'butter'),
      D(curve([[24, 60], [36, 52], [50, 62], [66, 52], [76, 60]]) + curve([[30, 68], [46, 62], [62, 70]]), 'cheese'),
      F(smooth([[28, 44], [40, 34], [58, 34], [70, 44], [60, 54], [36, 54]]), 'tomato'),
      S(dots([[40, 40], [56, 38], [50, 46]], 1.6), 'cheese'),
      F(smooth([[58, 30], [66, 22], [72, 28], [64, 34]]), 'leaf'),
    ],
    face: face(48, 62, 0.75),
    steam: true,
  },
  'chicken-parmigiana': {
    paths: [
      ...plate(),
      F(smooth([[14, 60], [22, 40], [48, 34], [74, 38], [82, 58], [66, 74], [30, 74]]), 'carrot'),
      F(smooth([[22, 54], [30, 42], [48, 40], [66, 42], [74, 54], [60, 60], [36, 60]]), 'tomato'),
      F(smooth([[28, 52], [36, 44], [60, 44], [68, 52], [60, 62], [54, 58], [46, 64], [38, 58]]), 'cheese'),
      S(dots([[36, 46], [60, 48]], 1.5), 'leafDark'),
    ],
    face: face(48, 52, 0.62),
    steam: true,
  },
  'sausage-rolls': {
    paths: [
      ...plate(),
      F(rr(12, 44, 30, 22, 10), 'pastry'),
      F(rr(54, 44, 30, 22, 10), 'pastry'),
      F(rr(26, 50, 44, 26, 12), 'pastry'),
      D(line([38, 52], [36, 74]) + line([58, 52], [56, 74]), 'pumpkin'),
      F(ell(80, 70, 7, 4), 'tomato'),
    ],
    face: face(48, 64, 0.68),
  },
  'shepherds-pie': {
    paths: [
      F(rpoly([[8, 50], [88, 50], [82, 84], [14, 84]], 10), 'coral'),
      F(smooth([[10, 52], [18, 36], [34, 34], [48, 28], [62, 34], [78, 36], [86, 52], [48, 58]]), 'butter'),
      D(curve([[24, 44], [32, 40], [38, 46]]) + curve([[56, 40], [64, 36], [70, 42]]), 'cheese'),
      D(line([20, 64], [76, 64]), 'dish'),
    ],
    face: face(48, 70, 0.72),
    steam: true,
  },
  'roast-chicken-veg': {
    paths: [
      ...plate(),
      F(smooth([[18, 60], [24, 42], [48, 32], [72, 42], [78, 60], [48, 70]]), 'carrot'),
      F(smooth([[14, 54], [8, 44], [16, 40], [24, 48]]), 'carrot'),
      F(smooth([[82, 54], [88, 44], [80, 40], [72, 48]]), 'carrot'),
      F(circ(20, 72, 6), 'pastry'),
      F(circ(76, 72, 6), 'pumpkin'),
      F(rr(44, 72, 12, 8, 3), 'carrot'),
      D(curve([[36, 42], [42, 38]]), 'dish'),
    ],
    face: face(48, 54, 0.7),
    steam: true,
  },
  'steak-and-chips': {
    paths: [
      ...plate(),
      F(rr(62, 36, 8, 30, 3), 'cheese'),
      F(rr(72, 40, 8, 28, 3), 'cheese'),
      F(rr(66, 50, 22, 8, 3), 'cheese'),
      F(smooth([[10, 60], [16, 44], [36, 38], [56, 44], [62, 60], [48, 72], [22, 72]]), 'steak'),
      D(curve([[20, 50], [30, 46], [40, 50]]), 'pink'),
      F(rr(28, 40, 14, 6, 3), 'butter'),
    ],
    face: face(38, 60, 0.68),
    steam: true,
  },
  'bacon-egg-roll': {
    paths: [
      F(rr(12, 66, 72, 16, 8), 'pastry'),
      F(smooth([[10, 64], [30, 58], [50, 66], [70, 58], [86, 64], [80, 72], [50, 72], [16, 72]]), 'meat'),
      F(smooth([[16, 60], [30, 52], [60, 52], [80, 60], [48, 64]]), 'eggwhite'),
      F('M12 58C12 36 28 22 48 22S84 36 84 58Z', 'pastry'),
      S(dots([[34, 32], [48, 28], [62, 32], [40, 40], [56, 40]], 1.3), 'cream'),
    ],
    face: face(48, 46, 0.72),
  },
  frittata: {
    paths: [
      F(rr(78, 52, 18, 8, 4), 'soy'),
      F(ell(46, 60, 38, 22), 'soy'),
      F(ell(46, 56, 32, 17), 'yolk'),
      S(dots([[26, 52], [62, 48], [66, 62], [30, 64]], 2.6), 'spinach'),
      S(dots([[40, 46], [58, 66], [22, 58]], 2), 'tomato'),
    ],
    face: face(46, 58, 0.72),
    steam: true,
  },
  'teriyaki-chicken': {
    paths: [
      ...bowlBack(),
      F(mound(48, 46, 34, 14), 'rice'),
      F(rpoly([[18, 44], [36, 34], [44, 40], [26, 50]], 5), 'pumpkin'),
      F(rpoly([[40, 38], [58, 30], [64, 36], [46, 46]], 5), 'pumpkin'),
      F(rpoly([[58, 40], [76, 34], [80, 42], [62, 48]], 5), 'pumpkin'),
      S(dots([[30, 42], [52, 36], [70, 40]], 1.2), 'cream'),
      S(dots([[40, 48], [56, 50]], 1.8), 'leaf'),
      ...bowlFront('coral'),
    ],
    face: face(48, 70, 0.75),
    steam: true,
  },
  'chicken-katsu-curry': {
    paths: [
      ...plate(),
      F(mound(30, 58, 22, 16), 'rice'),
      F(smooth([[40, 64], [52, 54], [74, 54], [88, 64], [76, 76], [50, 76]]), 'pumpkin'),
      F(rpoly([[46, 46], [80, 38], [84, 52], [50, 60]], 6), 'carrot'),
      D(line([58, 44], [60, 57]) + line([70, 41], [72, 54]), 'pumpkin'),
    ],
    face: face(30, 58, 0.62),
    steam: true,
  },
  onigiri: {
    paths: [
      ...plate(),
      F(smooth([[48, 14], [60, 22], [76, 50], [76, 68], [48, 74], [20, 68], [20, 50], [36, 22]], 0.9), 'rice'),
      F(rr(36, 56, 24, 18, 3), 'nori'),
      S(dots([[36, 34], [58, 30], [66, 52], [28, 50]], 1.3), 'miso'),
    ],
    face: face(48, 44, 0.8),
  },
  'kimchi-fried-rice': {
    paths: [
      ...bowlBack(),
      F(mound(48, 46, 34, 14), 'capsicum'),
      S(dots([[22, 46], [70, 44], [30, 40]], 2.2), 'leaf'),
      ...friedEgg(50, 38, 1),
      ...bowlFront('frost'),
    ],
    face: face(50, 37, 0.42),
    steam: true,
  },
  'bulgogi-beef': {
    paths: [
      ...bowlBack(),
      F(mound(48, 46, 34, 14), 'rice'),
      F(smooth([[24, 44], [34, 34], [50, 32], [60, 38], [52, 46], [36, 48]]), 'soy'),
      F(smooth([[48, 40], [60, 32], [74, 36], [76, 44], [62, 48]]), 'steak'),
      S(dots([[32, 38], [66, 40]], 1.8), 'leaf'),
      ...bowlFront('nori'),
    ],
    face: face(48, 72, 0.75),
    steam: true,
  },
  bibimbap: {
    paths: [
      ...bowlBack(),
      F(ell(48, 48, 34, 9), 'rice'),
      S(ell(24, 48, 9, 5), 'spinach'),
      S(ell(72, 48, 9, 5), 'carrot'),
      S(ell(36, 42, 8, 3.5), 'pastry'),
      S(ell(62, 42, 8, 3.5), 'tomato'),
      ...friedEgg(48, 46, 0.8),
      ...bowlFront('soy'),
    ],
    face: face(48, 45, 0.34),
    steam: true,
  },
  'egg-fried-rice': {
    paths: [
      ...bowlBack(),
      F(mound(48, 44, 34, 16), 'butter'),
      S(dots([[28, 40], [60, 36], [46, 48], [70, 46]], 2.2), 'yolk'),
      S(dots([[36, 36], [56, 44], [66, 38], [24, 48]], 2), 'leaf'),
      ...bowlFront('freezer'),
    ],
    face: face(48, 70, 0.75),
    steam: true,
  },
  'pan-fried-dumplings': {
    paths: [
      ...plate(),
      F('M10 66C10 54 18 48 28 48S46 54 46 66Z', 'miso'),
      F('M50 66C50 54 58 48 68 48S86 54 86 66Z', 'miso'),
      F('M26 70C26 52 36 42 48 42S70 52 70 70Z', 'miso'),
      D(line([40, 46], [42, 50]) + line([48, 44], [48, 48]) + line([56, 46], [54, 50]), 'pastry'),
      S(rr(28, 68, 40, 3, 1.5), 'pumpkin'),
    ],
    face: face(48, 58, 0.62),
    steam: true,
  },
  'tomato-egg-stir-fry': {
    paths: [
      ...plate(),
      F(smooth([[12, 62], [20, 46], [40, 40], [60, 42], [80, 50], [82, 66], [60, 74], [30, 74]]), 'yolk'),
      F(smooth([[20, 56], [28, 48], [36, 54], [30, 62]]), 'tomato'),
      F(smooth([[62, 50], [72, 46], [76, 56], [66, 60]]), 'tomato'),
      F(smooth([[56, 64], [64, 62], [66, 70], [58, 72]]), 'tomato'),
      S(dots([[44, 46], [52, 48]], 1.8), 'leaf'),
    ],
    face: face(46, 58, 0.72),
    steam: true,
  },
  'pad-see-ew': {
    paths: [
      ...plate(),
      F(mound(48, 58, 36, 18), 'miso'),
      D(curve([[20, 58], [34, 50], [50, 58], [66, 50], [78, 58]]) + curve([[26, 66], [40, 60], [58, 66], [72, 62]]), 'soy'),
      F(smooth([[26, 44], [34, 36], [42, 42], [34, 48]]), 'spinach'),
      F(smooth([[60, 42], [70, 36], [74, 46], [64, 48]]), 'yolk'),
    ],
    face: face(48, 58, 0.62),
    steam: true,
  },
  'nasi-goreng': {
    paths: [
      ...plate(),
      F(mound(48, 58, 34, 18), 'pumpkin'),
      S(dots([[24, 58], [70, 60], [36, 66]], 2), 'leaf'),
      ...friedEgg(48, 46, 1),
      F(circ(82, 66, 6), 'tomato'),
    ],
    face: face(48, 45, 0.45),
    steam: true,
  },
  'chicken-banh-mi': {
    paths: [
      F(smooth([[8, 60], [16, 48], [40, 42], [70, 42], [88, 50], [82, 62], [50, 64], [20, 66]]), 'carrot'),
      S(smooth([[16, 52], [30, 44], [50, 44], [74, 46], [60, 50], [30, 52]]), 'leaf'),
      F(smooth([[6, 64], [14, 54], [30, 58], [50, 56], [72, 54], [90, 58], [86, 70], [60, 78], [30, 78], [10, 74]]), 'pastry'),
      D(line([28, 62], [32, 66]) + line([48, 60], [52, 64]) + line([68, 58], [72, 62]), 'pumpkin'),
    ],
    face: face(48, 69, 0.6),
  },
};
