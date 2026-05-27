import { POINT_WIDTH, BAR_WIDTH, BOARD_NATURAL_WIDTH } from './Board'

export const STRIP_HEIGHT = 20

interface PointNumberStripProps {
  position: 'top' | 'bottom'
  flipped: boolean
  opponentNumbers: boolean
  visible: boolean
}

function displayNumber(absolutePoint: number, opponentNumbers: boolean): number {
  return opponentNumbers ? 25 - absolutePoint : absolutePoint
}

export default function PointNumberStrip({ position, flipped, opponentNumbers, visible }: PointNumberStripProps) {
  const points = position === 'top'
    ? (flipped ? [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1] : [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24])
    : (flipped ? [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] : [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])

  return (
    <div
      style={{
        visibility: visible ? 'visible' : 'hidden',
        opacity: visible ? 1 : 0,
        transition: 'opacity 150ms ease',
        width: BOARD_NATURAL_WIDTH,
        height: STRIP_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
      }}
    >
      {points.slice(0, 6).map((p) => (
        <div
          key={p}
          style={{
            width: POINT_WIDTH,
            flexShrink: 0,
            textAlign: 'center',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            userSelect: 'none',
          }}
        >
          {displayNumber(p, opponentNumbers)}
        </div>
      ))}
      {/* Bar gap */}
      <div style={{ width: BAR_WIDTH, flexShrink: 0 }} />
      {points.slice(6).map((p) => (
        <div
          key={p}
          style={{
            width: POINT_WIDTH,
            flexShrink: 0,
            textAlign: 'center',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            userSelect: 'none',
          }}
        >
          {displayNumber(p, opponentNumbers)}
        </div>
      ))}
    </div>
  )
}
