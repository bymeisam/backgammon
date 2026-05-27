import type { PointState } from '@/lib/types'
import Checker from './Checker'

interface PointProps {
  absolutePoint: number
  pointState: PointState | null
  isTop: boolean       // triangle points down
  checkerSize: number
  pointWidth: number
  pointHeight: number
}

const MAX_VISIBLE = 5

export default function Point({
  absolutePoint,
  pointState,
  isTop,
  checkerSize,
  pointWidth,
  pointHeight,
}: PointProps) {
  const isA = absolutePoint % 2 === (isTop ? 1 : 0)
  const pointColor = isA ? 'var(--point-a)' : 'var(--point-b)'

  const count = pointState?.count ?? 0
  const player = pointState?.player

  // Clip path: triangle pointing down (top) or up (bottom)
  const clipPath = isTop
    ? 'polygon(10% 0%, 90% 0%, 50% 100%)'
    : 'polygon(10% 100%, 90% 100%, 50% 0%)'

  // Stack direction: top points stack downward, bottom points stack upward
  const checkers: React.ReactNode[] = []
  if (count > 0 && player !== undefined) {
    const visible = Math.min(count, MAX_VISIBLE)
    for (let i = 0; i < visible; i++) {
      const stackIndex = i
      const checkerId = `p${player}-point-${absolutePoint}-${stackIndex}`
      const isLast = i === visible - 1
      const showLabel = isLast && count > MAX_VISIBLE ? count : undefined

      checkers.push(
        <Checker
          key={stackIndex}
          player={player}
          size={checkerSize}
          checkerId={checkerId}
          label={showLabel}
        />
      )
    }
  }

  const gap = 1
  const stackStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: isTop ? 'column' : 'column-reverse',
    alignItems: 'center',
    gap,
    top: isTop ? 2 : undefined,
    bottom: isTop ? undefined : 2,
  }

  return (
    <div
      style={{
        position: 'relative',
        width: pointWidth,
        height: pointHeight,
        flexShrink: 0,
      }}
    >
      {/* Triangle */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath,
          background: pointColor,
          opacity: 0.85,
        }}
      />

      {/* Point number */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: isTop ? undefined : 2,
          top: isTop ? 2 : undefined,
          fontSize: 9,
          color: 'var(--text-secondary)',
          lineHeight: 1,
          userSelect: 'none',
          width: 20,
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        {absolutePoint}
      </div>

      {/* Checkers */}
      <div style={stackStyle}>
        {checkers}
      </div>
    </div>
  )
}
