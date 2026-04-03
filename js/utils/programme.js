import { normalizeDayState } from './guards.js';
import { formatApproxMinutes } from './format.js';

export function getNextIncompleteIndex(progress, schedule) {
  return schedule.findIndex(s => !progress.completed[s.key]);
}

export function isCompleted(progress, key) {
  return Boolean(progress.completed[key]);
}

export function getVisibleWeek(progress, schedule) {
  const nextIndex = getNextIncompleteIndex(progress, schedule);
  if (nextIndex === -1) return 4;
  return schedule[nextIndex].week;
}

export function isLockedSession(session, nextIndex) {
  if (nextIndex === -1) return false;
  if (session.index < nextIndex) return false;
  return session.index > nextIndex;
}

export function adjustExerciseName(name, dayState) {
  const value = normalizeDayState(dayState);

  if (value === 'low_energy') {
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

  if (value === 'joint_friendly') {
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

export function getAdjustedExercises(workout, dayState) {
  return workout.exercises.map(ex => ({ ...ex, name: adjustExerciseName(ex.name, dayState) }));
}

export function getWorkoutSettings(workout, progress) {
  const settings = { ...workout.settings, easierMode: false };
  const dayState = normalizeDayState(progress.dayState);

  if (progress.easierMode) {
    settings.rounds = Math.max(3, settings.rounds - 1);
    settings.work = Math.max(35, settings.work - 10);
    settings.rest = settings.rest + 5;
    settings.roundRest = settings.roundRest + 15;
    settings.easierMode = true;
  }

  if (dayState === 'low_energy') {
    settings.rounds = Math.max(3, settings.rounds - 1);
    settings.work = Math.max(35, settings.work - 5);
    settings.rest = settings.rest + 5;
    settings.roundRest = settings.roundRest + 15;
  }

  if (dayState === 'joint_friendly') {
    settings.rest = settings.rest + 5;
  }

  return settings;
}

export function getWorkoutTimings(workout, settings) {
  const warmupSeconds = workout.warmup.reduce((sum, item) => sum + item.seconds, 0);
  const exerciseCount = workout.exercises.length;
  const mainSeconds =
    settings.rounds * ((exerciseCount * settings.work) + ((exerciseCount - 1) * settings.rest)) +
    ((settings.rounds - 1) * settings.roundRest);
  const cooldownSeconds = workout.settings.cooldown || 0;

  return {
    warmupSeconds,
    mainSeconds,
    cooldownSeconds,
    totalSeconds: warmupSeconds + mainSeconds + cooldownSeconds,
    mainLabel: formatApproxMinutes(mainSeconds),
    totalLabel: formatApproxMinutes(warmupSeconds + mainSeconds + cooldownSeconds)
  };
}

export function buildSegments(workout, settings) {
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
