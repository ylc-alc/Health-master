import { STORAGE_KEY, DEFAULT_PROGRESS } from './config.js';
import { normalizeDayState } from './utils/guards.js';

export function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { ...DEFAULT_PROGRESS };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      completed: parsed && parsed.completed ? parsed.completed : {},
      easierMode: Boolean(parsed && parsed.easierMode),
      dayState: normalizeDayState(parsed && parsed.dayState ? parsed.dayState : 'standard'),
      audioEnabled: parsed && parsed.audioEnabled === false ? false : true
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function downloadProgress(progress) {
  const payload = JSON.stringify(progress, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `workout-progress-${date}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function readImportedProgress(file) {
  if (!file) {
    throw new Error('No file selected.');
  }

  const text = await file.text();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON.');
  }

  return {
    completed: parsed && parsed.completed ? parsed.completed : {},
    easierMode: Boolean(parsed && parsed.easierMode),
    dayState: normalizeDayState(parsed && parsed.dayState ? parsed.dayState : 'standard'),
    audioEnabled: parsed && parsed.audioEnabled === false ? false : true
  };
}
