import Checker from './Checker'

interface BearoffTrayProps {
  p1Count: number
  p2Count: number
  checkerSize: number
}

export default function BearoffTray({ p1Count, p2Count, checkerSize }: BearoffTrayProps) {
  const small = Math.max(8, checkerSize * 0.55)

  return (
    <div
      style={{
        width: checkerSize + 12,
        height: '100%',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--surface-2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px 4px',
        gap: 4,
        flexShrink: 0,
      }}
    >
      {/* P2 borne off (top) */}
      <div
        data-checker-id="p2-bearoff"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          maxWidth: checkerSize + 8,
          flex: 1,
          alignContent: 'flex-start',
        }}
      >
        {p2Count > 0 && (
          <Checker player={2} size={small} label={p2Count > 1 ? p2Count : undefined} />
        )}
      </div>

      <div style={{ height: 1, width: '80%', background: 'var(--surface-2)' }} />

      {/* P1 borne off (bottom) */}
      <div
        data-checker-id="p1-bearoff"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          maxWidth: checkerSize + 8,
          flex: 1,
          alignContent: 'flex-end',
        }}
      >
        {p1Count > 0 && (
          <Checker player={1} size={small} label={p1Count > 1 ? p1Count : undefined} />
        )}
      </div>
    </div>
  )
}
