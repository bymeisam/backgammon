const CHECKER_SIZE = 28

function BarChecker({ count, player }: { count: number; player: 1 | 2 }) {
  const visible = count > 0
  return (
    <div style={{
      visibility: visible ? 'visible' : 'hidden',
      opacity: visible ? 1 : 0,
      transition: 'opacity 150ms ease',
      width: CHECKER_SIZE,
      height: CHECKER_SIZE,
      borderRadius: '50%',
      background: player === 1
        ? 'radial-gradient(circle at 35% 35%, var(--checker-p1-shine), var(--checker-p1), var(--checker-p1-shadow))'
        : 'radial-gradient(circle at 35% 35%, var(--checker-p2-shine), var(--checker-p2), var(--checker-p2-shadow))',
      border: player === 1
        ? '1.5px solid var(--checker-border-p1)'
        : '1.5px solid var(--checker-border-p2)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      {count > 1 && (
        <span style={{
          fontSize: CHECKER_SIZE * 0.38,
          fontWeight: 700,
          color: player === 1 ? 'var(--checker-p1-shadow)' : 'var(--checker-p2-shine)',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1,
          userSelect: 'none',
        }}>
          {count}
        </span>
      )}
    </div>
  )
}

function BarPipCount({ pip, visible }: { pip: number; visible: boolean }) {
  return (
    <div style={{
      visibility: visible ? 'visible' : 'hidden',
      opacity: visible ? 1 : 0,
      transition: 'opacity 150ms ease',
      color: 'var(--text-secondary)',
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      textAlign: 'center',
      letterSpacing: '0.02em',
      userSelect: 'none',
      whiteSpace: 'nowrap',
    }}>
      {pip}
    </div>
  )
}

interface BarProps {
  bar: { p1: number; p2: number }
  pipCount: { p1: number; p2: number }
  showPipCount: boolean
  flipped: boolean
  barWidth: number
}

export default function Bar({ bar, pipCount, showPipCount, flipped, barWidth }: BarProps) {
  const top = flipped
    ? { player: 1 as const, barCount: bar.p1, pip: pipCount.p1 }
    : { player: 2 as const, barCount: bar.p2, pip: pipCount.p2 }

  const bottom = flipped
    ? { player: 2 as const, barCount: bar.p2, pip: pipCount.p2 }
    : { player: 1 as const, barCount: bar.p1, pip: pipCount.p1 }

  return (
    <div style={{
      width: barWidth,
      height: '100%',
      background: 'var(--bar-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 0',
      flexShrink: 0,
    }}>
      {/* Top half — checker outer (top), pip inner (toward center) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <BarChecker count={top.barCount} player={top.player} />
        <BarPipCount pip={top.pip} visible={showPipCount} />
      </div>

      {/* Bottom half — pip inner (toward center), checker outer (bottom) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <BarPipCount pip={bottom.pip} visible={showPipCount} />
        <BarChecker count={bottom.barCount} player={bottom.player} />
      </div>
    </div>
  )
}
