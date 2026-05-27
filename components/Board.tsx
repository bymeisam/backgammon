'use client'

import type { BoardState } from '@/lib/types'
import Point from './Point'
import Bar from './Bar'
import BearoffTray from './BearoffTray'

interface BoardProps {
  state: BoardState
  flipped: boolean
  pipCount: { p1: number; p2: number }
  showPipCount: boolean
  showPointNumbers: boolean
  opponentNumbers: boolean
}

export const POINT_WIDTH   = 48
export const POINT_HEIGHT  = 180
export const CHECKER_SIZE  = Math.round(POINT_WIDTH * 0.72)   // 35
export const BAR_WIDTH     = CHECKER_SIZE + 8                 // 43
const TRAY_WIDTH           = Math.round(CHECKER_SIZE * 1.45)  // 51
const GUTTER               = 20
const STRIP_HEIGHT         = 22
const BOARD_CONTENT_WIDTH  = POINT_WIDTH * 12 + BAR_WIDTH     // 619

export const BOARD_NATURAL_WIDTH  = BOARD_CONTENT_WIDTH + TRAY_WIDTH
export const BOARD_NATURAL_HEIGHT = STRIP_HEIGHT * 2 + GUTTER * 2 + POINT_HEIGHT * 2 + 16

// ── Inline point number strip ─────────────────────────────────────────────────

function PointNumberStrip({
  position, flipped, opponentNumbers, visible,
}: {
  position: 'top' | 'bottom'
  flipped: boolean
  opponentNumbers: boolean
  visible: boolean
}) {
  const points = position === 'top'
    ? (flipped ? [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1] : [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24])
    : (flipped ? [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] : [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])

  const left  = points.slice(0, 6)
  const right = points.slice(6, 12)
  const numStyle: React.CSSProperties = {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    userSelect: 'none',
  }

  return (
    <div
      style={{
        height: STRIP_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        visibility: visible ? 'visible' : 'hidden',
        opacity: visible ? 1 : 0,
        transition: 'opacity 150ms ease',
        background: 'var(--board-bg)',
        borderBottom: position === 'top' ? '1px solid var(--board-border)' : 'none',
        borderTop: position === 'bottom' ? '1px solid var(--board-border)' : 'none',
        zIndex: 2,
      }}
    >
      {/* Play area: left 6 | bar gap | right 6 — aligned to triangle centers */}
      <div style={{ width: BOARD_CONTENT_WIDTH, display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex' }}>
          {left.map((p) => (
            <div key={p} style={numStyle}>{opponentNumbers ? 25 - p : p}</div>
          ))}
        </div>
        <div style={{ width: BAR_WIDTH, flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex' }}>
          {right.map((p) => (
            <div key={p} style={numStyle}>{opponentNumbers ? 25 - p : p}</div>
          ))}
        </div>
      </div>
      {/* Spacer over bearoff tray */}
      <div style={{ flex: 1 }} />
    </div>
  )
}

// ── Board ─────────────────────────────────────────────────────────────────────

export default function Board({ state, flipped, pipCount, showPipCount, showPointNumbers, opponentNumbers }: BoardProps) {
  const topRow = flipped
    ? [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    : [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]

  const bottomRow = flipped
    ? [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    : [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

  function renderHalf(points: number[], isTop: boolean) {
    return (
      <div style={{ display: 'flex', height: POINT_HEIGHT }}>
        {points.slice(0, 6).map((abs) => (
          <Point
            key={abs}
            absolutePoint={abs}
            pointState={state.points[abs] ?? null}
            isTop={isTop}
            checkerSize={CHECKER_SIZE}
            pointWidth={POINT_WIDTH}
            pointHeight={POINT_HEIGHT}
          />
        ))}
        <div style={{ width: BAR_WIDTH, flexShrink: 0 }} />
        {points.slice(6).map((abs) => (
          <Point
            key={abs}
            absolutePoint={abs}
            pointState={state.points[abs] ?? null}
            isTop={isTop}
            checkerSize={CHECKER_SIZE}
            pointWidth={POINT_WIDTH}
            pointHeight={POINT_HEIGHT}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      style={{
        width: BOARD_NATURAL_WIDTH,
        height: BOARD_NATURAL_HEIGHT,
        borderRadius: 10,
        border: '2px solid var(--board-border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        flexShrink: 0,
        background: 'var(--board-bg)',
      }}
    >
      {/* Noise texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Top number strip — inside board border, above triangles */}
      <PointNumberStrip
        position="top"
        flipped={flipped}
        opponentNumbers={opponentNumbers}
        visible={showPointNumbers}
      />

      {/* Main content row: play area + bearoff */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Play area */}
        <div style={{ width: BOARD_CONTENT_WIDTH, height: '100%', position: 'relative', flexShrink: 0 }}>
          <div style={{ paddingTop: GUTTER }}>{renderHalf(topRow, true)}</div>
          <div style={{ height: 16, background: 'var(--bar-bg)' }} />
          <div style={{ paddingBottom: GUTTER }}>{renderHalf(bottomRow, false)}</div>

          {/* Bar column */}
          <div
            style={{
              position: 'absolute',
              left: POINT_WIDTH * 6,
              top: 0,
              width: BAR_WIDTH,
              height: '100%',
              zIndex: 4,
            }}
          >
            <Bar
              bar={state.bar}
              pipCount={pipCount}
              showPipCount={showPipCount}
              flipped={flipped}
              barWidth={BAR_WIDTH}
              checkerSize={CHECKER_SIZE}
            />
          </div>
        </div>

        {/* Bearoff tray */}
        <BearoffTray
          p1Count={state.borneOff.p1}
          p2Count={state.borneOff.p2}
          checkerSize={CHECKER_SIZE}
          flipped={flipped}
        />
      </div>

      {/* Bottom number strip — inside board border, below triangles */}
      <PointNumberStrip
        position="bottom"
        flipped={flipped}
        opponentNumbers={opponentNumbers}
        visible={showPointNumbers}
      />
    </div>
  )
}
