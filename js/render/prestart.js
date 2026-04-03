import { normalizeDayState } from '../utils/guards.js';
import {
  getAdjustedExercises,
  getWorkoutSettings,
  getWorkoutTimings
} from '../utils/programme.js';

export function renderPrestartView(ctx, sessionIndex) {
  const { elements: els, state, schedule, workoutTemplates } = ctx;

  const session = schedule[sessionIndex];
  const workout = workoutTemplates[session.workoutId];
  const settings = getWorkoutSettings(workout, state.progress);
  const effectiveExercises = getAdjustedExercises(workout, state.progress.dayState);
  const effectiveWorkout = { ...workout, exercises: effectiveExercises };
  const timings = getWorkoutTimings(effectiveWorkout, settings);

  els.prestartTitle.textContent = `Week ${session.week} Day ${session.day} - ${workout.title}`;
  els.prestartMeta.textContent = `${workout.focus} • Main block about ${timings.mainLabel} • Total about ${timings.totalLabel}`;
  els.prestartSummary.innerHTML = `
    <div>
      <span class="badge">${workout.equipment}</span>
      <span class="badge">${settings.rounds} rounds</span>
      <span class="badge">${settings.work}s work / ${settings.rest}s rest</span>
    </div>
    <div class="small subtle" style="margin-top:10px;">${session.note || workout.coachingFocus}</div>
    <div class="small" style="margin-top:10px;">
      <strong>Warm-up:</strong> about ${timings.warmupSeconds ? Math.max(1, Math.round(timings.warmupSeconds / 60)) : 0} min •
      <strong>Main block:</strong> about ${timings.mainLabel} •
      <strong>Cool-down:</strong> about ${timings.cooldownSeconds ? Math.max(1, Math.round(timings.cooldownSeconds / 60)) : 0} min
    </div>
  `;

  const dayState = normalizeDayState(state.progress.dayState);
  els.prestartAdjustment.textContent =
    dayState === 'low_energy'
      ? 'Low energy day is active. The session will use a lighter pattern and slightly lower density today.'
      : dayState === 'joint_friendly'
      ? 'Joint-friendly day is active. A few movements will be swapped and recovery will be slightly longer today.'
      : state.progress.easierMode
      ? 'Easier mode is active. The session will run at a lighter overall density today.'
      : 'Standard mode is active. You can still change today’s adjustment from the main page before you start.';

  els.prestartPreview.innerHTML = effectiveExercises
    .map(item => `<li>${item.name} <span class="subtle">- ${item.cue}</span></li>`)
    .join('');
}
