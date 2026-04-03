import { workoutTemplates } from './data/workout-templates.js';
import { schedule } from './data/schedule.js';
import { state, cacheDom } from './state.js';
import { loadProgress, saveProgress, downloadProgress, readImportedProgress } from './storage.js';
import { normalizeDayState, getDayStateLabel } from './utils/guards.js';
import { formatApproxMinutes, formatDate, formatTime } from './utils/format.js';

const els = cacheDom();

state.progress = loadProgress();
state.progress.dayState = normalizeDayState(state.progress.dayState);
state.audioEnabled = state.progress.audioEnabled !== false;

async function requestWakeLock() {
  if (!('wakeLock' in navigator)) return;

  try {
    state.wakeLockSentinel = await navigator.wakeLock.request('screen');
    els.wakelockBadge.classList.add('active');
    state.wakeLockSentinel.addEventListener('release', () => {
      els.wakelockBadge.classList.remove('active');
    });
  } catch (_) {
    // fail silently
  }
}

async function releaseWakeLock() {
  if (state.wakeLockSentinel) {
    try {
      await state.wakeLockSentinel.release();
    } catch (_) {}
    state.wakeLockSentinel = null;
  }
  els.wakelockBadge.classList.remove('active');
}

document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible' && state.running && !state.wakeLockSentinel) {
    await requestWakeLock();
  }
});

function getAudioCtx() {
  if (!state.audioCtx) {
    try {
      state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (_) {
      return null;
    }
  }

  if (state.audioCtx.state === 'suspended') {
    state.audioCtx.resume();
  }

  return state.audioCtx;
}

function playTone(frequency, duration, type = 'sine', volume = 0.35) {
  if (!state.audioEnabled) return;

  const ctx = getAudioCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration + 0.05);
}

function beepCountdown() {
  playTone(880, 0.12, 'square', 0.22);
}

function beepTransition() {
  playTone(523, 0.12, 'sine', 0.3);
  setTimeout(() => playTone(784, 0.18, 'sine', 0.3), 100);
}

function beepRoundRest() {
  playTone(659, 0.15, 'sine', 0.28);
  setTimeout(() => playTone(494, 0.25, 'sine', 0.28), 130);
}

function beepWorkoutStart() {
  playTone(523, 0.08, 'sine', 0.28);
  setTimeout(() => playTone(659, 0.08, 'sine', 0.28), 100);
  setTimeout(() => playTone(784, 0.18, 'sine', 0.35), 200);
}

function beepComplete() {
  playTone(523, 0.2, 'sine', 0.3);
  setTimeout(() => playTone(659, 0.2, 'sine', 0.28), 60);
  setTimeout(() => playTone(784, 0.35, 'sine', 0.25), 120);
}

function getNextIncompleteIndex() {
  return schedule.findIndex(s => !state.progress.completed[s.key]);
}

function isCompleted(key) {
  return Boolean(state.progress.completed[key]);
}

function getVisibleWeek() {
  const nextIndex = getNextIncompleteIndex();
  if (nextIndex === -1) return 4;
  return schedule[nextIndex].week;
}

function isLockedSession(session, nextIndex) {
  if (nextIndex === -1) return false;
  if (session.index < nextIndex) return false;
  return session.index > nextIndex;
}

function adjustExerciseName(name) {
  const dayState = normalizeDayState(state.progress.dayState);

  if (dayState === 'low_energy') {
    if (name.includes('Fast feet')) return 'March in place with arm drive';
    if (name.includes('Mountain climber')) return 'Standing knee drive march';
    if (name.includes('Kneeling push-up')) return 'Wall push-up';
    if (name.includes('Reverse lunge')) return 'Static split squat hold';
    if (name.includes('Split squat')) return 'Reduced-range split squat';
    if (name.includes('Tempo squat with pulse')) return 'Tempo squat';
    if (name.includes('Wall sit')) return 'Bridge hold';
    if (name.includes('Fast punch combo')) return 'March and punch';
    if (name.includes('Bicycle crunch')) return 'Dead bug';
  }

  if (dayState === 'joint_friendly') {
    if (name.includes('Mountain climber')) return 'Dead bug';
    if (name.includes('Bicycle crunch')) return 'Dead bug heel tap';
    if (name.includes('Plank shoulder tap')) return 'Wall shoulder tap';
    if (name.includes('Forearm plank')) return 'Forearm plank from knees';
    if (name.includes('Kneeling push-up')) return 'Wall push-up';
    if (name.includes('Reverse lunge')) return 'Static split squat short range';
    if (name.includes('Split squat')) return 'Staggered squat short range';
    if (name.includes('Wall sit')) return 'Glute bridge hold';
    if (name.includes('Fast punch combo')) return 'Tall punch combo';
  }

  return name;
}

function getAdjustedExercises(workout) {
  return workout.exercises.map(ex => ({ ...ex, name: adjustExerciseName(ex.name) }));
}

function getWorkoutSettings(workout) {
  const settings = { ...workout.settings, easierMode: false };

  if (state.progress.easierMode) {
    settings.rounds = Math.max(3, settings.rounds - 1);
    settings.work = Math.max(35, settings.work - 10);
    settings.rest = settings.rest + 5;
    settings.roundRest = settings.roundRest + 15;
    settings.easierMode = true;
  }

  if (normalizeDayState(state.progress.dayState) === 'low_energy') {
    settings.rounds = Math.max(3, settings.rounds - 1);
    settings.work = Math.max(35, settings.work - 5);
    settings.rest = settings.rest + 5;
    settings.roundRest = settings.roundRest + 15;
  }

  if (normalizeDayState(state.progress.dayState) === 'joint_friendly') {
    settings.rest = settings.rest + 5;
  }

  return settings;
}

function getWorkoutTimings(workout, settings) {
  const warmupSeconds = workout.warmup.reduce((sum, item) => sum + item.seconds, 0);
  const exerciseCount = workout.exercises.length;
  const mainSeconds =
    settings.rounds * ((exerciseCount * settings.work) + ((exerciseCount - 1) * settings.rest)) +
    ((settings.rounds - 1) * settings.roundRest);
  const cooldownSeconds = settings.cooldown || 0;

  return {
    warmupSeconds,
    mainSeconds,
    cooldownSeconds,
    totalSeconds: warmupSeconds + mainSeconds + cooldownSeconds,
    mainLabel: formatApproxMinutes(mainSeconds),
    totalLabel: formatApproxMinutes(warmupSeconds + mainSeconds + cooldownSeconds)
  };
}

function setOverlayState(isOpen) {
  els.body.classList.toggle('overlay-open', isOpen);
}

function closePrestart() {
  els.prestartOverlay.classList.remove('active');
  state.preparedSessionIndex = null;
  setOverlayState(false);
}

function closeOverlays() {
  state.running = false;
  clearInterval(state.intervalId);
  releaseWakeLock();

  els.detailsOverlay.classList.remove('active');
  els.playerOverlay.classList.remove('active');
  els.prestartOverlay.classList.remove('active');

  state.preparedSessionIndex = null;
  setOverlayState(false);
}

function resetProgramme() {
  if (!confirm('Reset all workout progress and settings in this browser?')) return;

  state.progress = {
    completed: {},
    easierMode: false,
    dayState: 'standard',
    audioEnabled: true
  };

  state.audioEnabled = true;
  saveProgress(state.progress);
  renderAll();
}

function renderCurrentCard() {
  const nextIndex = getNextIncompleteIndex();

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

    document.getElementById('inlineResetBtn').onclick = resetProgramme;
    return;
  }

  const session = schedule[nextIndex];
  const workout = workoutTemplates[session.workoutId];
  const settings = getWorkoutSettings(workout);
  const effectiveExercises = getAdjustedExercises(workout);
  const timings = getWorkoutTimings({ ...workout, exercises: effectiveExercises }, settings);

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

  document.getElementById('startCurrentWorkoutBtn').onclick = () => openPrestart(session.index);
}

function renderStats() {
  const done = Object.keys(state.progress.completed).length;
  const remaining = schedule.length - done;
  const visibleWeek = getVisibleWeek();

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

function renderPlanner() {
  const nextIndex = getNextIncompleteIndex();
  const visibleWeek = getVisibleWeek();

  els.plannerTitle.textContent = `Week ${visibleWeek} planner`;
  els.planner.innerHTML = '';

  schedule
    .filter(s => s.week === visibleWeek)
    .forEach(session => {
      const workout = workoutTemplates[session.workoutId];
      const done = isCompleted(session.key);
      const isCurrent = session.index === nextIndex;
      const locked = !done && isLockedSession(session, nextIndex);
      const history = state.progress.completed[session.key];

      const tile = document.createElement('div');
      tile.className = `session-tile ${done ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${locked ? 'locked' : ''}`;
      tile.innerHTML = `
        <div>
          <div class="status ${done ? 'completed' : isCurrent ? 'current' : 'locked'}">${done ? 'Completed' : isCurrent ? 'Current' : 'Locked'}</div>
          <div style="display:flex;align-items:center;">
            <span class="checkmark ${done ? 'done' : ''}">${done ? '✓' : ''}</span>
            <div>
              <div class="tile-title">Day ${session.day}</div>
              <div class="tile-meta">${workout.title}</div>
            </div>
          </div>
          <div class="small subtle">${workout.focus}</div>
          <div class="small subtle" style="margin:6px 0 0;">Main block: ${workout.mainDuration}</div>
          <div class="small subtle" style="margin:2px 0 6px;">Total session: ${workout.totalDuration}</div>
          ${session.note ? `<div class="small subtle">${session.note}</div>` : ''}
          ${history ? `<div class="history-chip">Done on ${formatDate(history.completedAt)}</div>` : ''}
        </div>
        <div class="btn-row">
          <button class="btn secondary" data-session-index="${session.index}" data-view="1" ${locked ? 'disabled' : ''}>View</button>
        </div>
      `;

      els.planner.appendChild(tile);
    });

  els.planner.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', e => {
      if (e.target.disabled) return;
      openDetails(Number(e.target.dataset.sessionIndex));
    });
  });
}

function buildSegments(workout, settings) {
  const segments = [];

  workout.warmup.forEach(item => {
    segments.push({
      phase: 'Warm-up',
      label: item.name,
      seconds: item.seconds,
      cue: item.cue
    });
  });

  for (let round = 1; round <= settings.rounds; round += 1) {
    workout.exercises.forEach((ex, idx) => {
      segments.push({
        phase: 'Main set',
        round,
        totalRounds: settings.rounds,
        label: ex.name,
        seconds: settings.work,
        cue: ex.cue
      });

      const isLastExercise = idx === workout.exercises.length - 1;
      if (!isLastExercise) {
        segments.push({
          phase: 'Rest',
          round,
          totalRounds: settings.rounds,
          label: 'Rest',
          seconds: settings.rest,
          cue: 'Reset and prepare for the next movement.'
        });
      }
    });

    if (round < settings.rounds) {
      segments.push({
        phase: 'Round rest',
        round,
        totalRounds: settings.rounds,
        label: 'Round rest',
        seconds: settings.roundRest,
        cue: 'Take a longer reset before the next round.'
      });
    }
  }

  return segments;
}

function openDetails(sessionIndex) {
  const session = schedule[sessionIndex];
  const nextIndex = getNextIncompleteIndex();

  if (sessionIndex > nextIndex && nextIndex !== -1) return;

  const workout = workoutTemplates[session.workoutId];
  const settings = getWorkoutSettings(workout);
  const timings = getWorkoutTimings(workout, settings);
  const effectiveExercises = getAdjustedExercises(workout);

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
    <div class="small subtle" style="margin-top:8px;">${session.note || ''}</div>
  `;

  els.detailsFocus.textContent = workout.coachingFocus;
  els.detailsProgression.innerHTML = workout.progression.map(item => `<li>${item}</li>`).join('');
  els.detailsWarmup.innerHTML = workout.warmup.map(item => `<li>${item.name} - ${item.seconds}s. ${item.cue}</li>`).join('');
  els.detailsExercises.innerHTML = effectiveExercises.map(item => `<li>${item.name}. ${item.cue}</li>`).join('');
  els.detailsCooldown.innerHTML = workout.cooldown.map(item => `<li>${item}</li>`).join('');
  els.detailsEasier.textContent = workout.easierModeNote;
  els.detailsSubsEnergy.innerHTML = workout.substitutions.energy.map(item => `<li>${item}</li>`).join('');
  els.detailsSubsJoint.innerHTML = workout.substitutions.joint.map(item => `<li>${item}</li>`).join('');

  els.detailsStartBtn.style.display = 'none';
  els.detailsOverlay.classList.add('active');
  setOverlayState(true);
}

function openPrestart(sessionIndex) {
  const nextIndex = getNextIncompleteIndex();
  if (sessionIndex > nextIndex && nextIndex !== -1) return;

  const session = schedule[sessionIndex];
  const workout = workoutTemplates[session.workoutId];
  const settings = getWorkoutSettings(workout);
  const effectiveExercises = getAdjustedExercises(workout);
  const timings = getWorkoutTimings(workout, settings);

  state.preparedSessionIndex = sessionIndex;

  els.prestartTitle.textContent = `Week ${session.week} Day ${session.day} - ${workout.title}`;
  els.prestartMeta.textContent = `${workout.focus} • Main block about ${timings.mainLabel} • Total about ${timings.totalLabel}`;
  els.prestartSummary.innerHTML = `
    <div>
      <span class="badge">${workout.equipment}</span>
      <span class="badge">${settings.rounds} rounds</span>
      <span class="badge">${settings.work}s work / ${settings.rest}s rest</span>
    </div>
    <div class="small subtle" style="margin-top:10px;">${session.note || workout.coachingFocus}</div>
    <div class="small" style="margin-top:10px;">
      <strong>Warm-up:</strong> about ${formatApproxMinutes(timings.warmupSeconds)} •
      <strong>Main block:</strong> about ${timings.mainLabel} •
      <strong>Cool-down:</strong> about ${formatApproxMinutes(timings.cooldownSeconds)}
    </div>
  `;

  els.prestartAdjustment.textContent =
    normalizeDayState(state.progress.dayState) === 'low_energy'
      ? 'Low energy day is active. The session will use a lighter pattern and slightly lower density today.'
      : normalizeDayState(state.progress.dayState) === 'joint_friendly'
      ? 'Joint-friendly day is active. A few movements will be swapped and recovery will be slightly longer today.'
      : state.progress.easierMode
      ? 'Easier mode is active. The session will run at a lighter overall density today.'
      : 'Standard mode is active. You can still change today’s adjustment from the main page before you start.';

  els.prestartPreview.innerHTML = effectiveExercises
    .map(item => `<li>${item.name} <span class="subtle">- ${item.cue}</span></li>`)
    .join('');

  els.prestartOverlay.classList.add('active');
  setOverlayState(true);
}

function startPreparedWorkout() {
  if (state.preparedSessionIndex === null) return;
  els.prestartOverlay.classList.remove('active');
  openWorkout(state.preparedSessionIndex, true);
}

function openDetailsFromPrestart() {
  if (state.preparedSessionIndex === null) return;
  els.prestartOverlay.classList.remove('active');
  openDetails(state.preparedSessionIndex);
  els.detailsStartBtn.style.display = 'inline-flex';
}

function openWorkout(sessionIndex, autoStart) {
  const nextIndex = getNextIncompleteIndex();
  if (sessionIndex > nextIndex && nextIndex !== -1) return;

  const session = schedule[sessionIndex];
  const workout = workoutTemplates[session.workoutId];
  const settings = getWorkoutSettings(workout);
  const effectiveExercises = getAdjustedExercises(workout);
  const effectiveWorkout = { ...workout, exercises: effectiveExercises };
  const segments = buildSegments(effectiveWorkout, settings);

  state.activeWorkoutSession = { session, workout: effectiveWorkout, settings, segments };
  state.currentSegmentIndex = 0;
  state.running = false;
  clearInterval(state.intervalId);
  state.secondsLeft = segments[0].seconds;

  els.playerWorkoutTitle.textContent = `Week ${session.week} Day ${session.day} — ${workout.title}`;
  els.completionBox.style.display = 'none';
  els.playerMain.style.display = 'flex';
  els.playerFooterSticky.style.display = 'block';
  els.completionEasierBtn.style.display = state.progress.easierMode ? 'none' : 'inline-flex';

  updatePlayerUI();
  els.playerOverlay.classList.add('active');
  setOverlayState(true);

  if (autoStart) togglePlayPause();
}

function updatePlayerUI() {
  if (!state.activeWorkoutSession) return;

  const seg = state.activeWorkoutSession.segments[state.currentSegmentIndex];
  els.playerPhaseLabel.textContent = seg.phase;
  els.exerciseName.textContent = seg.label;
  els.exerciseCue.textContent = seg.cue;

  const metaLabel = !seg.round
    ? 'Warm-up'
    : (seg.phase === 'Rest' || seg.phase === 'Round rest')
      ? `${seg.phase} — Round ${seg.round} of ${seg.totalRounds}`
      : `Round ${seg.round} of ${seg.totalRounds}`;

  els.segmentMeta.textContent = metaLabel;
  els.timerText.textContent = formatTime(state.secondsLeft);

  const progressPct = ((seg.seconds - state.secondsLeft) / seg.seconds) * 100;
  els.phaseProgress.style.width = `${Math.max(0, Math.min(100, progressPct))}%`;

  const isRest = seg.phase === 'Rest' || seg.phase === 'Round rest';

  if (isRest) {
    const nextSeg = state.activeWorkoutSession.segments[state.currentSegmentIndex + 1];
    els.nextUpBox.style.display = 'block';
    els.nextUpBox.innerHTML = nextSeg
      ? `<strong>Up next:</strong> ${nextSeg.label}`
      : '<strong>Up next:</strong> Cool-down';
  } else {
    els.nextUpBox.style.display = 'none';
  }

  els.playPauseBtn.textContent = state.running ? 'Pause' : 'Start';
}

function advanceSegment() {
  if (!state.activeWorkoutSession) return;

  state.currentSegmentIndex += 1;

  if (state.currentSegmentIndex >= state.activeWorkoutSession.segments.length) {
    state.running = false;
    clearInterval(state.intervalId);
    releaseWakeLock();

    els.playPauseBtn.textContent = 'Start';
    els.nextUpBox.style.display = 'none';
    els.playerPhaseLabel.textContent = 'Workout finished';
    els.exerciseName.textContent = 'Cool-down';
    els.exerciseCue.textContent = 'Walk it off, stretch lightly, then mark the workout complete.';
    els.timerText.textContent = '00:00';
    els.phaseProgress.style.width = '100%';
    els.segmentMeta.textContent = 'All rounds done';
    beepComplete();
    return;
  }

  const nextSeg = state.activeWorkoutSession.segments[state.currentSegmentIndex];

  if (nextSeg.phase === 'Round rest') {
    beepRoundRest();
  } else {
    beepTransition();
  }

  state.secondsLeft = nextSeg.seconds;
  updatePlayerUI();
}

function togglePlayPause() {
  if (!state.activeWorkoutSession) return;

  if (state.running) {
    state.running = false;
    clearInterval(state.intervalId);
    releaseWakeLock();
    updatePlayerUI();
    return;
  }

  state.running = true;
  requestWakeLock();
  beepWorkoutStart();
  updatePlayerUI();

  state.intervalId = setInterval(() => {
    state.secondsLeft -= 1;

    if (state.secondsLeft > 0 && state.secondsLeft <= 3) {
      beepCountdown();
      els.timerText.classList.remove('countdown-flash');
      void els.timerText.offsetWidth;
      els.timerText.classList.add('countdown-flash');
    }

    if (state.secondsLeft <= 0) {
      advanceSegment();
      if (!state.running) clearInterval(state.intervalId);
    } else {
      updatePlayerUI();
    }
  }, 1000);
}

function skipSegment() {
  advanceSegment();
}

function showCompletionState(session, workout) {
  els.playerMain.style.display = 'none';
  els.playerFooterSticky.style.display = 'none';
  els.completionBox.style.display = 'block';

  els.completionTitle.textContent = `Week ${session.week} Day ${session.day} completed`;
  els.completionText.textContent = `Nice work. ${workout.title} has been logged in your planner.`;

  const nextIndex = getNextIncompleteIndex();
  if (nextIndex === -1) {
    els.completionNext.innerHTML = 'You have completed the full 4-week block. Reset the programme if you want to run it again.';
  } else {
    const next = schedule[nextIndex];
    const nextWorkout = workoutTemplates[next.workoutId];
    els.completionNext.innerHTML = `<strong>Next up:</strong> Week ${next.week} Day ${next.day} - ${nextWorkout.title}. ${next.note || ''}`;
  }
}

function completeWorkout() {
  if (!state.activeWorkoutSession) return;

  const { session, workout } = state.activeWorkoutSession;
  state.progress.completed[session.key] = {
    completedAt: new Date().toISOString(),
    workoutId: workout.id
  };

  saveProgress(state.progress);
  renderAll();
  showCompletionState(session, workout);
}

function repeatActiveSession() {
  if (!state.activeWorkoutSession) return;
  const idx = state.activeWorkoutSession.session.index;
  openWorkout(idx, false);
}

function renderAll() {
  renderCurrentCard();
  renderStats();
  renderPlanner();
}

function bindEvents() {
  els.resetPlanBtn.addEventListener('click', resetProgramme);
  els.closePrestartBtn.addEventListener('click', closePrestart);
  els.beginWorkoutBtn.addEventListener('click', startPreparedWorkout);
  els.prestartDetailsBtn.addEventListener('click', openDetailsFromPrestart);

  els.easierModeToggle.addEventListener('change', e => {
    state.progress.easierMode = Boolean(e.target.checked);
    saveProgress(state.progress);
    renderAll();
  });

  els.audioToggle.addEventListener('change', e => {
    state.audioEnabled = Boolean(e.target.checked);
    state.progress.audioEnabled = state.audioEnabled;
    saveProgress(state.progress);
    if (state.audioEnabled) beepTransition();
  });

  els.dayStateSelect.addEventListener('change', e => {
    state.progress.dayState = normalizeDayState(e.target.value);
    saveProgress(state.progress);
    renderAll();
  });

  els.exportBtn.addEventListener('click', () => {
    downloadProgress(state.progress);
  });

  els.importFileInput.addEventListener('change', async e => {
    try {
      const imported = await readImportedProgress(e.target.files[0]);
      state.progress = imported;
      state.progress.dayState = normalizeDayState(state.progress.dayState);
      state.audioEnabled = state.progress.audioEnabled !== false;
      saveProgress(state.progress);
      renderAll();
      alert('Progress imported successfully.');
    } catch (err) {
      alert(err.message || 'Import failed.');
    } finally {
      e.target.value = '';
    }
  });

  els.closeDetailsBtn.addEventListener('click', () => {
    els.detailsOverlay.classList.remove('active');
    setOverlayState(false);
  });

  els.detailsStartBtn.addEventListener('click', () => {
    if (state.preparedSessionIndex === null) return;
    els.detailsOverlay.classList.remove('active');
    openWorkout(state.preparedSessionIndex, true);
  });

  els.closePlayerBtn.addEventListener('click', closeOverlays);
  els.playPauseBtn.addEventListener('click', togglePlayPause);
  els.skipBtn.addEventListener('click', skipSegment);
  els.completeBtn.addEventListener('click', completeWorkout);
  els.closeCompletionBtn.addEventListener('click', closeOverlays);
  els.repeatSessionBtn.addEventListener('click', repeatActiveSession);

  els.completionEasierBtn.addEventListener('click', () => {
    state.progress.easierMode = true;
    saveProgress(state.progress);
    renderAll();
    els.completionEasierBtn.style.display = 'none';
  });

  els.detailsOverlay.addEventListener('click', e => {
    if (e.target.id === 'detailsOverlay') {
      els.detailsOverlay.classList.remove('active');
      setOverlayState(false);
    }
  });

  els.prestartOverlay.addEventListener('click', e => {
    if (e.target.id === 'prestartOverlay') closePrestart();
  });

  els.playerOverlay.addEventListener('click', e => {
    if (e.target.id === 'playerOverlay') closeOverlays();
  });
}

bindEvents();
renderAll();
