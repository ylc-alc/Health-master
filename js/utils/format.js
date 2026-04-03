export function formatApproxMinutes(totalSeconds) {
  return `${Math.max(1, Math.round(totalSeconds / 60))} min`;
}

export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

export function formatTime(totalSeconds) {
  const min = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const sec = String(totalSeconds % 60).padStart(2, '0');
  return `${min}:${sec}`;
}
