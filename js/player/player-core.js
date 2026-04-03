import { formatTime } from '../utils/format.js';
import {
  buildSegments,
  getAdjustedExercises,
  getNextIncompleteIndex,
  getWorkoutSettings
} from '../utils/programme.js';
import { renderCompletionState } from '../render/completion.js';
import { startTimer, stopTimer } from './player-timing.js';
import {
  playCompleteTone,
  playCountdownTone,
  playRoundRestTone,
  playTransitionTone,
  playWorkoutStartTone
} from './player-audio.js';
import { requestWakeLock, releaseWakeLock } from './wake-lock.js';

export function openWorkout(ctx, sessionIndex, autoStart = false) {
  const nextIndex = getNextIncompleteIndex(ctx.state.progress, ctx.schedule);
  if (sessionIndex > nextIndex && nextIndex !== -1) return;

  const session = ctx.schedule[sessionIndex];
  const workout = ctx.workoutTemplates[session.workoutId];
  const settings = getWorkoutSettings(workout, ctx.state.progress);
  const effectiveExercises = getAdjustedExercises(workout, ctx.state.progress.dayState);
  const effectiveWorkout = { ...workout, exercises: effectiveExercises };
  const segments = buildSegments(effectiveWorkout, settings);

  ctx.state.activeWorkoutSession = { session, workout: effectiveWorkout, settings, segments };
  ctx.state.currentSegmentIndex = 0;
  ctx.state.running = false;
  stopTimer(ctx);
  ctx.state.secondsLeft = segments[0].seconds;

  ctx.elements.playerWorkoutTitle.textContent = `Week ${session.week} Day ${session.day} — ${workout.title}`;
  ctx.elements.completionBox.style.display = 'none';
  ctx.elements.playerMain.style.display = 'flex';
  ctx.elements.playerFooterSticky.style.display = 'block';

  updatePlayerUI(ctx);
  ctx.elements.playerOverlay.classList.add('active');
  ctx.controller.setOverlayState(true);

  if (autoStart) {
    togglePlayPause(ctx);
  }
}

export function updatePlayerUI(ctx) {
  if (!ctx.state.activeWorkoutSession) return;

  const seg = ctx.state.activeWorkoutSession.segments[ctx.state.currentSegmentIndex];
  ctx.elements.playerPhaseLabel.textContent = seg.phase;
  ctx.elements.exerciseName.textContent = seg.label;
  ctx.elements.exerciseCue.textContent = seg.cue;

  const metaLabel = !seg.round
    ? 'Warm-up'
    : (seg.phase === 'Rest' || seg.phase === 'Round rest')
      ? `${seg.phase} — Round ${seg.round} of ${seg.totalRounds}`
      : `Round ${seg.round} of ${seg.totalRounds}`;

  ctx.elements.segmentMeta.textContent = metaLabel;
  ctx.elements.timerText.textContent = formatTime(ctx.state.secondsLeft);

  const progressPct = ((seg.seconds - ctx.state.secondsLeft) / seg.seconds) * 100;
  ctx.elements.phaseProgress.style.width = `${Math.max(0, Math.min(100, progressPct))}%`;

  const isRest = seg.phase === 'Rest' || seg.phase === 'Round rest';

  if (isRest) {
    const nextSeg = ctx.state.activeWorkoutSession.segments[ctx.state.currentSegmentIndex + 1];
    ctx.elements.nextUpBox.style.display = 'block';
    ctx.elements.nextUpBox.innerHTML = nextSeg
      ? `<strong>Up next:</strong> ${nextSeg.label}`
      : '<strong>Up next:</strong> Cool-down';
  } else {
    ctx.elements.nextUpBox.style.display = 'none';
  }

  ctx.elements.playPauseBtn.textContent = ctx.state.running ? 'Pause' : 'Start';
}

function advanceSegment(ctx) {
  if (!ctx.state.activeWorkoutSession) return;

  ctx.state.currentSegmentIndex += 1;

  if (ctx.state.currentSegmentIndex >= ctx.state.activeWorkoutSession.segments.length) {
    ctx.state.running = false;
    stopTimer(ctx);
    releaseWakeLock(ctx);

    ctx.elements.playPauseBtn.textContent = 'Start';
    ctx.elements.nextUpBox.style.display = 'none';
    ctx.elements.playerPhaseLabel.textContent = 'Workout finished';
    ctx.elements.exerciseName.textContent = 'Cool-down';
    ctx.elements.exerciseCue.textContent = 'Walk it off, stretch lightly, then tap Complete.';
    ctx.elements.timerText.textContent = '00:00';
    ctx.elements.phaseProgress.style.width = '100%';
    ctx.elements.segmentMeta.textContent = 'All rounds done';
    playCompleteTone(ctx);
    return;
  }

  const nextSeg = ctx.state.activeWorkoutSession.segments[ctx.state.currentSegmentIndex];

  if (nextSeg.phase === 'Round rest') {
    playRoundRestTone(ctx);
  } else {
    playTransitionTone(ctx);
  }

  ctx.state.secondsLeft = nextSeg.seconds;
  updatePlayerUI(ctx);
}

export function togglePlayPause(ctx) {
  if (!ctx.state.activeWorkoutSession) return;

  if (ctx.state.running) {
    ctx.state.running = false;
    stopTimer(ctx);
    releaseWakeLock(ctx);
    updatePlayerUI(ctx);
    return;
  }

  ctx.state.running = true;
  requestWakeLock(ctx);
  playWorkoutStartTone(ctx);
  updatePlayerUI(ctx);

  startTimer(ctx, () => {
    ctx.state.secondsLeft -= 1;

    if (ctx.state.secondsLeft > 0 && ctx.state.secondsLeft <= 3) {
      playCountdownTone(ctx);
      ctx.elements.timerText.classList.remove('countdown-flash');
      void ctx.elements.timerText.offsetWidth;
      ctx.elements.timerText.classList.add('countdown-flash');
    }

    if (ctx.state.secondsLeft <= 0) {
      advanceSegment(ctx);
      if (!ctx.state.running) stopTimer(ctx);
    } else {
      updatePlayerUI(ctx);
    }
  });
}

export function skipSegment(ctx) {
  advanceSegment(ctx);
}

export async function completeWorkout(ctx) {
  if (!ctx.state.activeWorkoutSession) return;

  ctx.state.running = false;
  stopTimer(ctx);
  await releaseWakeLock(ctx);

  const { session, workout } = ctx.state.activeWorkoutSession;

  ctx.state.progress.completed[session.key] = {
    completedAt: new Date().toISOString(),
    workoutId: workout.id
  };

  ctx.storage.saveProgress(ctx.state.progress);
  ctx.controller.renderAll();
  renderCompletionState(ctx, session, workout);
}

export function repeatActiveSession(ctx) {
  if (!ctx.state.activeWorkoutSession) return;
  const idx = ctx.state.activeWorkoutSession.session.index;
  openWorkout(ctx, idx, false);
}

export function bindPlayerControls(ctx) {
  const { elements: els } = ctx;

  els.closePlayerBtn.addEventListener('click', () => ctx.controller.closeOverlays());
  els.playPauseBtn.addEventListener('click', () => togglePlayPause(ctx));
  els.skipBtn.addEventListener('click', () => skipSegment(ctx));
  els.completeBtn.addEventListener('click', () => completeWorkout(ctx));
  els.closeCompletionBtn.addEventListener('click', () => ctx.controller.closeOverlays());
  els.repeatSessionBtn.addEventListener('click', () => repeatActiveSession(ctx));

  els.completionEasierBtn.addEventListener('click', () => {
    ctx.state.progress.easierMode = true;
    ctx.storage.saveProgress(ctx.state.progress);
    ctx.controller.renderAll();
    els.completionEasierBtn.style.display = 'none';
  });
}
