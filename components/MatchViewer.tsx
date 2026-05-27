'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Match, Move, BoardState } from '@/lib/types'
import { deepClone, applySubMoveToState } from '@/lib/engine'
import { calcPipCount } from '@/lib/pip'
import { animateCheckerArc, getCheckerCenter } from '@/lib/animator'
import Board, { BOARD_NATURAL_WIDTH, BOARD_NATURAL_HEIGHT } from './Board'
import PointNumberStrip, { STRIP_HEIGHT } from './PointNumberStrip'
import BoardSideStrip from './BoardSideStrip'
import MoveListPanel from './MoveListPanel'
import ThemeSwitcher from './ThemeSwitcher'

interface MatchViewerProps {
  match: Match
  onReset: () => void
}

const FAST_SPEED = 80
const SPEEDS = [1000, 500, 250]
const SPEED_LABELS = ['1×', '2×', '4×']

// ── Animation helpers ─────────────────────────────────────────────────────────

function resolveFromCheckerId(from: number | 'bar', player: 1 | 2, state: BoardState): string {
  if (from === 'bar') {
    const count = player === 1 ? state.bar.p1 : state.bar.p2
    return `p${player}-bar-${Math.max(0, count - 1)}`
  }
  const ps = state.points[from as number]
  return `p${player}-point-${from}-${Math.max(0, (ps?.count ?? 1) - 1)}`
}

function resolveToPosition(to: number | 'off', player: 1 | 2, state: BoardState): { x: number; y: number } | null {
  if (to === 'off') {
    const el = document.querySelector(`[data-checker-id="p${player}-bearoff"]`)
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }
  const point = to as number
  const ps = state.points[point]
  const existingCount = ps?.count ?? 0

  if (existingCount > 0 && ps?.player === player) {
    const el = document.querySelector(`[data-checker-id="p${player}-point-${point}-${existingCount - 1}"]`)
    if (el) {
      const r = el.getBoundingClientRect()
      const isTop = point >= 13
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 + (isTop ? r.height + 1 : -(r.height + 1)) }
    }
  }

  const anyEl = document.querySelector(`[data-checker-id^="p1-point-${point}-"],[data-checker-id^="p2-point-${point}-"]`)
  if (anyEl) {
    const r = anyEl.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }
  return null
}

async function runMoveAnimation(move: Move, fromState: BoardState, overlay: HTMLElement, dur: number): Promise<void> {
  if (move.subMoves.length === 0 || move.action) return
  let state = deepClone(fromState)

  for (const subMove of move.subMoves) {
    const fromId = resolveFromCheckerId(subMove.from, move.player, state)
    const toPos  = resolveToPosition(subMove.to, move.player, state)
    const fromPos = getCheckerCenter(fromId)
    const el = document.querySelector(`[data-checker-id="${fromId}"]`) as HTMLElement | null

    if (fromPos && toPos && el) {
      const orig = el.style.opacity
      el.style.opacity = '0'
      await new Promise<void>(res => animateCheckerArc(overlay, el, fromPos, toPos, dur, res))
      el.style.opacity = orig
    }

    state = applySubMoveToState(state, subMove, move.player)
  }
}

// ── Toggle ─────────────────────────────────────────────────────────────────────

function Toggle({ label, value, onChange }: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0' }}
    >
      <div style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 500 }}>{label}</div>
      <div style={{
        width: 36, height: 20, borderRadius: 10,
        background: value ? 'var(--accent)' : 'var(--surface-2)',
        position: 'relative', transition: 'background 150ms ease',
        flexShrink: 0, marginLeft: 12,
      }}>
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: '#fff',
          position: 'absolute',
          top: 3,
          left: value ? 19 : 3,
          transition: 'left 150ms ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </div>
    </div>
  )
}

// ── Small UI button ────────────────────────────────────────────────────────────

function PanelBtn({
  onClick, disabled, active, title, children,
}: {
  onClick: () => void
  disabled?: boolean
  active?: boolean
  title?: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        background: active ? 'var(--accent)' : 'var(--surface-2)',
        color: active ? '#000' : 'var(--text-primary)',
        border: 'none',
        borderRadius: 5,
        padding: '6px 10px',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        fontSize: 12,
        fontFamily: 'inherit',
        flexShrink: 0,
        transition: 'background 0.15s',
      }}
    >
      {children}
    </button>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function MatchViewer({ match, onReset }: MatchViewerProps) {
  const [currentGameIndex, setCurrentGameIndex] = useState(0)
  const [currentSnapshotIndex, setCurrentSnapshotIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState<number>(() => {
    try { return parseInt(localStorage.getItem('bgv-speed') ?? '500') || 500 } catch { return 500 }
  })
  const [flipped, setFlipped] = useState<boolean>(() => {
    try { return localStorage.getItem('bgv-flipped') === 'true' } catch { return false }
  })
  const [showMoveList, setShowMoveList] = useState<boolean>(() => {
    try { return localStorage.getItem('bgv-movelist') !== 'false' } catch { return true }
  })
  const [showPipCount, setShowPipCount] = useState<boolean>(() => {
    try { return localStorage.getItem('bgv-pip-count') !== 'false' } catch { return true }
  })
  const [showPointNumbers, setShowPointNumbers] = useState<boolean>(() => {
    try { return localStorage.getItem('bgv-point-numbers') !== 'false' } catch { return true }
  })
  const [opponentNumbers, setOpponentNumbers] = useState<boolean>(() => {
    try { return localStorage.getItem('bgv-opponent-numbers') === 'true' } catch { return false }
  })

  // Board scaling — account for point number strips above and below
  const boardContainerRef = useRef<HTMLDivElement | null>(null)
  const [boardScale, setBoardScale] = useState(1)
  const naturalH = BOARD_NATURAL_HEIGHT + STRIP_HEIGHT * 2

  useEffect(() => {
    const container = boardContainerRef.current
    if (!container) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const scale = Math.min(width / BOARD_NATURAL_WIDTH, height / naturalH) * 0.97
      setBoardScale(Math.max(0.1, scale))
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [naturalH])

  // Fixed-position animation overlay
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const animatingRef = useRef(false)
  const snapIdxRef = useRef(0)
  const gameIdxRef = useRef(0)

  const getGame = useCallback((i: number) => match.games[i], [match])

  useEffect(() => { try { localStorage.setItem('bgv-speed', String(speed)) } catch {} }, [speed])
  useEffect(() => { try { localStorage.setItem('bgv-flipped', String(flipped)) } catch {} }, [flipped])
  useEffect(() => { try { localStorage.setItem('bgv-movelist', String(showMoveList)) } catch {} }, [showMoveList])
  useEffect(() => { try { localStorage.setItem('bgv-pip-count', String(showPipCount)) } catch {} }, [showPipCount])
  useEffect(() => { try { localStorage.setItem('bgv-point-numbers', String(showPointNumbers)) } catch {} }, [showPointNumbers])
  useEffect(() => { try { localStorage.setItem('bgv-opponent-numbers', String(opponentNumbers)) } catch {} }, [opponentNumbers])

  async function stepTo(targetIdx: number, animate: boolean, dur: number): Promise<void> {
    if (animatingRef.current) return
    animatingRef.current = true

    const game = getGame(gameIdxRef.current)
    const fromIdx = snapIdxRef.current

    if (animate && targetIdx > fromIdx && overlayRef.current) {
      const snap = game.snapshots[targetIdx]
      if (snap?.move) {
        const fromState = game.snapshots[fromIdx].state
        await runMoveAnimation(snap.move, fromState, overlayRef.current, dur)
      }
    }

    snapIdxRef.current = targetIdx
    setCurrentSnapshotIndex(targetIdx)
    animatingRef.current = false
  }

  function stepForward() {
    const game = getGame(gameIdxRef.current)
    const cur = snapIdxRef.current
    if (animatingRef.current || cur >= game.snapshots.length - 1) return
    stepTo(cur + 1, true, speed)
  }

  function stepBackward() {
    const cur = snapIdxRef.current
    if (animatingRef.current || cur <= 0) return
    stepTo(cur - 1, false, speed)
  }

  useEffect(() => {
    if (!isPlaying) return
    const game = getGame(currentGameIndex)
    if (currentSnapshotIndex >= game.snapshots.length - 1) { setIsPlaying(false); return }
    const t = setTimeout(stepForward, Math.max(50, speed * 0.08))
    return () => clearTimeout(t)
  }, [isPlaying, currentSnapshotIndex, currentGameIndex])

  async function navigateTo(gameIdx: number, snapIdx: number) {
    if (animatingRef.current) return
    if (gameIdx !== gameIdxRef.current) {
      gameIdxRef.current = gameIdx
      snapIdxRef.current = 0
      setCurrentGameIndex(gameIdx)
      setCurrentSnapshotIndex(0)
      return
    }
    const cur = snapIdxRef.current
    if (snapIdx === cur) return
    const direction = snapIdx > cur ? 1 : -1
    let i = cur
    while (i !== snapIdx) {
      await stepTo(i + direction, direction > 0, FAST_SPEED)
      i += direction
    }
  }

  // Derived state
  const currentGame = match.games[currentGameIndex]
  const currentSnapshot = currentGame.snapshots[currentSnapshotIndex]
  const pip = calcPipCount(currentSnapshot.state)
  const canPrev = currentSnapshotIndex > 0
  const canNext = currentSnapshotIndex < currentGame.snapshots.length - 1
  const currentMove = currentSnapshot.move

  const sectionLabel: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    marginBottom: 4,
  }

  return (
    <>
      {/* 4-column layout: move list | board | side strip | controls */}
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

        {/* Col 1: collapsible move list */}
        <MoveListPanel
          match={match}
          currentGameIndex={currentGameIndex}
          currentSnapshotIndex={currentSnapshotIndex}
          flipped={flipped}
          visible={showMoveList}
          onJumpTo={navigateTo}
        />

        {/* Col 2: board + point number strips, scales to fill */}
        <div
          ref={boardContainerRef}
          style={{
            flex: 1,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            background: 'var(--board-bg)',
          }}
        >
          <div
            style={{
              transformOrigin: 'center center',
              transform: `scale(${boardScale})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <PointNumberStrip
              position="top"
              flipped={flipped}
              opponentNumbers={opponentNumbers}
              visible={showPointNumbers}
            />
            <Board
              state={currentSnapshot.state}
              flipped={flipped}
              pipCount={pip}
              showPipCount={showPipCount}
            />
            <PointNumberStrip
              position="bottom"
              flipped={flipped}
              opponentNumbers={opponentNumbers}
              visible={showPointNumbers}
            />
          </div>
        </div>

        {/* Col 3: side strip — player names + dice */}
        <BoardSideStrip
          match={match}
          currentMove={currentMove}
          flipped={flipped}
        />

        {/* Col 4: controls panel */}
        <aside
          style={{
            width: 200,
            height: '100vh',
            background: 'var(--surface)',
            borderLeft: '1px solid var(--surface-2)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {/* Back + match info */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--surface-2)', flexShrink: 0 }}>
            <button
              onClick={onReset}
              style={{
                background: 'none',
                border: '1px solid var(--surface-2)',
                color: 'var(--text-secondary)',
                padding: '3px 8px',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 11,
                fontFamily: 'inherit',
                marginBottom: 6,
              }}
            >
              ← Back
            </button>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <div>{match.player1} vs {match.player2}</div>
              <div>{match.matchLength}pt · {match.eventDate}</div>
            </div>
          </div>

          {/* Play controls */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--surface-2)', display: 'flex', gap: 6, justifyContent: 'center' }}>
            <PanelBtn onClick={stepBackward} disabled={!canPrev} title="Previous">◀</PanelBtn>
            <PanelBtn onClick={() => setIsPlaying(p => !p)} title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? '⏸' : '▶'}
            </PanelBtn>
            <PanelBtn onClick={stepForward} disabled={!canNext} title="Next">▶</PanelBtn>
          </div>

          {/* Display toggles */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--surface-2)' }}>
            <div style={sectionLabel}>Display</div>
            <Toggle label="Pip Count" value={showPipCount} onChange={setShowPipCount} />
            <Toggle label="Point Numbers" value={showPointNumbers} onChange={setShowPointNumbers} />
            <Toggle label="Opponent Nums" value={opponentNumbers} onChange={setOpponentNumbers} />
            <Toggle label="Flip Board" value={flipped} onChange={setFlipped} />
          </div>

          {/* Speed section */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--surface-2)' }}>
            <div style={sectionLabel}>Speed</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              {SPEEDS.map((s, i) => (
                <PanelBtn key={s} onClick={() => setSpeed(s)} active={speed === s}>
                  {SPEED_LABELS[i]}
                </PanelBtn>
              ))}
              <PanelBtn onClick={() => setShowMoveList(v => !v)} active={showMoveList} title="Toggle move list">☰</PanelBtn>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Theme swatches */}
          <div
            style={{
              padding: '10px 16px',
              borderTop: '1px solid var(--surface-2)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Theme</span>
            <ThemeSwitcher />
          </div>
        </aside>
      </div>

      {/* Animation overlay — fixed position, outside the scaled board */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  )
}
