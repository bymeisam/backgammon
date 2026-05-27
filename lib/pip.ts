import type { BoardState } from './types'

export function calcPipCount(state: BoardState): { p1: number; p2: number } {
  let p1 = 0, p2 = 0

  for (let point = 1; point <= 24; point++) {
    const ps = state.points[point]
    if (!ps) continue
    if (ps.player === 1) p1 += ps.count * point
    if (ps.player === 2) p2 += ps.count * (25 - point)
  }

  p1 += state.bar.p1 * 25
  p2 += state.bar.p2 * 25

  return { p1, p2 }
}
