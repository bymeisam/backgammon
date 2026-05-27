function BearoffChecker({ player, checkerSize }: { player: 1 | 2; checkerSize: number }) {
  const rimHeight = Math.round(checkerSize * 0.32)
  return (
    <div style={{
      width: checkerSize,
      height: rimHeight,
      flexShrink: 0,
      borderRadius: 3,
      background: player === 1
        ? 'linear-gradient(to bottom, var(--checker-p1-shine), var(--checker-p1) 40%, var(--checker-p1-shadow))'
        : 'linear-gradient(to bottom, var(--checker-p2-shine), var(--checker-p2) 40%, var(--checker-p2-shadow))',
      boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
      border: player === 1
        ? '1px solid var(--checker-border-p1)'
        : '1px solid var(--checker-border-p2)',
    }} />
  )
}

interface BearoffTrayProps {
  p1Count: number
  p2Count: number
  checkerSize: number
  flipped: boolean
}

export default function BearoffTray({ p1Count, p2Count, checkerSize, flipped }: BearoffTrayProps) {
  const topPlayer    = flipped ? 1 : 2
  const bottomPlayer = flipped ? 2 : 1
  const topCount     = flipped ? p1Count : p2Count
  const bottomCount  = flipped ? p2Count : p1Count

  return (
    <div style={{
      width: checkerSize + 10,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      borderLeft: '2px solid var(--board-border)',
    }}>
      {/* Top half — stack downward from top */}
      <div
        data-checker-id={`p${topPlayer}-bearoff`}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 6,
          paddingBottom: 4,
          gap: 2,
          background: 'var(--bearoff-top-bg)',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: topCount }).map((_, i) => (
          <BearoffChecker key={i} player={topPlayer} checkerSize={checkerSize} />
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 2, background: 'var(--board-border)', flexShrink: 0 }} />

      {/* Bottom half — stack upward from bottom */}
      <div
        data-checker-id={`p${bottomPlayer}-bearoff`}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 6,
          paddingTop: 4,
          gap: 2,
          background: 'var(--bearoff-bottom-bg)',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: bottomCount }).map((_, i) => (
          <BearoffChecker key={i} player={bottomPlayer} checkerSize={checkerSize} />
        ))}
      </div>
    </div>
  )
}
