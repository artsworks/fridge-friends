import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Group } from 'three';
import { PlushFriend } from './PlushFriend';
import { PLUSH } from './plushSpecs';
import { modelFor } from './plushModel';
import { isOnscreen, plushPixelScale, screenPosition } from './screenLayout';
import type { PlushRenderSlot } from './Stage';

interface Props {
  fallback: (reason: string) => void;
  loseContext: boolean;
  onRenderFps: (fps: number) => void;
  slots: PlushRenderSlot[];
}

function ScrollInvalidation() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const refresh = () => invalidate();
    window.addEventListener('scroll', refresh, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', refresh, { capture: true });
  }, [invalidate]);
  return null;
}

function PreparedPlushes({ slots }: Pick<Props, 'slots'>) {
  const ids = useMemo(() => [...new Set(slots.map((slot) => slot.id))], [slots]);
  const [prepared, setPrepared] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    const pending = ids.filter((id) => !prepared.has(id) && PLUSH[id]);
    let frame = 0;
    const prepareNext = () => {
      const id = pending.shift();
      const spec = id ? PLUSH[id] : undefined;
      if (!id || !spec) return;
      modelFor(spec);
      setPrepared((current) => new Set(current).add(id));
      if (pending.length) frame = requestAnimationFrame(prepareNext);
    };
    frame = requestAnimationFrame(prepareNext);
    return () => cancelAnimationFrame(frame);
  }, [ids, prepared]);
  return slots.filter((slot) => prepared.has(slot.id)).map((slot) => <ScreenPlush key={slot.key} slot={slot} />);
}

function RenderLoop({ onRenderFps, slots }: Pick<Props, 'onRenderFps' | 'slots'>) {
  const sample = useRef({ frames: 0, start: performance.now() });
  const lastRender = useRef(-Infinity);
  const animated = slots.some((slot) => !slot.reduce);
  const fullRate = slots.some((slot) => !slot.reduce && slot.mood === 'excited');
  useFrame(({ gl, scene, camera }) => {
    const now = performance.now();
    if (animated && !fullRate && now - lastRender.current < 32) return;
    lastRender.current = now;
    gl.render(scene, camera);
    sample.current.frames++;
    const elapsed = now - sample.current.start;
    if (elapsed >= 1000) {
      onRenderFps(Math.round((sample.current.frames * 1000) / elapsed));
      sample.current = { frames: 0, start: now };
    }
  }, 1);
  return null;
}

function ScreenPlush({ slot }: { slot: PlushRenderSlot }) {
  const group = useRef<Group>(null);
  useEffect(() => () => {
    delete slot.element.dataset.plushReady;
  }, [slot.element]);
  useFrame(({ size }) => {
    const target = group.current;
    if (!target) return;
    const rect = slot.element.getBoundingClientRect();
    target.visible = isOnscreen(rect, size);
    if (!target.visible) return;
    target.position.set(...screenPosition(rect, size));
    if (slot.element.dataset.plushReady !== 'true') slot.element.dataset.plushReady = 'true';
  });
  const scale = plushPixelScale(slot.size);
  return (
    <group ref={group} scale={[scale, scale, scale]}>
      <PlushFriend id={slot.id} mood={slot.mood} landed={slot.landed} reduce={slot.reduce} />
    </group>
  );
}

function ContextLifecycle({ fallback, loseContext }: Pick<Props, 'fallback' | 'loseContext'>) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    const contextLost = (event: Event) => {
      event.preventDefault();
      fallback('webglcontextlost');
    };
    canvas.addEventListener('webglcontextlost', contextLost);
    const timer = loseContext
      ? window.setTimeout(() => gl.getContext().getExtension('WEBGL_lose_context')?.loseContext(), 3000)
      : undefined;
    return () => {
      canvas.removeEventListener('webglcontextlost', contextLost);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [fallback, gl, loseContext]);
  return null;
}

export default function WebGLStage({ fallback, loseContext, onRenderFps, slots }: Props) {
  return (
    <Canvas
      className="three-stage"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 30 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      dpr={1}
      frameloop={slots.some((slot) => !slot.reduce) ? 'always' : 'demand'}
      orthographic
      camera={{ position: [0, 0, 100], near: 0.1, far: 200 }}
      flat
      onCreated={({ gl }) => gl.domElement.setAttribute('aria-hidden', 'true')}
    >
      <ContextLifecycle fallback={fallback} loseContext={loseContext} />
      <ScrollInvalidation />
      <RenderLoop onRenderFps={onRenderFps} slots={slots} />
      <ambientLight intensity={1.75} />
      <directionalLight position={[-2.5, 3.5, 5]} intensity={1.9} />
      <PreparedPlushes slots={slots} />
    </Canvas>
  );
}
