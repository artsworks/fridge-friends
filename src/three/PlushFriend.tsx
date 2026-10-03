import { Decal } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { BufferGeometry, Group, MeshBasicMaterial } from 'three';
import type { Mood } from '../lib/types';
import { STROKE } from '../theme/tokens';
import { faceTexture } from './faceTexture';
import { geometryFor, hullFor, inkMaterial, toonMaterial } from './geometry';
import { PLUSH, type PartSpec } from './plushSpecs';

export interface PlushProps {
  id: string;
  mood: Mood;
  /** increments on every landing; each bump triggers a squash */
  landed?: number;
  reduce?: boolean;
}

const OUTLINE = 0.058;
/** the face texture spans 64 SVG units; faces only use the middle ~44 */
const FACE_SCALE = 1.45;

function Ink({ geo }: { geo: BufferGeometry }) {
  return <mesh geometry={hullFor(geo)} material={inkMaterial(STROKE.color, OUTLINE)} dispose={null} />;
}

function Part({ p }: { p: PartSpec }) {
  const geo = geometryFor(p.geo);
  return (
    <group position={p.pos} rotation={p.rot}>
      <mesh geometry={geo} material={toonMaterial(p.color)} dispose={null} />
      {!p.bare && <Ink geo={geo} />}
    </group>
  );
}

export function PlushFriend({ id, mood, landed = 0, reduce = false }: PlushProps) {
  const spec = PLUSH[id];
  const root = useRef<Group>(null);
  const faceMat = useRef<MeshBasicMaterial>(null);
  const sq = useRef({ x: 0, v: 0 });
  const blink = useRef({ next: -1, until: 0 });
  const elapsed = useRef(0);
  const seed = useMemo(() => Math.random() * 10, []);
  const tex = useMemo(() => faceTexture(mood, spec?.tone), [mood, spec?.tone]);
  const blinkTex = useMemo(() => faceTexture('blink', spec?.tone), [spec?.tone]);

  useEffect(() => {
    if (landed > 0 && !reduce) sq.current.v = -5.5;
  }, [landed, reduce]);

  useEffect(() => {
    elapsed.current = 0;
    if (!reduce || !root.current) return;
    sq.current = { x: 0, v: 0 };
    root.current.scale.set(1, 1, 1);
    root.current.rotation.set(0, -0.22, 0);
    root.current.position.y = 0;
    if (faceMat.current) faceMat.current.map = tex;
  }, [reduce, tex]);

  useFrame((state, dt) => {
    const g = root.current;
    if (!g || reduce) return;
    elapsed.current += dt;
    const excited = mood === 'excited';
    if (!excited && elapsed.current < 1 / 30) return;
    const t = state.clock.elapsedTime + seed;
    const step = Math.min(elapsed.current, 1 / 30);
    elapsed.current = excited ? 0 : elapsed.current % (1 / 30);
    const s = sq.current;
    s.v += (-220 * s.x - 13 * s.v) * step;
    s.x += s.v * step;
    const breathe = 0.022 * Math.sin(t * 2.2);
    g.scale.set(1 - breathe * 0.6 - s.x * 0.55, 1 + breathe + s.x, 1 - breathe * 0.6 - s.x * 0.55);
    g.rotation.y = -0.1 + 0.28 * Math.sin(t * 0.7);
    g.rotation.z = excited ? 0.1 * Math.sin(t * 11) : 0;
    g.position.y = excited ? Math.abs(Math.sin(t * 7)) * 0.1 : 0;

    const mat = faceMat.current;
    if (mat) {
      const b = blink.current;
      if (b.next < 0) b.next = t + 2 + Math.random() * 4;
      const canBlink = mood === 'idle' || mood === 'happy' || mood === 'bliss';
      if (canBlink && t > b.next) {
        b.until = t + 0.13;
        b.next = t + 3 + Math.random() * 3.5;
      }
      const want = canBlink && t < b.until && mood !== 'bliss' ? blinkTex : tex;
      if (mat.map !== want) mat.map = want;
    }
  });

  if (!spec) return null;
  const { body, face } = spec;
  const bodyGeo = geometryFor(body.geo);
  return (
    <group ref={root}>
      <Ink geo={bodyGeo} />
      <mesh geometry={bodyGeo} material={toonMaterial(body.color)} dispose={null}>
        <Decal position={[0, face.y, face.z]} rotation={[0, 0, 0]} scale={[face.s * FACE_SCALE, face.s * FACE_SCALE, 0.6]}>
          <meshBasicMaterial ref={faceMat} map={tex} transparent polygonOffset polygonOffsetFactor={-4} depthWrite={false} toneMapped={false} />
        </Decal>
      </mesh>
      {spec.parts?.map((p, i) => <Part key={i} p={p} />)}
    </group>
  );
}
