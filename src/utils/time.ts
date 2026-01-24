export function diffMinutes(start: Date, end: Date) {
  return Math.max(
    0,
    Math.floor((end.getTime() - start.getTime()) / 60000)
  );
}

export function formatMinutes(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;

  if (h === 0) return `${m} dk`;
  return `${h} sa ${m} dk`;
}
