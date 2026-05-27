interface CheckerProps {
  player: 1 | 2
  size: number
  checkerId?: string
  label?: string | number
  style?: React.CSSProperties
}

export default function Checker({ player, size, checkerId, label, style }: CheckerProps) {
  const isP1 = player === 1

  const base: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    boxSizing: 'border-box',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const p1Style: React.CSSProperties = {
    ...base,
    background: `radial-gradient(circle at 35% 35%, var(--checker-p1-shine) 0%, var(--checker-p1) 55%, var(--checker-p1-shadow) 100%)`,
    border: '1.5px solid rgba(200,185,150,0.4)',
    boxShadow: '0 2px 5px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
  }

  const p2Style: React.CSSProperties = {
    ...base,
    background: `radial-gradient(circle at 33% 33%, #3d3d3d 0%, #1a1a1a 45%, #000000 100%)`,
    border: '1.5px solid rgba(255,255,255,0.28)',
    boxShadow: '0 2px 5px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
  }

  const checkerStyle = isP1 ? p1Style : p2Style
  const textColor = isP1 ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.9)'

  return (
    <div
      data-id="checker-root"
      data-checker-id={checkerId}
      style={{ ...checkerStyle, ...style }}
    >
      {label !== undefined && (
        <span
          data-id="checker-label"
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
