import { stopTimer } from '../player/player-timing.js';
import { releaseWakeLock } from '../player/wake-lock.js';
import { getNextIncompleteIndex } from '../utils/programme.js';
import { renderDetailsView } from '../render/details.js';
import { renderPrestartView } from '../render/prestart.js';

export function setOverlayState(ctx, isOpen) {
  ctx.elements.body.classList.toggle('overlay-open', isOpen);
}

function bindDetailsAccordionBehaviour(ctx) {
  const accordionCards = Array.from(
    ctx.elements.detailsOverlay.querySelectorAll('.accordion-card')
  );

  accordionCards.forEach(card => {
    card.addEventListener('toggle', () => {
      if (!card.open) return;
      accordionCards.forEach(other => {
        if (other !== card) other.open = false;
      });
    });
  });
}

export function closeDetails(ctx) {
  const shouldReturnToPrestart =
    ctx.state.detailsReturnTarget === 'prestart' &&
    ctx.state.preparedSessionIndex !== null;

  ctx.elements.detailsOverlay.classList.remove('active');
  ctx.state.detailsReturnTarget = null;

  if (shouldReturnToPrestart) {
    ctx.elements.prestartOverlay.classList.add('active');
    setOverlayState(ctx, true);
    return;
  }

  setOverlayState(ctx, false);
}

export function closePrestart(ctx) {
  ctx.elements.prestartOverlay.classList.remove('active');
  ctx.state.preparedSessionIndex = null;
  ctx.state.detailsReturnTarget = null;
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
  ctx.state.detailsReturnTarget = null;
  ctx.state.activeWorkoutSession = null;

  setOverlayState(ctx, false);
}

export function openDetails(ctx, sessionIndex, options = {}) {
  const nextIndex = getNextIncompleteIndex(ctx.state.progress, ctx.schedule);
  if (sessionIndex > nextIndex && nextIndex !== -1) return;

  const ok = renderDetailsView(ctx, sessionIndex, options);
  if (!ok) return;

  ctx.state.detailsReturnTarget = options.returnToPrestart ? 'prestart' : null;

  ctx.elements.detailsOverlay.classList.add('active');
  ctx.elements.detailsOverlay.scrollTop = 0;
  setOverlayState(ctx, true);
}

export function openPrestart(ctx, sessionIndex) {
  const nextIndex = getNextIncompleteIndex(ctx.state.progress, ctx.schedule);
  if (sessionIndex > nextIndex && nextIndex !== -1) return;

  ctx.state.preparedSessionIndex = sessionIndex;
  ctx.state.detailsReturnTarget = null;

  renderPrestartView(ctx, sessionIndex);
  ctx.elements.prestartOverlay.classList.add('active');
  ctx.elements.prestartOverlay.scrollTop = 0;
  setOverlayState(ctx, true);
}

export function startPreparedWorkout(ctx) {
  if (ctx.state.preparedSessionIndex === null) return;

  ctx.elements.prestartOverlay.classList.remove('active');
  ctx.elements.detailsOverlay.classList.remove('active');
  ctx.state.detailsReturnTarget = null;
  ctx.controller.openWorkout(ctx.state.preparedSessionIndex, true);
}

export function openDetailsFromPrestart(ctx) {
  if (ctx.state.preparedSessionIndex === null) return;

  ctx.elements.prestartOverlay.classList.remove('active');
  openDetails(ctx, ctx.state.preparedSessionIndex, {
    showStartButton: true,
    returnToPrestart: true
  });
}

export function bindOverlayActions(ctx) {
  const { elements: els } = ctx;

  bindDetailsAccordionBehaviour(ctx);

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

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;

    if (els.playerOverlay.classList.contains('active')) {
      ctx.controller.closeOverlays();
      return;
    }

    if (els.detailsOverlay.classList.contains('active')) {
      ctx.controller.closeDetails();
      return;
    }

    if (els.prestartOverlay.classList.contains('active')) {
      ctx.controller.closePrestart();
    }
  });
}
