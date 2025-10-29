// Centralized animation tokens for consistent, subtle motion across the app
import type { Transition } from 'framer-motion'

// Durations
export const DURATION = {
  quick: 0.15,
  standard: 0.22,
  slow: 0.35,
}

// Springs
export const SPRING = {
  entrance: { type: 'spring', stiffness: 260, damping: 28 } as Transition,
  overlay: { type: 'spring', stiffness: 280, damping: 30 } as Transition,
  hover: { type: 'spring', stiffness: 340, damping: 26 } as Transition,
  press: { type: 'spring', stiffness: 500, damping: 32 } as Transition,
}

// Tweens
export const TWEEN = {
  page: { duration: DURATION.standard, ease: 'easeOut' } as Transition,
  fast: { duration: DURATION.quick, ease: 'easeOut' } as Transition,
}

// Stagger
export const STAGGER = {
  children: 0.06,
  delayChildren: 0.04,
}
