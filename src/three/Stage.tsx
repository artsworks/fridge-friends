import { PerformanceMonitor, View } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Component, createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type RenderMode = '3d' | 'svg';

interface StageState {
  mode: RenderMode;
  /** why we are on SVG, for the dev overlay and QA notes */
  reason: string | null;
}

const StageCtx = createContext<StageState>({ mode: 'svg', reason: 'no provider' });

export const useStage = (): StageState => useContext(StageCtx);

const params = () => new URLSearchParams(window.location.search);

function initial(): StageState {
  if (params().has('svg')) return { mode: 'svg', reason: 'forced by ?svg' };
  if (typeof WebGL2RenderingContext === 'undefined') return { mode: 'svg', reason: 'no WebGL2' };
  return { mode: '3d', reason: null };
}

class CanvasBoundary extends Component<{ onFail: (why: string) => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(e: unknown) {
    this.props.onFail(`renderer error: ${e instanceof Error ? e.message : String(e)}`);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function FpsMeter() {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      frames++;
      if (now - last >= 1000) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <output className="fps" aria-live="off">
      {fps} fps
    </output>
  );
}

/**
 * One WebGL context for the whole app. Every 3D chip is a drei <View> that
 * scissors into this single fixed, click-through canvas.
 */
export function ThreeStage({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StageState>(initial);
  const fallback = (reason: string) => setState({ mode: 'svg', reason });
  const showFps = params().has('fps');
  const sharp = Math.min(2, Math.max(1.5, window.devicePixelRatio));
  const [dpr, setDpr] = useState(sharp);

  return (
    <StageCtx.Provider value={state}>
      {children}
      {state.mode === '3d' && (
        <CanvasBoundary onFail={fallback}>
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
              if (params().has('losecontext')) {
                setTimeout(() => gl.getContext().getExtension('WEBGL_lose_context')?.loseContext(), 3000);
              }
            }}
          >
            <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(sharp)} flipflops={3} onFallback={() => setDpr(1)}>
              <View.Port />
            </PerformanceMonitor>
          </Canvas>
        </CanvasBoundary>
      )}
      {showFps && (
        <div className="stage-debug">
          <FpsMeter /> <span>dpr {dpr} · </span><span>{state.mode === '3d' ? '3D plush' : `SVG (${state.reason})`}</span>
        </div>
      )}
    </StageCtx.Provider>
  );
}
