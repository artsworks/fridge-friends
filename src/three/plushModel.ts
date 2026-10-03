import { Euler, Matrix4, Mesh, Quaternion, Vector3, type BufferGeometry } from 'three';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { geometryFor, hullFor } from './geometry';
import type { PartSpec, PlushSpec } from './plushSpecs';

const FACE_SCALE = 1.45;

export interface PlushModelGeometry {
  face: BufferGeometry;
  ink: BufferGeometry;
  surfaces: Array<{ color: string; geometry: BufferGeometry }>;
}

const models = new WeakMap<PlushSpec, PlushModelGeometry>();

function transformedGeometry(part: PartSpec, ink: boolean): BufferGeometry {
  const source = geometryFor(part.geo);
  const clone = (ink ? hullFor(source) : source).clone();
  const geometry = clone.index ? clone.toNonIndexed() : clone;
  if (geometry !== clone) clone.dispose();
  for (const name of Object.keys(geometry.attributes)) {
    if (name !== 'position' && name !== 'normal') geometry.deleteAttribute(name);
  }
  const position = part.pos ?? [0, 0, 0];
  const rotation = part.rot ?? [0, 0, 0];
  const matrix = new Matrix4().compose(
    new Vector3(...position),
    new Quaternion().setFromEuler(new Euler(...rotation)),
    new Vector3(1, 1, 1),
  );
  return geometry.applyMatrix4(matrix);
}

function merged(geometries: BufferGeometry[]): BufferGeometry {
  const result = mergeGeometries(geometries, false);
  geometries.forEach((geometry) => geometry.dispose());
  if (!result) throw new Error('Could not merge plush geometry');
  const indexed = mergeVertices(result);
  result.dispose();
  return indexed;
}

export function modelFor(spec: PlushSpec): PlushModelGeometry {
  const cached = models.get(spec);
  if (cached) return cached;

  const parts = [spec.body, ...(spec.parts ?? [])];
  const byColor = new Map<string, BufferGeometry[]>();
  for (const part of parts) {
    const list = byColor.get(part.color) ?? [];
    list.push(transformedGeometry(part, false));
    byColor.set(part.color, list);
  }

  const bodyGeometry = geometryFor(spec.body.geo);
  const body = new Mesh(bodyGeometry);
  body.updateMatrixWorld();
  const { y, z, s } = spec.face;
  const face = new DecalGeometry(
    body,
    new Vector3(0, y, z),
    new Euler(0, 0, 0),
    new Vector3(s * FACE_SCALE, s * FACE_SCALE, 0.6),
  );
  const inkParts = parts.filter((part) => !part.bare).map((part) => transformedGeometry(part, true));
  const model = {
    face,
    ink: merged(inkParts),
    surfaces: [...byColor].map(([color, geometries]) => ({ color, geometry: merged(geometries) })),
  };
  models.set(spec, model);
  return model;
}
