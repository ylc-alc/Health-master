import { workoutTemplates } from './data/workout-templates.js';
import { schedule } from './data/schedule.js';
import { state, cacheDom } from './state.js';
import {
  loadProgress,
  saveProgress,
  downloadProgress,
  readImportedProgress
} from './storage.js';

import { renderAll } from './render/index.js';

import {
  bindProgrammeActions,
  resetProgramme
} from './actions/programme-actions.js';

import {
  bindImportExport
} from './actions/import-export.js';

import {
  bindOverlayActions,
  closeDetails,
  closeOverlays,
  closePrestart,
  openDetails,
  openDetailsFromPrestart,
  openPrestart,
  setOverlayState,
  startPreparedWorkout
} from './actions/overlay-actions.js';

import {
  bindPlayerControls,
  openWorkout
} from './player/player-core.js';

import { bindWakeLockVisibility } from './player/wake-lock.js';

const elements = cacheDom();

state.progress = loadProgress();
state.audioEnabled = state.progress.audioEnabled !== false;

const ctx = {
  state,
  elements,
  schedule,
  workoutTemplates,
  storage: {
    loadProgress,
    saveProgress,
    downloadProgress,
    readImportedProgress
  },
  controller: {}
};

ctx.controller = {
  renderAll: () => renderAll(ctx),
  resetProgramme: () => resetProgramme(ctx),
  setOverlayState: isOpen => setOverlayState(ctx, isOpen),
  closeDetails: () => closeDetails(ctx),
  closePrestart: () => closePrestart(ctx),
  closeOverlays: () => closeOverlays(ctx),
  openDetails: (sessionIndex, options = {}) => openDetails(ctx, sessionIndex, options),
  openPrestart: sessionIndex => openPrestart(ctx, sessionIndex),
  startPreparedWorkout: () => startPreparedWorkout(ctx),
  openDetailsFromPrestart: () => openDetailsFromPrestart(ctx),
  openWorkout: (sessionIndex, autoStart = false) => openWorkout(ctx, sessionIndex, autoStart)
};

bindProgrammeActions(ctx);
bindImportExport(ctx);
bindOverlayActions(ctx);
bindPlayerControls(ctx);
bindWakeLockVisibility(ctx);

renderAll(ctx);
