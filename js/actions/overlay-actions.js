import { stopTimer } from '../player/player-timing.js';
import { releaseWakeLock } from '../player/wake-lock.js';
import { getNextIncompleteIndex } from '../utils/programme.js';
import { renderDetailsView } from '../render/details.js';
import { renderPrestartView } from '../render/prestart.js';

export function setOverlayState(ctx, isOpen) {
  ctx.elements.body.classList.toggle('overlay-open', isOpen);
}

export function closeDetails(ctx) {
  ctx.elements.detailsOverlay.classList.remove('active');
  setOverlayState(ctx, false);
}

export function closePrestart(ctx) {
  ctx.elements.prestartOverlay.classList.remove('active');
  ctx.state.preparedSessionIndex = null;
  setOverlayState(ctx, false);
}

export async function closeOverlays(ctx) {
  ctx.state.running = false;
  stopTimer(ctx);
  await releaseWakeLock(ctx);

  ctx.elements.detailsOverlay.classList.remove('active');
  ctx.elements.playerOverlay.classList.remove('active');
  ctx.elements.prestartOverlay.classList.remove('active');

  ctx.state.preparedSessionIndex = null;
  ctx.state.activeWorkoutSession = null;
  setOverlayState(ctx, false);
}

export function openDetails(ctx, sessionIndex, options = {}) {
  const nextIndex = getNextIncompleteIndex(ctx.state.progress, ctx.schedule);
  if (sessionIndex > nextIndex && nextIndex !== -1) return;

  const ok = renderDetailsView(ctx, sessionIndex, options);
  if (!ok) return;

  ctx.elements.detailsOverlay.classList.add('active');
  setOverlayState(ctx, true);
}

export function openPrestart(ctx, sessionIndex) {
  const nextIndex = getNextIncompleteIndex(ctx.state.progress, ctx.schedule);
  if (sessionIndex > nextIndex && nextIndex !== -1) return;

  ctx.state.preparedSessionIndex = sessionIndex;
  renderPrestartView(ctx, sessionIndex);
  ctx.elements.prestartOverlay.classList.add('active');
  setOverlayState(ctx, true);
}

export function startPreparedWorkout(ctx) {
  if (ctx.state.preparedSessionIndex === null) return;

  ctx.elements.prestartOverlay.classList.remove('active');
  ctx.elements.detailsOverlay.classList.remove('active');
  ctx.controller.openWorkout(ctx.state.preparedSessionIndex, true);
}

export function openDetailsFromPrestart(ctx) {
  if (ctx.state.preparedSessionIndex === null) return;

  ctx.elements.prestartOverlay.classList.remove('active');
  openDetails(ctx, ctx.state.preparedSessionIndex, { showStartButton: true });
}

export function bindOverlayActions(ctx) {
  const { elements: els } = ctx;

  els.closeDetailsBtn.addEventListener('click', () => ctx.controller.closeDetails());
  els.closePrestartBtn.addEventListener('click', () => ctx.controller.closePrestart());
  els.beginWorkoutBtn.addEventListener('click', () => ctx.controller.startPreparedWorkout());
  els.prestartDetailsBtn.addEventListener('click', () => ctx.controller.openDetailsFromPrestart());
  els.detailsStartBtn.addEventListener('click', () => ctx.controller.startPreparedWorkout());

  els.detailsOverlay.addEventListener('click', e => {
    if (e.target.id === 'detailsOverlay') ctx.controller.closeDetails();
  });

  els.prestartOverlay.addEventListener('click', e => {
    if (e.target.id === 'prestartOverlay') ctx.controller.closePrestart();
  });

  els.playerOverlay.addEventListener('click', e => {
    if (e.target.id === 'playerOverlay') ctx.controller.closeOverlays();
  });
}
