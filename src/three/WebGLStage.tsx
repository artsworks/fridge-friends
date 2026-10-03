import { PerformanceMonitor, View } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

interface Props {
  dpr: number;
  sharp: number;
  setDpr: (dpr: number) => void;
  fallback: (reason: string) => void;
  loseContext: boolean;
}

export default function WebGLStage({ dpr, sharp, setDpr, fallback, loseContext }: Props) {
  return (
    <Canvas
      className="three-stage"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 30 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      dpr={dpr}
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
        <View.Port />
      </PerformanceMonitor>
    </Canvas>
  );
}
