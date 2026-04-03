import { getNextIncompleteIndex } from '../utils/programme.js';

export function renderCompletionState(ctx, session, workout) {
  const { elements: els, state, schedule, workoutTemplates } = ctx;

  els.playerMain.style.display = 'none';
  els.playerFooterSticky.style.display = 'none';
  els.completionBox.style.display = 'block';

  els.completionTitle.textContent = `Week ${session.week} Day ${session.day} completed`;
  els.completionText.textContent = `Nice work. ${workout.title} has been logged in your planner.`;

  const nextIndex = getNextIncompleteIndex(state.progress, schedule);
  if (nextIndex === -1) {
    els.completionNext.innerHTML = 'You have completed the full 4-week block. Reset the programme if you want to run it again.';
  } else {
    const next = schedule[nextIndex];
    const nextWorkout = workoutTemplates[next.workoutId];
    els.completionNext.innerHTML = `<strong>Next up:</strong> Week ${next.week} Day ${next.day} - ${nextWorkout.title}. ${next.note || ''}`;
  }

  els.completionEasierBtn.style.display = state.progress.easierMode ? 'none' : 'inline-flex';
}
