import type { Move } from '@/lib/types'

interface BoardSideStripProps {
  match: { player1: string; player2: string }
  currentMove: Move | null
  flipped: boolean
}

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[72, 28], [28, 72]],
  3: [[72, 28], [50, 50], [28, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]],
}

const DIE_SIZE = 26

function DieDots({ value }: { value: number }) {
  const dots = DOT_POSITIONS[value] ?? []
  const dotSize = DIE_SIZE * 0.2
  return (
    <>
      {dots.map(([x, y], i) => (
        <div
          key={i}
          data-id={`board-side-strip-die-dot-${i}`}
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
    </>
  )
}

function Die({ value }: { value: number | null }) {
  return (
    <div
      data-id="board-side-strip-die"
      style={{
        width: DIE_SIZE,
        height: DIE_SIZE,
        borderRadius: 5,
        background: value !== null ? 'var(--dice-bg)' : 'var(--surface-2)',
        opacity: value !== null ? 1 : 0.25,
        boxShadow: value !== null ? '0 2px 6px var(--dice-shadow)' : 'none',
        position: 'relative',
        transition: 'opacity 150ms ease',
        flexShrink: 0,
      }}
    >
      {value !== null && <DieDots value={value} />}
    </div>
  )
}

function DicePair({ dice }: { dice: [number, number] | null }) {
  return (
    <div data-id="board-side-strip-dice-pair" style={{ display: 'flex', gap: 4 }}>
      <Die value={dice?.[0] ?? null} />
      <Die value={dice?.[1] ?? null} />
    </div>
  )
}

function PlayerNameLabel({ name }: { name: string }) {
  return (
    <div
      data-id="board-side-strip-player-name"
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-display)',
        textAlign: 'center',
        wordBreak: 'break-word',
        maxWidth: 72,
        lineHeight: 1.3,
      }}
    >
      {name}
    </div>
  )
}

export default function BoardSideStrip({ match, currentMove, flipped }: BoardSideStripProps) {
  const topPlayer  = flipped ? 1 : 2
  const botPlayer  = flipped ? 2 : 1
  const topName    = topPlayer === 1 ? match.player1 : match.player2
  const botName    = botPlayer === 1 ? match.player1 : match.player2

  const activeDice = currentMove && !currentMove.action ? currentMove.dice : null
  const topDice    = currentMove?.player === topPlayer  ? activeDice : null
  const botDice    = currentMove?.player === botPlayer  ? activeDice : null

  return (
    <div
      data-id="board-side-strip-root"
      style={{
        width: 80,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 4px',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--board-border)',
        flexShrink: 0,
      }}
    >
      {/* Top player */}
      <div data-id="board-side-strip-top-player" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <PlayerNameLabel name={topName} />
        <DicePair dice={topDice} />
      </div>

      {/* Bottom player */}
      <div data-id="board-side-strip-bottom-player" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <DicePair dice={botDice} />
        <PlayerNameLabel name={botName} />
      </div>
    </div>
  )
}
