export type Sample = { time: number; angle: number };
export const FRICTION = 0.4;
export const STOP_SPEED = 0.7;
export function releaseVelocity(samples: Sample[], now: number) {
  const recent = samples.filter(s => now - s.time <= 120);
  const last = recent.at(-1);
  if (recent.length < 2 || !last || now - last.time > 85) return 0;
  let weighted = 0, weights = 0;
  for (let i = 1; i < recent.length; i++) {
    const current = recent[i], previous = recent[i - 1];
    if (!current || !previous) continue;
    const dt = (current.time - previous.time) / 1000;
    if (dt <= 0) continue;
    const weight = i;
    weighted += (current.angle - previous.angle) / dt * weight;
    weights += weight;
  }
  return weights ? Math.max(-2000, Math.min(2000, weighted / weights)) : 0;
}
export function advance(rotation: number, velocity: number, dt: number) {
  const duration = Math.min(Math.max(dt, 0), Math.max(0, Math.log(Math.abs(velocity) / STOP_SPEED) / FRICTION));
  const decay = Math.exp(-FRICTION * duration);
  return { rotation: rotation + velocity * (1 - decay) / FRICTION, velocity: Math.abs(velocity * decay) <= STOP_SPEED + 1e-8 ? 0 : velocity * decay };
}
