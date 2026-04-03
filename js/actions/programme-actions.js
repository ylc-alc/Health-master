import { playTransitionTone } from '../player/player-audio.js';
import { normalizeDayState } from '../utils/guards.js';

export function resetProgramme(ctx) {
  if (!confirm('Reset all workout progress and settings in this browser?')) return;

  ctx.state.progress = {
    completed: {},
    easierMode: false,
    dayState: 'standard',
    audioEnabled: true
  };

  ctx.state.audioEnabled = true;
  ctx.storage.saveProgress(ctx.state.progress);
  ctx.controller.renderAll();
}

export function bindProgrammeActions(ctx) {
  const { elements: els, state } = ctx;

  els.resetPlanBtn.addEventListener('click', ctx.controller.resetProgramme);

  els.easierModeToggle.addEventListener('change', e => {
    state.progress.easierMode = Boolean(e.target.checked);
    ctx.storage.saveProgress(state.progress);
    ctx.controller.renderAll();
  });

  els.audioToggle.addEventListener('change', e => {
    state.audioEnabled = Boolean(e.target.checked);
    state.progress.audioEnabled = state.audioEnabled;
    ctx.storage.saveProgress(state.progress);
    if (state.audioEnabled) playTransitionTone(ctx);
  });

  els.dayStateSelect.addEventListener('change', e => {
    state.progress.dayState = normalizeDayState(e.target.value);
    ctx.storage.saveProgress(state.progress);
    ctx.controller.renderAll();
  });
}
