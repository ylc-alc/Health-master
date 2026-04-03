export function stopTimer(ctx) {
  clearInterval(ctx.state.intervalId);
  ctx.state.intervalId = null;
}

export function startTimer(ctx, tickFn) {
  stopTimer(ctx);
  ctx.state.intervalId = setInterval(tickFn, 1000);
}
