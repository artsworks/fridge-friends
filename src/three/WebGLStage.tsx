import { PerformanceMonitor } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import { PlushFriend } from './PlushFriend';
import { isOnscreen, plushPixelScale, screenPosition } from './screenLayout';
import type { PlushRenderSlot } from './Stage';

interface Props {
  dpr: number;
  sharp: number;
  setDpr: (dpr: number) => void;
  fallback: (reason: string) => void;
  loseContext: boolean;
  slots: PlushRenderSlot[];
}

function ScreenPlush({ slot }: { slot: PlushRenderSlot }) {
  const group = useRef<Group>(null);
  useFrame(({ size }) => {
    const target = group.current;
    if (!target) return;
    const rect = slot.element.getBoundingClientRect();
    target.visible = isOnscreen(rect, size);
    if (!target.visible) return;
    target.position.set(...screenPosition(rect, size));
  });
  const scale = plushPixelScale(slot.size);
  return (
    <group ref={group} scale={[scale, scale, scale]}>
      <PlushFriend id={slot.id} mood={slot.mood} landed={slot.landed} reduce={slot.reduce} />
    </group>
  );
}

export default function WebGLStage({ dpr, sharp, setDpr, fallback, loseContext, slots }: Props) {
  return (
    <Canvas
      className="three-stage"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 30 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      dpr={dpr}
      orthographic
      camera={{ position: [0, 0, 100], near: 0.1, far: 200 }}
      flat
      onCreated={({ gl }) => {
        const el = gl.domElement;
        el.setAttribute('aria-hidden', 'true');
        el.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          fallback('webglcontextlost');
        });
        if (loseContext) {
          setTimeout(() => gl.getContext().getExtension('WEBGL_lose_context')?.loseContext(), 3000);
        }
      }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(sharp)} flipflops={1} onFallback={() => setDpr(1)}>
        <ambientLight intensity={1.75} />
        <directionalLight position={[-2.5, 3.5, 5]} intensity={1.9} />
        {slots.map((slot) => <ScreenPlush key={slot.key} slot={slot} />)}
      </PerformanceMonitor>
    </Canvas>
  );
}
