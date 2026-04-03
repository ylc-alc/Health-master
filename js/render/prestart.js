import { getDayStateLabel, normalizeDayState } from '../utils/guards.js';
import {
  getAdjustedExercises,
  getWorkoutSettings,
  getWorkoutTimings
} from '../utils/programme.js';

function minutesLabel(seconds) {
  return `${Math.max(1, Math.round(seconds / 60))} min`;
}

export function renderPrestartView(ctx, sessionIndex) {
  const { elements: els, state, schedule, workoutTemplates } = ctx;

  const session = schedule[sessionIndex];
  const workout = workoutTemplates[session.workoutId];
  const settings = getWorkoutSettings(workout, state.progress);
  const effectiveExercises = getAdjustedExercises(workout, state.progress.dayState);
  const effectiveWorkout = { ...workout, exercises: effectiveExercises };
  const timings = getWorkoutTimings(effectiveWorkout, settings);
  const dayState = normalizeDayState(state.progress.dayState);

  els.prestartTitle.textContent = `Week ${session.week} Day ${session.day} - ${workout.title}`;
  els.prestartMeta.textContent = `${workout.focus} • Main block about ${timings.mainLabel} • Total about ${timings.totalLabel}`;

  els.prestartPills.innerHTML = `
    <span class="badge">${workout.equipment}</span>
    <span class="badge">${settings.rounds} rounds</span>
    <span class="badge">${settings.work}s work / ${settings.rest}s rest</span>
    ${state.progress.easierMode ? `<span class="badge">Easier mode</span>` : ''}
    ${dayState !== 'standard' ? `<span class="badge">${getDayStateLabel(dayState)}</span>` : ''}
  `;

  els.prestartStats.innerHTML = `
    <div class="prestart-stat">
      <div class="prestart-stat-label">Warm-up</div>
      <div class="prestart-stat-value">${minutesLabel(timings.warmupSeconds)}</div>
    </div>
    <div class="prestart-stat">
      <div class="prestart-stat-label">Main block</div>
      <div class="prestart-stat-value">${timings.mainLabel}</div>
    </div>
    <div class="prestart-stat">
      <div class="prestart-stat-label">Total</div>
      <div class="prestart-stat-value">${timings.totalLabel}</div>
    </div>
  `;

  els.prestartSummary.innerHTML = `
    <p style="margin:0 0 10px;"><strong>${workout.focus}</strong></p>
    <p class="subtle" style="margin:0 0 10px;">${session.note || workout.coachingFocus}</p>
    <p style="margin:0;">This preview shows the training structure before you begin so the live player can stay focused on the timer, the current movement, and the next step.</p>
  `;

  els.prestartFocus.innerHTML = `
    <strong>Coaching focus:</strong> ${workout.coachingFocus}
  `;

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
