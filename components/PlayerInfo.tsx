interface PlayerInfoProps {
  name: string
  score: number
  matchLength: number
  pipCount?: number
  showPipCount: boolean
  isBottom: boolean
}

export default function PlayerInfo({ name, score, matchLength, pipCount, showPipCount, isBottom }: PlayerInfoProps) {
  return (
    <div
      data-id="player-info-root"
      style={{
        display: 'flex',
        alignItems: isBottom ? 'flex-end' : 'flex-start',
        flexDirection: 'column',
        gap: 2,
        padding: '4px 0',
      }}
    >
      <div
        data-id="player-info-name"
        className="font-display"
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
        }}
      >
        {name}
      </div>
      <div data-id="player-info-score-row" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span
          data-id="player-info-score"
          style={{
            fontSize: 13,
            color: 'var(--accent)',
            fontWeight: 600,
          }}
        >
          {score} / {matchLength}
        </span>
        {showPipCount && pipCount !== undefined && (
          <span data-id="player-info-pip-count" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            pip: {pipCount}
          </span>
        )}
      </div>
    </div>
  )
}
