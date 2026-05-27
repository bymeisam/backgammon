'use client'

interface ControlsProps {
  isPlaying: boolean
  canPrev: boolean
  canNext: boolean
  speed: number
  flipped: boolean
  showMoveList: boolean
  onPlay: () => void
  onPrev: () => void
  onNext: () => void
  onSpeedChange: () => void
  onFlip: () => void
  onToggleMoveList: () => void
}

const SPEEDS = [1000, 500, 250]
const SPEED_LABELS = ['1×', '2×', '4×']

function Btn({
  onClick,
  disabled,
  active,
  children,
  title,
}: {
  onClick: () => void
  disabled?: boolean
  active?: boolean
  children: React.ReactNode
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        background: active ? 'var(--accent)' : 'var(--surface)',
        color: active ? '#000' : 'var(--text-primary)',
        border: '1px solid var(--surface-2)',
        borderRadius: 6,
        padding: '6px 12px',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        fontSize: 13,
        fontFamily: 'inherit',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

export default function Controls({
  isPlaying,
  canPrev,
  canNext,
  speed,
  flipped,
  showMoveList,
  onPlay,
  onPrev,
  onNext,
  onSpeedChange,
  onFlip,
  onToggleMoveList,
}: ControlsProps) {
  const speedIndex = SPEEDS.indexOf(speed)
  const speedLabel = SPEED_LABELS[speedIndex] ?? '1×'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 16px',
        background: 'var(--surface)',
        borderRadius: 8,
        border: '1px solid var(--surface-2)',
        flexWrap: 'wrap',
      }}
    >
      <Btn onClick={onPrev} disabled={!canPrev} title="Previous move">
        ◀ Prev
      </Btn>

      <Btn onClick={onPlay} title={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </Btn>

      <Btn onClick={onNext} disabled={!canNext} title="Next move">
        Next ▶
      </Btn>

      <div style={{ width: 1, height: 20, background: 'var(--surface-2)', margin: '0 4px' }} />

      <Btn onClick={onSpeedChange} title="Change speed">
        Speed {speedLabel}
      </Btn>

      <Btn onClick={onFlip} active={flipped} title="Flip board">
        ⇅ Flip
      </Btn>

      <Btn onClick={onToggleMoveList} active={showMoveList} title="Toggle move list">
        ☰ Moves
      </Btn>
    </div>
  )
}
