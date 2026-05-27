interface BarCheckerProps {
  count: number
  player: 1 | 2
  checkerSize: number
}

function BarChecker({ count, player, checkerSize }: BarCheckerProps) {
  const visible = count > 0
  return (
    <div data-id="bar-checker" style={{
      visibility: visible ? 'visible' : 'hidden',
      opacity: visible ? 1 : 0,
      transition: 'opacity 150ms ease',
      width: checkerSize,
      height: checkerSize,
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
        <span data-id="bar-checker-count" style={{
          fontSize: checkerSize * 0.40,
          fontWeight: 800,
          color: player === 1 ? 'rgba(0,0,0,0.75)' : '#ffffff',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1,
          userSelect: 'none',
          textShadow: player === 1 ? 'none' : '0 1px 2px rgba(0,0,0,0.8)',
        }}>
          {count}
        </span>
      )}
    </div>
  )
}

function BarPipCount({ pip, visible }: { pip: number; visible: boolean }) {
  return (
    <div data-id="bar-pip-count" style={{
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
  checkerSize: number
}

export default function Bar({ bar, pipCount, showPipCount, flipped, barWidth, checkerSize }: BarProps) {
  const top = flipped
    ? { player: 1 as const, barCount: bar.p1, pip: pipCount.p1 }
    : { player: 2 as const, barCount: bar.p2, pip: pipCount.p2 }

  const bottom = flipped
    ? { player: 2 as const, barCount: bar.p2, pip: pipCount.p2 }
    : { player: 1 as const, barCount: bar.p1, pip: pipCount.p1 }

  return (
    <div data-id="bar-root" style={{
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
      {/* Top half: pip outer (top), checker inner (toward center) */}
      <div data-id="bar-top-player" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <BarPipCount pip={top.pip} visible={showPipCount} />
        <BarChecker count={top.barCount} player={top.player} checkerSize={checkerSize} />
      </div>

      {/* Bottom half: checker inner (toward center), pip outer (bottom) */}
      <div data-id="bar-bottom-player" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <BarChecker count={bottom.barCount} player={bottom.player} checkerSize={checkerSize} />
        <BarPipCount pip={bottom.pip} visible={showPipCount} />
      </div>
    </div>
  )
}
