import { Component, createContext, lazy, Suspense, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Mood } from '../lib/types';
import { initialMode, type StageState } from './renderMode';

const WebGLStage = lazy(() => import('./WebGLStage'));

const StageCtx = createContext<StageState>({ mode: 'svg', reason: 'no provider' });

export interface PlushRenderSlot {
  key: string;
  element: HTMLElement;
  id: string;
  mood: Mood;
  size: number;
  landed: number;
  reduce: boolean;
}

type SetPlushSlot = (key: string, slot: PlushRenderSlot | null) => void;
const PlushRegistryCtx = createContext<SetPlushSlot>(() => undefined);

export const useStage = (): StageState => useContext(StageCtx);
export const usePlushRegistry = (): SetPlushSlot => useContext(PlushRegistryCtx);

const params = () => new URLSearchParams(window.location.search);

function initial(): StageState {
  return initialMode(window.location.search, typeof WebGL2RenderingContext !== 'undefined');
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
 * One fixed, click-through WebGL scene renders every registered 3D chip.
 */
export function ThreeStage({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StageState>(initial);
  const fallback = (reason: string) => setState({ mode: 'svg', reason });
  const showFps = params().has('fps');
  const sharp = Math.min(2, Math.max(1.5, window.devicePixelRatio));
  const [dpr, setDpr] = useState(sharp);
  const [slots, setSlots] = useState<PlushRenderSlot[]>([]);
  const registry = useState(() => new Map<string, PlushRenderSlot>())[0];
  const setPlushSlot = useCallback<SetPlushSlot>((key, slot) => {
    if (slot) registry.set(key, slot);
    else registry.delete(key);
    setSlots([...registry.values()]);
  }, [registry]);

  return (
    <StageCtx.Provider value={state}>
      <PlushRegistryCtx.Provider value={setPlushSlot}>{children}</PlushRegistryCtx.Provider>
      {state.mode === '3d' && (
        <CanvasBoundary onFail={fallback}>
          <Suspense fallback={null}>
            <WebGLStage dpr={dpr} sharp={sharp} setDpr={setDpr} fallback={fallback} loseContext={params().has('losecontext')} slots={slots} />
          </Suspense>
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
