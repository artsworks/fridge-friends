import type { Mood } from '../lib/types';
import { ACCEPTANCE, PLUSH } from '../three/plushSpecs';
import { PlushSlot } from '../three/PlushSlot';
import { ThreeStage } from '../three/Stage';

const MOODS: Mood[] = ['idle', 'happy', 'excited', 'bliss', 'frost'];

/** Dev-only `?plush` page: 3D PlushFriend beside its SVG twin, plus the full 3D roster. */
export function PlushLab() {
  const all = Object.keys(PLUSH);
  return (
    <ThreeStage>
      <main className="qa">
        <h1>PlushFriend A/B</h1>
        <p className="muted">The 3D models on the left share one scene. Their SVG twins are on the right.</p>
        <div className="ab-grid">
          {ACCEPTANCE.map((id) => (
            <figure key={id} className="ab-pair">
              <div className="ab-cell">
                <PlushSlot id={id} mood="happy" size={150} />
              </div>
              <div className="ab-cell">
                <PlushSlot id={id} mood="happy" size={150} svg />
              </div>
              <figcaption>{id}</figcaption>
            </figure>
          ))}
        </div>
        <h2>Moods (egg)</h2>
        <div className="qa-row">
          {MOODS.map((m) => (
            <figure key={m} className="qa-cell">
              <PlushSlot id="egg" mood={m} size={96} />
              <figcaption>{m}</figcaption>
            </figure>
          ))}
        </div>
        <h2>Roster ({all.length})</h2>
        <div className="qa-row">
          {all.map((id) => (
            <figure key={id} className="qa-cell">
              <PlushSlot id={id} mood="idle" size={80} />
              <figcaption>{id}</figcaption>
            </figure>
          ))}
        </div>
      </main>
    </ThreeStage>
  );
}
