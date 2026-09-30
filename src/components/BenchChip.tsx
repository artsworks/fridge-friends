import { motion, useAnimationControls, useReducedMotion } from 'motion/react';
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Ingredient, Mood } from '../lib/types';
import { useKitchen } from '../state/KitchenContext';
import { homeRect } from '../state/dom';
import { PlushSlot } from '../three/PlushSlot';

interface Props {
  ing: Ingredient;
  celebrating: boolean;
}

export const BenchChip = forwardRef<HTMLLIElement, Props>(function BenchChip({ ing, celebrating }, fwd) {
  const { flights, remove } = useKitchen();
  const reduce = useReducedMotion();
  const controls = useAnimationControls();
  const btn = useRef<HTMLButtonElement>(null);
  const [mood, setMood] = useState<Mood>('excited');
  const [landed, setLanded] = useState(0);

  useLayoutEffect(() => {
    const from = flights.launch.get(ing.id);
    flights.launch.delete(ing.id);
    const el = btn.current;
    if (!from || !el || reduce) {
      controls.set({ opacity: 1, x: 0, y: 0, scale: 1 });
      setMood('bliss');
      return;
    }
    const to = el.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const apex = Math.min(dy, 0) - 48;
    controls.set({ x: dx, y: dy, opacity: 1, scale: 0.9 });
    void controls
      .start({
        x: [dx, dx * 0.5, 0],
        y: [dy, apex, 0],
        rotate: [0, -12, 0],
        transition: { duration: 0.46, ease: ['easeOut', 'easeIn'], times: [0, 0.45, 1] },
      })
      .then(() => {
        setMood('bliss');
        setLanded((n) => n + 1);
        return controls.start({ scaleY: [1, 0.72, 1.08, 1], scaleX: [1, 1.18, 0.96, 1], scale: 1, transition: { duration: 0.38 } });
      });
  }, [controls, flights, ing.id, reduce]);

  useEffect(() => {
    if (!celebrating) return;
    setMood('excited');
    if (!reduce) void controls.start({ y: [0, -18, 0, -8, 0], transition: { duration: 0.9, repeat: 1 } });
    const t = setTimeout(() => setMood('bliss'), 1500);
    return () => clearTimeout(t);
  }, [celebrating, controls, reduce]);

  const back = () => {
    setMood('shock');
    remove(ing.id, homeRect(ing.id, ing.zone));
  };

  return (
    <motion.li
      ref={fwd}
      layout
      className="bench-item"
      initial={{ opacity: 1 }}
      exit="home"
      variants={{
        home: () => {
        const home = flights.home.get(ing.id);
        const el = btn.current;
        if (!home || !el || reduce) return { opacity: 0, scale: 0.4, transition: { duration: 0.2 } };
        const r = el.getBoundingClientRect();
        const dx = home.left + home.width / 2 - (r.left + r.width / 2);
        const dy = home.top + home.height / 2 - (r.top + r.height / 2);
        return {
          x: [0, dx * 0.5, dx],
          y: [0, Math.min(dy, 0) - 40, dy],
          scale: [1, 0.9, 0.4],
          opacity: [1, 1, 0],
          transition: { duration: 0.45, ease: 'easeInOut' },
        };
        },
      }}
    >
      <motion.button
        ref={btn}
        type="button"
        className="bench-chip"
        animate={controls}
        initial={{ opacity: 0 }}
        onClick={back}
        aria-label={`Put ${ing.name} back`}
        whileHover={reduce ? undefined : { y: -4, rotate: -3 }}
        whileTap={{ scale: 0.92 }}
      >
        <PlushSlot id={ing.id} mood={mood} size={68} landed={landed} />
        <span className="chip-name">{ing.name}</span>
        <span className="bench-x" aria-hidden>
          ×
        </span>
      </motion.button>
    </motion.li>
  );
});
