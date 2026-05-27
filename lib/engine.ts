import type { BoardState, Move, SubMove, Snapshot } from './types'

export const INITIAL_BOARD_STATE: BoardState = {
  points: {
    1:  { player: 2, count: 2 },
    2:  null,
    3:  null,
    4:  null,
    5:  null,
    6:  { player: 1, count: 5 },
    7:  null,
    8:  { player: 1, count: 3 },
    9:  null,
    10: null,
    11: null,
    12: { player: 2, count: 5 },
    13: { player: 1, count: 5 },
    14: null,
    15: null,
    16: null,
    17: { player: 2, count: 3 },
    18: null,
    19: { player: 2, count: 5 },
    20: null,
    21: null,
    22: null,
    23: null,
    24: { player: 1, count: 2 },
  },
  bar: { p1: 0, p2: 0 },
  borneOff: { p1: 0, p2: 0 },
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

function opponent(player: 1 | 2): 1 | 2 {
  return player === 1 ? 2 : 1
}

function getBarKey(player: 1 | 2): 'p1' | 'p2' {
  return player === 1 ? 'p1' : 'p2'
}

function placeChecker(state: BoardState, point: number, player: 1 | 2): void {
  const existing = state.points[point]
  if (!existing) {
    state.points[point] = { player, count: 1 }
  } else {
    existing.count++
  }
}

function removeChecker(state: BoardState, point: number): void {
  const ps = state.points[point]
  if (!ps) return
  ps.count--
  if (ps.count === 0) state.points[point] = null
}

function applySubMove(state: BoardState, subMove: SubMove, player: 1 | 2): void {
  const opp = opponent(player)
  const oppKey = getBarKey(opp)
  const playerKey = getBarKey(player)

  if (subMove.from === 'bar') {
    state.bar[playerKey]--
    if (subMove.to !== 'off') {
      const dest = subMove.to as number
      const destState = state.points[dest]
      if (destState && destState.player === opp && destState.count === 1) {
        state.points[dest] = null
        state.bar[oppKey]++
      }
      placeChecker(state, dest, player)
    }
    return
  }

  if (subMove.to === 'off') {
    removeChecker(state, subMove.from as number)
    if (player === 1) state.borneOff.p1++
    else state.borneOff.p2++
    return
  }

  const from = subMove.from as number
  const to = subMove.to as number
  removeChecker(state, from)
  const destState = state.points[to]
  if (destState && destState.player === opp && destState.count === 1) {
    state.points[to] = null
    state.bar[oppKey]++
  }
  placeChecker(state, to, player)
}

export function applyMove(state: BoardState, move: Move): BoardState {
  const next = deepClone(state)
  if (move.action) return next
  for (const subMove of move.subMoves) {
    applySubMove(next, subMove, move.player)
  }
  return next
}

export function applySubMoveToState(state: BoardState, subMove: SubMove, player: 1 | 2): BoardState {
  const next = deepClone(state)
  applySubMove(next, subMove, player)
  return next
}

export function computeSnapshots(moves: Move[]): Snapshot[] {
  const snapshots: Snapshot[] = [
    { state: deepClone(INITIAL_BOARD_STATE), move: null },
  ]

  let current = deepClone(INITIAL_BOARD_STATE)

  for (const move of moves) {
    current = applyMove(current, move)
    snapshots.push({ state: deepClone(current), move })
  }

  return snapshots
}
