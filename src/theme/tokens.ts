export const STROKE = { w: 3.5, color: '#3A2E2A', linecap: 'round', linejoin: 'round' } as const;

export const FILL = {
  cream: '#FFF6E9', rice: '#FFFDF6', eggwhite: '#FFF9EE', yolk: '#FFC93C',
  pink: '#FFC9D1', blush: '#F9A8B8', coral: '#FF8A5C',
  meat: '#F4A6AC', salmon: '#F7B8A0', steak: '#EF9B8F',
  leaf: '#9BD3A0', leafDark: '#6FBF78', carrot: '#F9A65B', pumpkin: '#F2994A',
  tomato: '#F97B7B', cabbage: '#C9E8B8', capsicum: '#F98D7C', spinach: '#7FC98B',
  cheese: '#FFD97D', milk: '#F4F9FF', butter: '#FFE9A8',
  bottle: '#C9B6A4', soy: '#6B4F3F', nori: '#4E6B57', miso: '#E8D9B8',
  freezer: '#D9EDF7', frost: '#BFE0F0', pastry: '#F5D9A8', dish: '#FFFFFF',
} as const;

export type FillKey = keyof typeof FILL;

export const FACE = { eye: '#3A2E2A', blush: '#F9A8B8', sparkle: '#FFD97D' } as const;

export const CONFETTI_COLORS = ['#FF8A5C', '#FFC9D1', '#FFD97D', '#9BD3A0', '#BFE0F0', '#F9A8B8'];

export const SPRING = { type: 'spring', stiffness: 350, damping: 30 } as const;
