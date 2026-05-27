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
}

export const POINT_WIDTH = 48
export const POINT_HEIGHT = 180
export const CHECKER_SIZE = Math.round(POINT_WIDTH * 0.72)  // 35
export const BAR_WIDTH = CHECKER_SIZE + 8                   // 43
const TRAY_WIDTH = CHECKER_SIZE + 8                         // 43
const GUTTER = 20

export const BOARD_NATURAL_WIDTH  = POINT_WIDTH * 12 + BAR_WIDTH + TRAY_WIDTH
export const BOARD_NATURAL_HEIGHT = GUTTER + POINT_HEIGHT + 16 + POINT_HEIGHT + GUTTER

export default function Board({ state, flipped, pipCount, showPipCount }: BoardProps) {
  const topRow = flipped
    ? [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    : [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]

  const bottomRow = flipped
    ? [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    : [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

  const boardContentWidth = POINT_WIDTH * 12 + BAR_WIDTH

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
        background: 'var(--board-bg)',
        borderRadius: 10,
        border: '2px solid var(--board-border)',
        overflow: 'hidden',
        display: 'flex',
        position: 'relative',
        flexShrink: 0,
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

      {/* Play area */}
      <div style={{ width: boardContentWidth, height: '100%', position: 'relative', flexShrink: 0 }}>
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
  )
}
