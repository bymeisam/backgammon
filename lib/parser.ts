import type { Match, Game, Move, SubMove } from './types'
import { computeSnapshots } from './engine'

function extractMeta(lines: string[]): Record<string, string> {
  const meta: Record<string, string> = {}
  for (const line of lines) {
    const m = line.match(/^;\s*\[([^\]"]+?)\s+"([^"]+)"\]/)
    if (m) meta[m[1].trim()] = m[2].trim()
  }
  return meta
}

// Column boundary: P1 content starts at char 5, P2 at char 33 (absolute line positions)
const COL_SPLIT = 33

function splitMoveLine(line: string): { moveNum: number; left: string; right: string } | null {
  const m = line.match(/^\s*(\d+)\)/)
  if (!m) return null
  const moveNum = parseInt(m[1], 10)
  const left = line.slice(m[0].length, COL_SPLIT).trim()
  const right = line.slice(COL_SPLIT).trim()
  return { moveNum, left, right }
}

function parseSubMoveToken(token: string, player: 1 | 2): SubMove | null {
  const slash = token.indexOf('/')
  if (slash === -1) return null
  const rawFrom = parseInt(token.slice(0, slash), 10)
  const rawTo = parseInt(token.slice(slash + 1), 10)
  if (isNaN(rawFrom) || isNaN(rawTo)) return null

  const from: number | 'bar' =
    ((player === 1 && rawFrom === 25) || (player === 2 && rawFrom === 0))
      ? 'bar'
      : rawFrom

  const to: number | 'off' = rawTo === 0 ? 'off' : rawTo

  return { from, to }
}

function parseCellText(text: string, player: 1 | 2): Move | null {
  text = text.trim()
  if (!text) return null

  // Doubles => N  (cube value N, so face = sqrt(N) but we store dice as [face,face])
  const dbl = text.match(/^Doubles\s*=>\s*(\d+)/i)
  if (dbl) {
    const cubeVal = parseInt(dbl[1], 10)
    // cube value is the new cube level; face value is cube/2 conceptually but we just store it
    return { player, dice: [cubeVal, cubeVal] as [number, number], subMoves: [], action: 'double' }
  }

  if (/^Takes$/i.test(text)) return { player, dice: [1, 1], subMoves: [], action: 'take' }
  if (/^Drops$/i.test(text)) return { player, dice: [1, 1], subMoves: [], action: 'drop' }

  // Win line — not a move
  if (/^Wins\s+\d+/i.test(text)) return null

  // Normal: "dice: submoves"
  const colonIdx = text.indexOf(':')
  if (colonIdx === -1) return null

  const dicePart = text.slice(0, colonIdx).trim()
  if (dicePart.length < 2) return null
  const d1 = parseInt(dicePart[0], 10)
  const d2 = parseInt(dicePart[1], 10)
  if (isNaN(d1) || isNaN(d2)) return null

  const movePart = text.slice(colonIdx + 1).trim()
  const subMoves: SubMove[] = []
  for (const token of movePart.split(/\s+/).filter(Boolean)) {
    const sm = parseSubMoveToken(token, player)
    if (sm) subMoves.push(sm)
  }

  return { player, dice: [d1, d2] as [number, number], subMoves }
}

function parseWin(text: string): { points: number; matchWin: boolean } | null {
  const m = text.match(/Wins\s+(\d+)\s+point(s?)(\s+and the match)?/i)
  if (!m) return null
  return { points: parseInt(m[1], 10), matchWin: !!m[3] }
}

function parseGame(gameLines: string[], gameNumber: number): Game {
  const moves: Move[] = []
  let winner: 1 | 2 | null = null
  let pointsWon = 0

  for (const line of gameLines) {
    const split = splitMoveLine(line)
    if (!split) continue

    const { left, right } = split

    // Check for win in either column
    const leftWin = parseWin(left)
    const rightWin = parseWin(right)

    if (leftWin) {
      winner = 1
      pointsWon = leftWin.points
      // parse right column as a move too if it exists
      const rm = parseCellText(right, 2)
      if (rm) moves.push(rm)
      continue
    }
    if (rightWin) {
      winner = 2
      pointsWon = rightWin.points
      const lm = parseCellText(left, 1)
      if (lm) moves.push(lm)
      continue
    }

    const p1Move = parseCellText(left, 1)
    const p2Move = parseCellText(right, 2)
    if (p1Move) moves.push(p1Move)
    if (p2Move) moves.push(p2Move)
  }

  return {
    gameNumber,
    snapshots: computeSnapshots(moves),
    winner,
    pointsWon,
  }
}

export function parseMatch(text: string): Match {
  const lines = text.split('\n')
  const meta = extractMeta(lines)

  const matchLenM = text.match(/(\d+)\s+point\s+match/i)
  const matchLength = matchLenM ? parseInt(matchLenM[1], 10) : 0

  const games: Game[] = []
  let currentGameLines: string[] = []
  let currentGameNum = 0
  let inGame = false

  for (const line of lines) {
    const gameM = line.match(/^\s*Game\s+(\d+)/i)
    if (gameM) {
      if (inGame && currentGameLines.length > 0) {
        games.push(parseGame(currentGameLines, currentGameNum))
      }
      currentGameNum = parseInt(gameM[1], 10)
      currentGameLines = []
      inGame = true
    } else if (inGame) {
      currentGameLines.push(line)
    }
  }

  if (inGame && currentGameLines.length > 0) {
    games.push(parseGame(currentGameLines, currentGameNum))
  }

  return {
    matchId: meta['Match ID'] || '',
    player1: meta['Player 1'] || 'Player 1',
    player2: meta['Player 2'] || 'Player 2',
    matchLength,
    eventDate: (meta['EventDate'] || '').replace(/\./g, '-'),
    games,
  }
}
