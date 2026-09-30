import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { KawaiiFood } from '../assets/KawaiiFood';
import type { Ingredient, Mood } from '../lib/types';
import { useKitchen } from '../state/KitchenContext';
import { anchors, insideBench } from '../state/dom';
import { PlushSlot } from '../three/PlushSlot';

interface Props {
  ing: Ingredient;
  index: number;
  /** freezer dwell: chips shiver and go frosty after the door has been open a moment */
  frosty?: boolean;
}

export function IngredientChip({ ing, index, frosty = false }: Props) {
  const { state, add, remove } = useKitchen();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const dragged = useRef(false);
  const [hover, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [shock, setShock] = useState(false);
  const onBench = state.bench.includes(ing.id);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    anchors.chips.set(ing.id, el);
    return () => {
      if (anchors.chips.get(ing.id) === el) anchors.chips.delete(ing.id);
    };
  }, [ing.id]);

  useEffect(() => {
    if (!shock) return;
    const t = setTimeout(() => setShock(false), 300);
    return () => clearTimeout(t);
  }, [shock]);

  const rest: Mood = ing.zone === 'pantry' && index % 4 === 1 ? 'sleepy' : frosty ? 'frost' : 'idle';
  const mood: Mood = shock ? 'shock' : dragging ? 'excited' : onBench ? 'bliss' : hover ? 'happy' : rest;

  const toggle = () => {
    if (onBench) remove(ing.id, ref.current);
    else add(ing.id, ref.current);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      className={`chip${onBench ? ' chip--picked' : ''}${dragging ? ' chip--dragging' : ''}`}
      aria-label={onBench ? `${ing.name} is on the bench. Press to put it back` : `Add ${ing.name} to bench`}
      aria-pressed={onBench}
      drag={!onBench}
      dragSnapToOrigin
      dragElastic={0.15}
      dragMomentum={false}
      whileDrag={{ scale: 1.12, rotate: 4, zIndex: 40 }}
      whileHover={reduce ? undefined : { y: -3 }}
      whileTap={{ scale: 0.94 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onDragStart={() => {
        dragged.current = true;
        setDragging(true);
      }}
      onDragEnd={(_, info) => {
        setDragging(false);
        if (insideBench(info.point.x - window.scrollX, info.point.y - window.scrollY)) add(ing.id, ref.current);
        else setShock(true);
      }}
      onClick={() => {
        if (dragged.current) {
          dragged.current = false;
          return;
        }
        toggle();
      }}
      initial={{ opacity: 0, scale: 0.6, y: 8 }}
      animate={
        frosty && !reduce && !dragging
          ? { opacity: 1, scale: 1, y: 0, x: [0, -1, 1, -1, 0] }
          : { opacity: 1, scale: 1, y: 0, x: 0 }
      }
      transition={
        frosty && !reduce
          ? { x: { duration: 0.35, repeat: Infinity, repeatDelay: 2 + (index % 3) }, default: { delay: index * 0.02, type: 'spring', stiffness: 420, damping: 22 } }
          : { delay: index * 0.02, type: 'spring', stiffness: 420, damping: 22 }
      }
    >
      <motion.span
        className="chip-art"
        animate={reduce || dragging ? { scale: 1 } : { scale: [1, 1.015, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: (index % 7) * 0.3 }}
      >
        {dragging ? (
          <PlushSlot id={ing.id} mood="excited" size={60} />
        ) : (
          <KawaiiFood id={ing.id} mood={mood} size={60} shelf={!onBench && !!ing.shelfAsset} />
        )}
      </motion.span>
      <span className="chip-name">{ing.name}</span>
      {onBench && (
        <span className="chip-check" aria-hidden>
          ✓
        </span>
      )}
    </motion.button>
  );
}
