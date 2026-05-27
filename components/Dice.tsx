interface DiceProps {
  dice: [number, number]
  player: 1 | 2
  noMove?: boolean
}

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]],
}

function DieFace({ value, size = 38 }: { value: number; size?: number }) {
  const dots = DOT_POSITIONS[value] ?? []
  const dotSize = size * 0.17

  return (
    <div
      data-id="dice-die-face"
      style={{
        width: size,
        height: size,
        background: 'var(--dice-bg)',
        borderRadius: Math.round(size * 0.16),
        position: 'relative',
        boxShadow: `0 2px 6px var(--dice-shadow), inset 0 1px 0 rgba(255,255,255,0.4)`,
        flexShrink: 0,
      }}
    >
      {dots.map(([x, y], i) => (
        <div
          key={i}
          data-id={`dice-dot-${i}`}
          style={{
            position: 'absolute',
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: 'var(--dice-dot)',
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  )
}

export default function Dice({ dice, noMove }: DiceProps) {
  return (
    <div data-id="dice-root" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <DieFace value={dice[0]} />
      <DieFace value={dice[1]} />
      {noMove && (
        <span data-id="dice-no-move" style={{ fontSize: 10, color: 'var(--text-secondary)', marginLeft: 2 }}>
          no move
        </span>
      )}
    </div>
  )
}
