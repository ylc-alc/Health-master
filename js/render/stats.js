import { getDayStateLabel, normalizeDayState } from '../utils/guards.js';
import { getVisibleWeek } from '../utils/programme.js';

export function renderStats(ctx) {
  const { elements: els, state, schedule } = ctx;

  const done = Object.keys(state.progress.completed).length;
  const remaining = schedule.length - done;
  const visibleWeek = getVisibleWeek(state.progress, schedule);

  els.doneCount.textContent = done;
  els.remainingCount.textContent = remaining;
  els.weekCount.textContent = visibleWeek;

  const modeBits = [];
  if (state.progress.easierMode) modeBits.push('Easier mode is on.');
  if ((state.progress.dayState || 'standard') !== 'standard') {
    modeBits.push(`${getDayStateLabel(state.progress.dayState)} selected.`);
  }
  modeBits.push('Progress and settings are stored only in this browser using local storage.');

  els.modeNote.textContent = modeBits.join(' ');
  els.easierModeToggle.checked = Boolean(state.progress.easierMode);
  els.audioToggle.checked = state.audioEnabled;
  els.dayStateSelect.value = normalizeDayState(state.progress.dayState || 'standard');
}
