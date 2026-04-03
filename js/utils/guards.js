export function normalizeDayState(value) {
  if (value === 'lowEnergy') return 'low_energy';
  if (value === 'jointFriendly') return 'joint_friendly';
  if (value === 'low_energy' || value === 'joint_friendly' || value === 'standard') return value;
  return 'standard';
}

export function getDayStateLabel(dayState) {
  const value = normalizeDayState(dayState);
  if (value === 'low_energy') return 'Low energy day';
  if (value === 'joint_friendly') return 'Joint-friendly day';
  return 'Standard day';
}
