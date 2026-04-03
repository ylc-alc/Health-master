import { getDayStateLabel } from '../utils/guards.js';
import {
  getAdjustedExercises,
  getNextIncompleteIndex,
  getWorkoutSettings,
  getWorkoutTimings
} from '../utils/programme.js';

export function renderDetailsView(ctx, sessionIndex, { showStartButton = false } = {}) {
  const { elements: els, state, schedule, workoutTemplates } = ctx;
  const nextIndex = getNextIncompleteIndex(state.progress, schedule);

  if (sessionIndex > nextIndex && nextIndex !== -1) return false;

  const session = schedule[sessionIndex];
  const workout = workoutTemplates[session.workoutId];
  const settings = getWorkoutSettings(workout, state.progress);
  const effectiveExercises = getAdjustedExercises(workout, state.progress.dayState);
  const effectiveWorkout = { ...workout, exercises: effectiveExercises };
  const timings = getWorkoutTimings(effectiveWorkout, settings);

  els.detailsTitle.textContent = `Week ${session.week} Day ${session.day} - ${workout.title}`;
  els.detailsMeta.textContent =
    `${workout.focus} • Main block about ${timings.mainLabel} • Total about ${timings.totalLabel}` +
    `${settings.easierMode ? ' • Easier mode active' : ''}` +
    `${state.progress.dayState !== 'standard' ? ` • ${getDayStateLabel(state.progress.dayState)}` : ''}`;

  els.detailsDesign.innerHTML = `
    <div>
      <span class="badge">${workout.equipment}</span>
      <span class="badge">${settings.rounds} rounds</span>
      <span class="badge">${settings.work}s work / ${settings.rest}s rest</span>
      <span class="badge">Total about ${timings.totalLabel}</span>
      ${state.progress.dayState !== 'standard' ? `<span class="badge">${getDayStateLabel(state.progress.dayState)}</span>` : ''}
    </div>
    <div class="small subtle" style="margin-top:10px;">${session.note || ''}</div>
  `;

  els.detailsFocus.textContent = workout.coachingFocus;
  els.detailsProgression.innerHTML = workout.progression.map(item => `<li>${item}</li>`).join('');
  els.detailsWarmup.innerHTML = workout.warmup.map(item => `<li>${item.name} - ${item.seconds}s. ${item.cue}</li>`).join('');
  els.detailsExercises.innerHTML = effectiveExercises.map(item => `<li>${item.name}. ${item.cue}</li>`).join('');
  els.detailsCooldown.innerHTML = workout.cooldown.map(item => `<li>${item}</li>`).join('');
  els.detailsEasier.textContent = workout.easierModeNote;
  els.detailsSubsEnergy.innerHTML = workout.substitutions.energy.map(item => `<li>${item}</li>`).join('');
  els.detailsSubsJoint.innerHTML = workout.substitutions.joint.map(item => `<li>${item}</li>`).join('');

  els.detailsStartBtn.style.display = showStartButton ? 'inline-flex' : 'none';

  els.detailsOverlay.querySelectorAll('.accordion-card').forEach(card => {
    card.open = false;
  });

  return true;
}
