'use client'

import { useEffect, useRef } from 'react'
import type { Match, Snapshot } from '@/lib/types'
import MoveRow from './MoveRow'

interface MoveListPanelProps {
  match: Match
  currentGameIndex: number
  currentSnapshotIndex: number
  flipped: boolean
  visible: boolean
  onJumpTo: (gameIndex: number, snapshotIndex: number) => void
}

interface DisplayRow {
  moveNumber: number
  p1SnapshotIndex: number | null
  p2SnapshotIndex: number | null
}

function buildRows(snapshots: Snapshot[]): DisplayRow[] {
  // snapshots[0] is initial state (move=null)
  // snapshots[1..] correspond to moves
  const rows: DisplayRow[] = []
  let moveNum = 1
  let i = 1

  while (i < snapshots.length) {
    const snap = snapshots[i]
    const move = snap.move
    if (!move) { i++; continue }

    if (move.player === 1) {
      // P1 move is at index i
      const p1Idx = i
      let p2Idx: number | null = null

      // Look for P2 move next
      if (i + 1 < snapshots.length && snapshots[i + 1].move?.player === 2) {
        p2Idx = i + 1
        i += 2
      } else {
        i++
      }

      rows.push({ moveNumber: moveNum, p1SnapshotIndex: p1Idx, p2SnapshotIndex: p2Idx })
      moveNum++
    } else {
      // P2-only move (no P1 move for this turn)
      rows.push({ moveNumber: moveNum, p1SnapshotIndex: null, p2SnapshotIndex: i })
      moveNum++
      i++
    }
  }

  return rows
}

export default function MoveListPanel({
  match,
  currentGameIndex,
  currentSnapshotIndex,
  flipped,
  visible,
  onJumpTo,
}: MoveListPanelProps) {
  const activeRowRef = useRef<HTMLDivElement | null>(null)
  const game = match.games[currentGameIndex]
  const rows = buildRows(game.snapshots)

  useEffect(() => {
    activeRowRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [currentSnapshotIndex])

  const panelWidth = 260

  return (
    <div
      data-id="move-list-panel-outer"
      style={{
        width: visible ? panelWidth : 0,
        overflow: 'hidden',
        transition: 'width 200ms ease',
        flexShrink: 0,
      }}
    >
      <div
        data-id="move-list-panel-inner"
        style={{
          width: panelWidth,
          height: '100%',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--surface-2)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Game tabs */}
        <div
          data-id="move-list-panel-game-tabs"
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--surface-2)',
            flexShrink: 0,
          }}
        >
          {match.games.map((g, idx) => (
            <button
              key={idx}
              data-id={`move-list-panel-game-tab-${idx}`}
              onClick={() => onJumpTo(idx, 0)}
              style={{
                flex: 1,
                padding: '8px 4px',
                fontSize: 11,
                background: idx === currentGameIndex ? 'var(--surface-2)' : 'transparent',
                color: idx === currentGameIndex ? 'var(--accent)' : 'var(--text-secondary)',
                border: 'none',
                borderBottom: idx === currentGameIndex ? '2px solid var(--accent)' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              G{g.gameNumber}
            </button>
          ))}
        </div>

        {/* Column headers */}
        <div
          data-id="move-list-panel-column-headers"
          style={{
            display: 'flex',
            padding: '4px 0',
            borderBottom: '1px solid var(--surface-2)',
            flexShrink: 0,
          }}
        >
          <div data-id="move-list-panel-header-spacer" style={{ width: 28 }} />
          <div data-id="move-list-panel-header-p1" style={{ flex: 1, fontSize: 10, color: 'var(--text-secondary)', paddingLeft: 8 }}>
            {flipped ? match.player2 : match.player1}
          </div>
          <div data-id="move-list-panel-header-p2" style={{ flex: 1, fontSize: 10, color: 'var(--text-secondary)', paddingLeft: 8 }}>
            {flipped ? match.player1 : match.player2}
          </div>
        </div>

        {/* Move rows */}
        <div data-id="move-list-panel-rows" style={{ overflow: 'auto', flex: 1 }}>
          {rows.map((row) => (
            <MoveRow
              key={row.moveNumber}
              moveNumber={row.moveNumber}
              p1Snapshot={row.p1SnapshotIndex !== null ? game.snapshots[row.p1SnapshotIndex] : null}
              p2Snapshot={row.p2SnapshotIndex !== null ? game.snapshots[row.p2SnapshotIndex] : null}
              p1SnapshotIndex={row.p1SnapshotIndex}
              p2SnapshotIndex={row.p2SnapshotIndex}
              currentSnapshotIndex={currentSnapshotIndex}
              flipped={flipped}
              onJump={(idx) => onJumpTo(currentGameIndex, idx)}
              rowRef={activeRowRef}
            />
          ))}
        </div>

        {/* Win result */}
        {game.winner && (
          <div
            data-id="move-list-panel-win-result"
            style={{
              padding: '8px 12px',
              fontSize: 12,
              borderTop: '1px solid var(--surface-2)',
              color: 'var(--accent)',
              textAlign: 'center',
              flexShrink: 0,
            }}
          >
            {game.winner === 1 ? match.player1 : match.player2} wins {game.pointsWon}pt
          </div>
        )}
      </div>
    </div>
  )
}
