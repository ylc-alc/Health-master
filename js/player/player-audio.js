function getAudioCtx(ctx) {
  if (!ctx.state.audioCtx) {
    try {
      ctx.state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (_) {
      return null;
    }
  }

  if (ctx.state.audioCtx.state === 'suspended') {
    ctx.state.audioCtx.resume();
  }

  return ctx.state.audioCtx;
}

function playTone(ctx, frequency, duration, type = 'sine', volume = 0.35) {
  if (!ctx.state.audioEnabled) return;

  const audioCtx = getAudioCtx(ctx);
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration + 0.05);
}

export function playCountdownTone(ctx) {
  playTone(ctx, 880, 0.12, 'square', 0.22);
}

export function playTransitionTone(ctx) {
  playTone(ctx, 523, 0.12, 'sine', 0.3);
  setTimeout(() => playTone(ctx, 784, 0.18, 'sine', 0.3), 100);
}

export function playRoundRestTone(ctx) {
  playTone(ctx, 659, 0.15, 'sine', 0.28);
  setTimeout(() => playTone(ctx, 494, 0.25, 'sine', 0.28), 130);
}

export function playWorkoutStartTone(ctx) {
  playTone(ctx, 523, 0.08, 'sine', 0.28);
  setTimeout(() => playTone(ctx, 659, 0.08, 'sine', 0.28), 100);
  setTimeout(() => playTone(ctx, 784, 0.18, 'sine', 0.35), 200);
}

export function playCompleteTone(ctx) {
  playTone(ctx, 523, 0.2, 'sine', 0.3);
  setTimeout(() => playTone(ctx, 659, 0.2, 'sine', 0.28), 60);
  setTimeout(() => playTone(ctx, 784, 0.35, 'sine', 0.25), 120);
}
