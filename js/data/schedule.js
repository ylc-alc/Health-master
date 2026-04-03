export const schedule = [
  { week: 1, day: 1, workoutId: 'full_body_foundation', note: 'Start smoothly. Learn the exercise order and pacing.' },
  { week: 1, day: 2, workoutId: 'cardio_core_foundation', note: 'Use low-impact rhythm, not all-out speed.' },
  { week: 1, day: 3, workoutId: 'lower_body_foundation', note: 'Treat tempo as the main challenge, not weight.' },
  { week: 1, day: 4, workoutId: 'upper_body_foundation', note: 'Keep the trunk still while the arms work.' },
  { week: 2, day: 1, workoutId: 'full_body_foundation', note: 'Smoother transitions. Aim to settle into all 4 rounds.' },
  { week: 2, day: 2, workoutId: 'cardio_core_foundation', note: 'Hold posture better in the final plank and fast-feet blocks.' },
  { week: 2, day: 3, workoutId: 'lower_body_foundation', note: 'Slightly cleaner depth and stronger glute lockout.' },
  { week: 2, day: 4, workoutId: 'upper_body_foundation', note: 'Use more deliberate pauses on press and row.' },
  { week: 3, day: 1, workoutId: 'full_body_progression', note: 'Longer bouts start here. Keep quality before pace.' },
  { week: 3, day: 2, workoutId: 'cardio_core_progression', note: 'Raise demand through sharper arm drive and trunk control.' },
  { week: 3, day: 3, workoutId: 'lower_body_progression', note: 'The leg session is denser. Stay balanced and controlled.' },
  { week: 3, day: 4, workoutId: 'upper_body_progression', note: 'More time under tension. Do not rush the lowering phase.' },
  { week: 4, day: 1, workoutId: 'full_body_progression', note: 'Consolidation week. Stay crisp rather than chasing fatigue.' },
  { week: 4, day: 2, workoutId: 'cardio_core_progression', note: 'Consolidation week. Keep breathing steady in the hardest blocks.' },
  { week: 4, day: 3, workoutId: 'lower_body_progression', note: 'Consolidation week. Use control over range if legs feel heavy.' },
  { week: 4, day: 4, workoutId: 'upper_body_progression', note: 'Consolidation week. Clean execution is the finish line.' }
].map((s, index) => ({ ...s, index, key: `week${s.week}_day${s.day}` }));
