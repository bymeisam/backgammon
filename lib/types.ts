export interface PointState {
  player: 1 | 2
  count: number
}

export interface BoardState {
  points: Record<number, PointState | null>
  bar: { p1: number; p2: number }
  borneOff: { p1: number; p2: number }
}

export interface SubMove {
  from: number | 'bar'
  to: number | 'off'
}

export type MoveAction = 'double' | 'take' | 'drop'

export interface Move {
  player: 1 | 2
  dice: [number, number]
  subMoves: SubMove[]
  action?: MoveAction
}

export interface Snapshot {
  state: BoardState
  move: Move | null
}

export interface Game {
  gameNumber: number
  snapshots: Snapshot[]
  winner: 1 | 2 | null
  pointsWon: number
}

export interface Match {
  matchId: string
  player1: string
  player2: string
  matchLength: number
  eventDate: string
  games: Game[]
}

export type Theme = 'classic-dark' | 'clean-light' | 'green-felt' | 'dark-modern'
