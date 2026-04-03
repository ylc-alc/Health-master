import { renderCurrentCard } from './current-card.js';
import { renderStats } from './stats.js';
import { renderPlanner } from './planner.js';

export function renderAll(ctx) {
  renderCurrentCard(ctx);
  renderStats(ctx);
  renderPlanner(ctx);
}
