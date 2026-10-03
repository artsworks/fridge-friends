import { createContext, useContext, useEffect, useReducer, useRef, useState, type ReactNode } from 'react';
import { load, save, type Persisted } from '../lib/persist';
import type { Zone } from '../lib/types';

export type KitchenState = Persisted;

export type Action =
  | { type: 'add'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'set'; ids: string[] }
  | { type: 'clear' }
  | { type: 'openZone'; zone: Zone | null }
  | { type: 'celebrated'; ids: string[] };

export function reducer(s: KitchenState, a: Action): KitchenState {
  switch (a.type) {
    case 'add':
      return s.bench.includes(a.id) ? s : { ...s, bench: [...s.bench, a.id] };
    case 'remove':
      return { ...s, bench: s.bench.filter((x) => x !== a.id) };
    case 'set':
      return { ...s, bench: [...new Set(a.ids)] };
    case 'clear':
      return { ...s, bench: [], celebrated: [] };
    case 'openZone':
      return { ...s, openZone: a.zone };
    case 'celebrated':
      return { ...s, celebrated: a.ids };
  }
}

const INITIAL: KitchenState = { bench: [], openZone: 'fridge', celebrated: [] };

/** Screen rects captured at the moment of an add/remove so chips can arc between places. */
export interface FlightLog {
  launch: Map<string, DOMRect>;
  home: Map<string, DOMRect>;
}

interface Ctx {
  state: KitchenState;
  dispatch: React.Dispatch<Action>;
  flights: FlightLog;
  add: (id: string, from?: Element | DOMRect | null) => void;
  remove: (id: string, to?: Element | DOMRect | null) => void;
  draggingId: string | null;
  setDraggingId: React.Dispatch<React.SetStateAction<string | null>>;
}

const KitchenCtx = createContext<Ctx | null>(null);

const rectOf = (x?: Element | DOMRect | null) => (x ? (x instanceof DOMRect ? x : x.getBoundingClientRect()) : null);

export function KitchenProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL, () => load() ?? INITIAL);
  const flights = useRef<FlightLog>({ launch: new Map(), home: new Map() }).current;
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => save(state), [state]);

  const add = (id: string, from?: Element | DOMRect | null) => {
    const r = rectOf(from);
    if (r) flights.launch.set(id, r);
    dispatch({ type: 'add', id });
  };
  const remove = (id: string, to?: Element | DOMRect | null) => {
    const r = rectOf(to);
    if (r) flights.home.set(id, r);
    else flights.home.delete(id);
    dispatch({ type: 'remove', id });
  };

  return <KitchenCtx.Provider value={{ state, dispatch, flights, add, remove, draggingId, setDraggingId }}>{children}</KitchenCtx.Provider>;
}

export function useKitchen(): Ctx {
  const c = useContext(KitchenCtx);
  if (!c) throw new Error('useKitchen outside KitchenProvider');
  return c;
}
