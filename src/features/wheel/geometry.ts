export const normalize = (angle: number) => ((angle % 360) + 360) % 360;
export function angleDelta(next: number, previous: number) {
  return ((next - previous + 540) % 360) - 180;
}
export function winnerIndex(rotation: number, count: number) {
  if (count < 1) return -1;
  return Math.min(count - 1, Math.floor(normalize(-rotation) / (360 / count)));
}
export function point(angle: number, radius: number) {
  const radians = angle * Math.PI / 180;
  return { x: 300 + Math.cos(radians) * radius, y: 300 + Math.sin(radians) * radius };
}
export function segmentPath(index: number, count: number) {
  if (count === 1) return 'M 300 22 A 278 278 0 1 1 300 578 A 278 278 0 1 1 300 22 Z';
  const a = point(-90 + index * 360 / count, 278);
  const b = point(-90 + (index + 1) * 360 / count, 278);
  return `M 300 300 L ${a.x} ${a.y} A 278 278 0 ${360 / count > 180 ? 1 : 0} 1 ${b.x} ${b.y} Z`;
}
