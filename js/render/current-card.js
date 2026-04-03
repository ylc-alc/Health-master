import { getDayStateLabel } from '../utils/guards.js';
import {
  getAdjustedExercises,
  getNextIncompleteIndex,
  getWorkoutSettings,
  getWorkoutTimings
} from '../utils/programme.js';

export function renderCurrentCard(ctx) {
  const { elements: els, state, schedule, workoutTemplates, controller } = ctx;
  const nextIndex = getNextIncompleteIndex(state.progress, schedule);

  if (nextIndex === -1) {
    els.currentCard.innerHTML = `
      <div class="current-title">
        <div>
          <div class="status completed">Programme complete</div>
          <h2 style="margin-bottom:6px;">All 16 workouts are completed</h2>
          <p class="subtle" style="margin-bottom:0;">
            You can reset the programme and run the 4-week block again, or keep easier mode on for a lighter repeat block.
          </p>
        </div>
      </div>
      <div class="btn-row" style="margin-top:14px;">
        <button class="btn secondary" id="inlineResetBtn">Reset programme</button>
      </div>
    `;

    els.currentCard.querySelector('#inlineResetBtn')?.addEventListener('click', controller.resetProgramme);
    return;
  }

  const session = schedule[nextIndex];
  const workout = workoutTemplates[session.workoutId];
  const settings = getWorkoutSettings(workout, state.progress);
  const effectiveExercises = getAdjustedExercises(workout, state.progress.dayState);
  const effectiveWorkout = { ...workout, exercises: effectiveExercises };
  const timings = getWorkoutTimings(effectiveWorkout, settings);

  els.currentCard.innerHTML = `
    <div class="current-title">
      <div>
        <div class="status current">Next workout</div>
        <h2 style="margin-bottom:6px;">Week ${session.week} Day ${session.day} - ${workout.title}</h2>
        <p class="subtle" style="margin-bottom:0;">
          ${workout.focus}. Main block: about ${timings.mainLabel}. Total session with warm-up and cool-down:
          about ${timings.totalLabel}.${state.progress.easierMode ? ' Easier mode is on for today.' : ''}
        </p>
        ${session.note ? `<p class="small subtle" style="margin:8px 0 0;">${session.note}</p>` : ''}
        ${state.progress.dayState !== 'standard' ? `<div class="adjustment-chip">${getDayStateLabel(state.progress.dayState)} active</div>` : ''}
      </div>
    </div>
    <div class="btn-row full-width" style="margin-top:14px;">
      <button class="btn" id="startCurrentWorkoutBtn">Start workout</button>
    </div>
  `;

  els.currentCard
    .querySelector('#startCurrentWorkoutBtn')
    ?.addEventListener('click', () => controller.openPrestart(session.index));
}
