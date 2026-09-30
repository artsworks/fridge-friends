import { KawaiiDish } from '../assets/KawaiiDish';
import { KawaiiFace } from '../assets/KawaiiFace';
import { KawaiiFood } from '../assets/KawaiiFood';
import { SHELF_VARIANT_IDS } from '../assets/bodies';
import { STOCKABLE } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import { STAPLES } from '../data/staples';
import type { Mood } from '../lib/types';

const MOODS: Mood[] = ['idle', 'happy', 'excited', 'bliss', 'sleepy', 'frost', 'shock'];

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <figure className="qa-cell">
      {children}
      <figcaption>{label}</figcaption>
    </figure>
  );
}

export function AssetGallery() {
  return (
    <main className="qa">
      <header className="qa-head">
        <h1>Fridge Friends · asset QA</h1>
        <p>
          {STOCKABLE.length} bodies · {SHELF_VARIANT_IDS.length} shelf variants · {RECIPES.length} dishes · {STAPLES.length} staples ·{' '}
          {MOODS.length} moods. <a href="./">back to the kitchen</a>
        </p>
      </header>
      <h2>Moods</h2>
      <div className="qa-grid">
        {MOODS.map((m) => (
          <Cell key={m} label={m}>
            <svg viewBox="0 0 96 96" width={88} height={88} aria-hidden>
              <circle cx={48} cy={50} r={36} fill="#FFF9EE" stroke="#3A2E2A" strokeWidth={3.5} />
              <KawaiiFace mood={m} x={48} y={50} s={1.1} />
            </svg>
          </Cell>
        ))}
        <Cell label="egg · every mood">
          <div className="qa-row">
            {MOODS.map((m) => (
              <KawaiiFood key={m} id="egg" mood={m} size={40} />
            ))}
          </div>
        </Cell>
      </div>
      {(['fridge', 'pantry', 'freezer'] as const).map((z) => (
        <section key={z}>
          <h2>{z}</h2>
          <div className="qa-grid">
            {STOCKABLE.filter((i) => i.zone === z).map((i) => (
              <Cell key={i.id} label={i.id}>
                <KawaiiFood id={i.id} size={88} />
              </Cell>
            ))}
          </div>
        </section>
      ))}
      <h2>Shelf variants</h2>
      <div className="qa-grid">
        {SHELF_VARIANT_IDS.map((id) => (
          <Cell key={id} label={id}>
            <KawaiiFood id={id} size={88} />
          </Cell>
        ))}
      </div>
      <h2>Staples</h2>
      <div className="qa-grid">
        {STAPLES.map((s) => (
          <Cell key={s.id} label={s.id}>
            <KawaiiFood id={s.id} size={88} />
          </Cell>
        ))}
      </div>
      <h2>Dishes</h2>
      <div className="qa-grid">
        {RECIPES.map((r) => (
          <Cell key={r.id} label={r.id}>
            <KawaiiDish id={r.dishAsset} size={120} />
          </Cell>
        ))}
      </div>
    </main>
  );
}
