import {
  BackSide,
  BufferGeometry,
  Color,
  ShaderMaterial,
  CapsuleGeometry,
  CylinderGeometry,
  DataTexture,
  ExtrudeGeometry,
  LatheGeometry,
  NearestFilter,
  RedFormat,
  Shape,
  SphereGeometry,
  SplineCurve,
  Vector2,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Geo } from './plushSpecs';

const cache = new Map<string, BufferGeometry>();

function build(g: Geo): BufferGeometry {
  switch (g.k) {
    case 'ball': {
      const geo = new SphereGeometry(1, 24, 16);
      geo.scale(g.s[0], g.s[1], g.s[2]);
      return geo;
    }
    case 'box':
      return new RoundedBoxGeometry(g.s[0], g.s[1], g.s[2], 5, Math.min(g.r, g.s[0] / 2, g.s[1] / 2, g.s[2] / 2 - 0.001));
    case 'lathe': {
      const pts = new SplineCurve(g.pts.map(([r, y]) => new Vector2(r, y))).getPoints(24);
      return new LatheGeometry(pts, 24);
    }
    case 'capsule':
      return new CapsuleGeometry(g.r, g.len, 6, 16);
    case 'cyl':
      return new CylinderGeometry(g.rt, g.rb, g.h, 24, 1);
    case 'wedge': {
      const { w, h, d } = g;
      const bevel = 0.14;
      const s = new Shape();
      s.moveTo(-w / 2 + bevel, -h / 2 + bevel);
      s.lineTo(w / 2 - bevel, -h / 2 + bevel);
      s.lineTo(w / 2 - bevel, -h / 2 + bevel + (h - 2 * bevel) * 0.35);
      s.lineTo(-w / 2 + bevel, h / 2 - bevel);
      s.closePath();
      const geo = new ExtrudeGeometry(s, { depth: d - 2 * bevel, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 6, curveSegments: 12 });
      geo.translate(0, 0, -(d - 2 * bevel) / 2);
      geo.computeVertexNormals();
      return geo;
    }
  }
}

export function geometryFor(g: Geo): BufferGeometry {
  const key = JSON.stringify(g);
  let geo = cache.get(key);
  if (!geo) {
    geo = build(g);
    cache.set(key, geo);
  }
  return geo;
}

let toonRamp: DataTexture | null = null;

/** Three hard bands: shadow, mid, lit. Keeps the plushes reading as flat-shaded stickers. */
export function toonGradient(): DataTexture {
  if (!toonRamp) {
    toonRamp = new DataTexture(new Uint8Array([170, 225, 255]), 3, 1, RedFormat);
    toonRamp.minFilter = toonRamp.magFilter = NearestFilter;
    toonRamp.needsUpdate = true;
  }
  return toonRamp;
}

const hulls = new Map<BufferGeometry, BufferGeometry>();

/** Same shape with fully smoothed normals so the extruded hull has no cracks at hard edges. */
export function hullFor(geo: BufferGeometry): BufferGeometry {
  let h = hulls.get(geo);
  if (!h) {
    h = toCreasedNormals(geo, Math.PI);
    hulls.set(geo, h);
  }
  return h;
}

const inks = new Map<string, ShaderMaterial>();

/** Inverted hull: back faces pushed out along the normal, flat ink colour. */
export function inkMaterial(color: string, thickness: number): ShaderMaterial {
  const key = `${color}:${thickness}`;
  let m = inks.get(key);
  if (!m) {
    m = new ShaderMaterial({
      uniforms: { color: { value: new Color(color) }, thickness: { value: thickness } },
      vertexShader: `uniform float thickness;
void main() {
  vec3 p = position + normalize(normal) * thickness;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`,
      fragmentShader: `uniform vec3 color;
void main() {
  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}`,
      side: BackSide,
    });
    inks.set(key, m);
  }
  return m;
}
