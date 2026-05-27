import type { PointState } from '@/lib/types'
import Checker from './Checker'

interface PointProps {
  absolutePoint: number
  pointState: PointState | null
  isTop: boolean
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

  const clipPath = isTop
    ? 'polygon(10% 0%, 90% 0%, 50% 100%)'
    : 'polygon(10% 100%, 90% 100%, 50% 0%)'

  const checkers: React.ReactNode[] = []
  if (count > 0 && player !== undefined) {
    const visible = Math.min(count, MAX_VISIBLE)
    for (let i = 0; i < visible; i++) {
      const checkerId = `p${player}-point-${absolutePoint}-${i}`
      const showLabel = i === visible - 1 && count > MAX_VISIBLE ? count : undefined
      checkers.push(
        <Checker
          key={i}
          player={player}
          size={checkerSize}
          checkerId={checkerId}
          label={showLabel}
        />
      )
    }
  }

  const stackStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: isTop ? 'column' : 'column-reverse',
    alignItems: 'center',
    gap: 1,
    top: isTop ? 2 : undefined,
    bottom: isTop ? undefined : 2,
  }

  return (
    <div style={{ position: 'relative', width: pointWidth, height: pointHeight, flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, clipPath, background: pointColor, opacity: 0.85 }} />
      <div style={stackStyle}>{checkers}</div>
    </div>
  )
}
