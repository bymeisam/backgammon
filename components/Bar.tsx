import Checker from './Checker'

interface BarProps {
  p1Count: number
  p2Count: number
  checkerSize: number
  barWidth: number
}

export default function Bar({ p1Count, p2Count, checkerSize, barWidth }: BarProps) {
  return (
    <div
      style={{
        width: barWidth,
        height: '100%',
        background: 'var(--bar-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* P2 checkers on top half of bar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {Array.from({ length: p2Count }).map((_, i) => (
          <Checker
            key={i}
            player={2}
            size={checkerSize}
            checkerId={`p2-bar-${i}`}
          />
        ))}
      </div>

      {/* Divider */}
      <div style={{ width: '60%', height: 1, background: 'var(--surface-2)', margin: '4px 0' }} />

      {/* P1 checkers on bottom half of bar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {Array.from({ length: p1Count }).map((_, i) => (
          <Checker
            key={i}
            player={1}
            size={checkerSize}
            checkerId={`p1-bar-${i}`}
          />
        ))}
      </div>
    </div>
  )
}
