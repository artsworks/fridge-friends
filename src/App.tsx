import { AnimatePresence, MotionConfig } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Bench } from './components/Bench';
import { RecipeModal } from './components/RecipeModal';
import { RecipeRail } from './components/RecipeRail';
import { Search } from './components/Search';
import { StaplesRibbon } from './components/StaplesRibbon';
import { ZoneCabinet } from './components/ZoneCabinet';
import { ZONES } from './data/ingredients';
import { setEffectsMode, useEffectsMode } from './lib/effects';
import { rank } from './lib/match';
import { KitchenProvider, useKitchen } from './state/KitchenContext';
import { ThreeStage } from './three/Stage';

const DEMO = ['rice', 'egg', 'spring_onion', 'kimchi', 'soy_sauce', 'sesame_oil'];
const STRESS = ['egg', 'carrot', 'soy_sauce', 'cheese', 'gyoza', 'rice', 'tomato', 'onion', 'garlic', 'chicken', 'milk', 'spring_onion'];

function Kitchen() {
  const { state, dispatch } = useKitchen();
  const effects = useEffectsMode();
  const ranked = useMemo(() => rank(new Set(state.bench)), [state.bench]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [fresh, setFresh] = useState<ReadonlySet<string>>(new Set());
  const [celebrating, setCelebrating] = useState(false);
  const celebrated = useRef(new Set(state.celebrated));

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('stress')) dispatch({ type: 'set', ids: STRESS });
  }, [dispatch]);

  useEffect(() => {
    const now = ranked.filter((r) => r.bucket === 'now').map((r) => r.recipe.id);
    const newOnes = now.filter((id) => !celebrated.current.has(id));
    celebrated.current = new Set(now);
    dispatch({ type: 'celebrated', ids: now });
    if (newOnes.length === 0) return;
    setFresh(new Set(newOnes));
    setCelebrating(true);
    const t = setTimeout(() => {
      setCelebrating(false);
      setFresh(new Set());
    }, 1500);
    return () => clearTimeout(t);
  }, [ranked, dispatch]);

  const open = openId ? ranked.find((r) => r.recipe.id === openId) : undefined;

  return (
    <div className={`app app--${effects}`}>
      <header className="top">
        <h1 className="logo">
          <span aria-hidden className="logo-mark">
            ❄
          </span>
          Fridge Friends
        </h1>
        <Search />
        <button
          type="button"
          className="ghost-btn effects-toggle"
          aria-pressed={effects === 'full'}
          onClick={() => setEffectsMode(effects === 'full' ? 'lite' : 'full')}
        >
          {effects === 'full' ? 'Effects: full' : 'Effects: lite'}
        </button>
      </header>
      <main className="layout">
        <div className="kitchen">
          <div className="zones">
            {ZONES.map((z) => (
              <ZoneCabinet key={z.id} zone={z.id} label={z.label} blurb={z.blurb} />
            ))}
          </div>
          <Bench celebrating={celebrating} />
          <StaplesRibbon />
        </div>
        <RecipeRail
          ranked={ranked}
          benchSize={state.bench.length}
          fresh={fresh}
          onOpen={(r) => setOpenId(r.recipe.id)}
          onDemo={() => dispatch({ type: 'set', ids: DEMO })}
        />
      </main>
      <AnimatePresence>{open && <RecipeModal key={open.recipe.id} r={open} onClose={() => setOpenId(null)} />}</AnimatePresence>
    </div>
  );
}

export function App() {
  const effects = useEffectsMode();
  return (
    <MotionConfig reducedMotion={effects === 'lite' ? 'always' : 'user'}>
      <KitchenProvider>
        <ThreeStage>
          <Kitchen />
        </ThreeStage>
      </KitchenProvider>
    </MotionConfig>
  );
}
