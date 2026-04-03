import { initState } from './state.js';
import { bindProgrammeActions } from './actions/programme-actions.js';
import { bindOverlayActions } from './actions/overlay-actions.js';
import { bindImportExport } from './actions/import-export.js';
import { renderAll } from './render/index.js';

function initApp() {
  initState();
  bindProgrammeActions();
  bindOverlayActions();
  bindImportExport();
  renderAll();
}

initApp();
