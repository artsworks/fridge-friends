import { CanvasTexture, SRGBColorSpace } from 'three';
import type { Mood } from '../lib/types';
import { FACE, FILL } from '../theme/tokens';

/** Same geometry as the SVG KawaiiFace, drawn with Path2D so 3D faces match the 2D ones. */
const EX = 10;
const SIZE = 256;
const K = SIZE / 64;

type Tone = 'dark' | undefined;
const cache = new Map<string, CanvasTexture>();

function star(cx: number): Path2D {
  const p = new Path2D();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 ? 2.2 : 5.2;
    const a = (Math.PI / 4) * i - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i) p.lineTo(x, y);
    else p.moveTo(x, y);
  }
  p.closePath();
  return p;
}

function draw(ctx: CanvasRenderingContext2D, mood: Mood | 'blink', tone: Tone) {
  const ink = tone === 'dark' ? FILL.cream : FACE.eye;
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.save();
  ctx.translate(SIZE / 2, SIZE / 2 - 3 * K);
  ctx.scale(K, K);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 2.4;
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;

  if (mood !== 'shock') {
    ctx.globalAlpha = mood === 'excited' ? 1 : 0.85;
    ctx.fillStyle = mood === 'frost' ? '#A9D4F0' : FACE.blush;
    for (const cx of [-17, 17]) {
      ctx.beginPath();
      ctx.ellipse(cx, 6, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = ink;
  }

  const dotEyes = (big: boolean) => {
    for (const cx of [-EX, EX]) {
      ctx.fillStyle = ink;
      ctx.beginPath();
      ctx.ellipse(cx, 0, big ? 4 : 3.3, big ? 4.6 : 4, 0, 0, Math.PI * 2);
      ctx.fill();
      if (tone !== 'dark') {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx + 1.2, -1.5, big ? 1.5 : 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.fillStyle = ink;
  };

  switch (mood) {
    case 'excited':
      for (const cx of [-EX, EX]) {
        const p = star(cx);
        ctx.fillStyle = FACE.sparkle;
        ctx.fill(p);
        ctx.lineWidth = 1.4;
        ctx.stroke(p);
      }
      ctx.lineWidth = 2.4;
      ctx.fillStyle = ink;
      break;
    case 'bliss':
      ctx.stroke(new Path2D(`M${-EX - 4} 1 Q${-EX} -4 ${-EX + 4} 1 M${EX - 4} 1 Q${EX} -4 ${EX + 4} 1`));
      break;
    case 'sleepy':
    case 'blink':
      ctx.stroke(new Path2D(`M${-EX - 4} 0.5 H${-EX + 4} M${EX - 4} 0.5 H${EX + 4}`));
      break;
    case 'frost':
      ctx.stroke(new Path2D(`M${-EX - 3.5} -3 L${-EX + 2.5} 0 L${-EX - 3.5} 3 M${EX + 3.5} -3 L${EX - 2.5} 0 L${EX + 3.5} 3`));
      break;
    case 'shock':
      dotEyes(true);
      break;
    default:
      dotEyes(false);
  }

  switch (mood) {
    case 'happy':
    case 'excited': {
      const m = new Path2D('M-4.5 4 Q0 4.6 4.5 4 Q4 10 0 10 Q-4 10 -4.5 4Z');
      ctx.fill(m);
      ctx.lineWidth = 1.2;
      ctx.stroke(m);
      ctx.fillStyle = '#F58B9C';
      ctx.fill(new Path2D('M-2.2 8.4 Q0 6.6 2.2 8.4 Q0 9.8 -2.2 8.4Z'));
      break;
    }
    case 'bliss':
      ctx.stroke(new Path2D('M-5 4 Q-2.5 7.5 0 4.5 Q2.5 7.5 5 4'));
      break;
    case 'sleepy':
      ctx.beginPath();
      ctx.ellipse(0, 6, 1.8, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'frost':
      ctx.stroke(new Path2D('M-5 6 q1.25 -2 2.5 0 t2.5 0 t2.5 0 t2.5 0'));
      break;
    case 'shock':
      ctx.beginPath();
      ctx.ellipse(0, 7, 2.8, 3.4, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    default:
      ctx.stroke(new Path2D('M-3.6 4.2 Q0 7.8 3.6 4.2'));
  }
  ctx.restore();
}

export function faceTexture(mood: Mood | 'blink', tone: Tone): CanvasTexture {
  const key = `${mood}:${tone ?? ''}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  if (ctx) draw(ctx, mood, tone);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  cache.set(key, tex);
  return tex;
}
