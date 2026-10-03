import { useId, useLayoutEffect, useRef } from 'react';
import { KawaiiFood } from '../assets/KawaiiFood';
import type { PlushProps } from './PlushFriend';
import { PLUSH } from './plushSpecs';
import { usePlushRegistry } from './Stage';

export default function PlushView({ size, ...props }: PlushProps & { size: number }) {
  const element = useRef<HTMLSpanElement>(null);
  const key = useId();
  const setSlot = usePlushRegistry();

  useLayoutEffect(() => {
    if (!element.current || !PLUSH[props.id]) return;
    setSlot(key, { key, element: element.current, size, landed: props.landed ?? 0, reduce: props.reduce ?? false, id: props.id, mood: props.mood });
    return () => setSlot(key, null);
  }, [key, props.id, props.landed, props.mood, props.reduce, setSlot, size]);

  if (!PLUSH[props.id]) return <KawaiiFood id={props.id} mood={props.mood} size={size} />;
  return <span ref={element} className="plush-slot" style={{ width: size, height: size }} aria-hidden />;
}
