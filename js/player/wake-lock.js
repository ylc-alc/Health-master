export async function requestWakeLock(ctx) {
  if (!('wakeLock' in navigator)) return;

  try {
    ctx.state.wakeLockSentinel = await navigator.wakeLock.request('screen');
    ctx.elements.wakelockBadge.classList.add('active');

    ctx.state.wakeLockSentinel.addEventListener('release', () => {
      ctx.elements.wakelockBadge.classList.remove('active');
    });
  } catch (_) {
    // fail silently
  }
}

export async function releaseWakeLock(ctx) {
  if (ctx.state.wakeLockSentinel) {
    try {
      await ctx.state.wakeLockSentinel.release();
    } catch (_) {
      // ignore
    }
    ctx.state.wakeLockSentinel = null;
  }

  ctx.elements.wakelockBadge.classList.remove('active');
}

export function bindWakeLockVisibility(ctx) {
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && ctx.state.running && !ctx.state.wakeLockSentinel) {
      await requestWakeLock(ctx);
    }
  });
}
