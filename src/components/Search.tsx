import { useId, useRef, useState } from 'react';
import { KawaiiFood } from '../assets/KawaiiFood';
import { resolve } from '../lib/aliases';
import { useKitchen } from '../state/KitchenContext';

export function Search() {
  const { state, add, dispatch } = useKitchen();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const results = q.trim() ? resolve(q).slice(0, 7) : [];
  const open = results.length > 0;

  const choose = (i: number) => {
    const ing = results[i];
    if (!ing) return;
    if (!state.bench.includes(ing.id)) add(ing.id, input.current);
    dispatch({ type: 'openZone', zone: ing.zone });
    setQ('');
    setActive(0);
  };

  return (
    <div className="search">
      <label htmlFor="search-input" className="sr-only">
        Find an ingredient
      </label>
      <input
        ref={input}
        id="search-input"
        type="search"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        placeholder="Find a friend, like scallion or mince"
        autoComplete="off"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setActive(0);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, results.length - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === 'Enter') {
            e.preventDefault();
            choose(active);
          } else if (e.key === 'Escape') setQ('');
        }}
      />
      {open && (
        <ul id={listId} role="listbox" className="search-list" aria-label="Matching ingredients">
          {results.map((ing, i) => {
            const on = state.bench.includes(ing.id);
            return (
              <li
                key={ing.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                className={`search-opt${i === active ? ' is-active' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(i);
                }}
                onMouseEnter={() => setActive(i)}
              >
                <KawaiiFood id={ing.id} size={28} mood={i === active ? 'happy' : 'idle'} />
                <span>{ing.name}</span>
                <span className="muted small">{on ? 'on bench' : ing.zone}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
