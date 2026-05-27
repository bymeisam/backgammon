interface CheckerProps {
  player: 1 | 2
  size: number
  checkerId?: string
  label?: string | number
  style?: React.CSSProperties
}

export default function Checker({ player, size, checkerId, label, style }: CheckerProps) {
  const isP1 = player === 1
  const bg = isP1
    ? `radial-gradient(circle at 35% 35%, var(--checker-p1-shine) 0%, var(--checker-p1) 50%, var(--checker-p1-shadow) 100%)`
    : `radial-gradient(circle at 35% 35%, var(--checker-p2-shine) 0%, var(--checker-p2) 50%, var(--checker-p2-shadow) 100%)`

  const border = isP1 ? 'var(--checker-border-p1)' : 'var(--checker-border-p2)'
  const shadow = isP1
    ? '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'
    : '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)'

  // P1 is always light (ivory), P2 is always dark or deep-colored → white label
  const textColor = isP1 ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.9)'

  return (
    <div
      data-checker-id={checkerId}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        border: `1.5px solid ${border}`,
        boxShadow: shadow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
        ...style,
      }}
    >
      {label !== undefined && (
        <span
          style={{
            fontSize: size * 0.36,
            fontWeight: 700,
            color: textColor,
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
