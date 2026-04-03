import { formatDate } from '../utils/format.js';
import {
  getNextIncompleteIndex,
  getVisibleWeek,
  isCompleted,
  isLockedSession
} from '../utils/programme.js';

export function renderPlanner(ctx) {
  const { elements: els, state, schedule, workoutTemplates, controller } = ctx;

  const nextIndex = getNextIncompleteIndex(state.progress, schedule);
  const visibleWeek = getVisibleWeek(state.progress, schedule);

  els.plannerTitle.textContent = `Week ${visibleWeek} planner`;
  els.planner.innerHTML = '';

  schedule
    .filter(s => s.week === visibleWeek)
    .forEach(session => {
      const workout = workoutTemplates[session.workoutId];
      const done = isCompleted(state.progress, session.key);
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
          <button class="btn secondary" data-session-index="${session.index}" ${locked ? 'disabled' : ''}>View</button>
        </div>
      `;

      tile.querySelector('[data-session-index]')?.addEventListener('click', e => {
        if (e.currentTarget.disabled) return;
        controller.openDetails(Number(e.currentTarget.dataset.sessionIndex));
      });

      els.planner.appendChild(tile);
    });
}
