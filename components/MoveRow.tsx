import type { Snapshot } from '@/lib/types'

interface MoveRowProps {
  moveNumber: number
  p1Snapshot: Snapshot | null
  p2Snapshot: Snapshot | null
  p1SnapshotIndex: number | null
  p2SnapshotIndex: number | null
  currentSnapshotIndex: number
  flipped: boolean
  onJump: (idx: number) => void
  rowRef?: React.RefObject<HTMLDivElement | null>
}

function formatSubMoves(snapshot: Snapshot | null): string {
  if (!snapshot?.move) return '—'
  const move = snapshot.move

  if (move.action === 'double') return `✕${move.dice[0]}`
  if (move.action === 'take') return '✓ Takes'
  if (move.action === 'drop') return '✗ Drops'

  if (move.subMoves.length === 0) return `${move.dice[0]}${move.dice[1]}: —`

  const parts = move.subMoves.map((sm) => {
    const from = sm.from === 'bar' ? 'bar' : sm.from
    const to = sm.to === 'off' ? 'off' : sm.to
    return `${from}/${to}`
  })

  // Collapse consecutive duplicates
  const collapsed: string[] = []
  for (let i = 0; i < parts.length; ) {
    let j = i + 1
    while (j < parts.length && parts[j] === parts[i]) j++
    const count = j - i
    collapsed.push(count > 1 ? `${parts[i]}×${count}` : parts[i])
    i = j
  }

  return `${move.dice[0]}${move.dice[1]}: ${collapsed.join(' ')}`
}

function formatWinResult(snapshot: Snapshot | null, player: 1 | 2): string | null {
  // Check if next snapshot doesn't exist (last move = possible win)
  return null // Win display handled in row text for now
}

export default function MoveRow({
  moveNumber,
  p1Snapshot,
  p2Snapshot,
  p1SnapshotIndex,
  p2SnapshotIndex,
  currentSnapshotIndex,
  flipped,
  onJump,
  rowRef,
}: MoveRowProps) {
  const leftSnapshot = flipped ? p2Snapshot : p1Snapshot
  const rightSnapshot = flipped ? p1Snapshot : p2Snapshot
  const leftIdx = flipped ? p2SnapshotIndex : p1SnapshotIndex
  const rightIdx = flipped ? p1SnapshotIndex : p2SnapshotIndex

  const leftActive = leftIdx !== null && leftIdx === currentSnapshotIndex
  const rightActive = rightIdx !== null && rightIdx === currentSnapshotIndex

  function cellStyle(active: boolean, hasMove: boolean): React.CSSProperties {
    return {
      padding: '3px 8px',
      fontSize: 11,
      color: active ? 'var(--accent)' : hasMove ? 'var(--text-primary)' : 'var(--text-secondary)',
      background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
      borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
      cursor: hasMove ? 'pointer' : 'default',
      userSelect: 'none',
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      transition: 'background 0.1s',
    }
  }

  const isActiveRow = leftActive || rightActive

  return (
    <div
      data-id="move-row-root"
      ref={isActiveRow ? rowRef : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--surface-2)',
        minHeight: 26,
      }}
    >
      <div
        data-id="move-row-number"
        style={{
          width: 28,
          flexShrink: 0,
          fontSize: 10,
          color: 'var(--text-secondary)',
          textAlign: 'right',
          paddingRight: 6,
        }}
      >
        {moveNumber}
      </div>

      <div
        data-id="move-row-left-cell"
        style={cellStyle(leftActive, leftIdx !== null)}
        onClick={() => leftIdx !== null && onJump(leftIdx)}
        onMouseEnter={(e) => {
          if (leftIdx !== null && !leftActive)
            (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'
        }}
        onMouseLeave={(e) => {
          if (!leftActive)
            (e.currentTarget as HTMLElement).style.background = 'transparent'
        }}
      >
        {formatSubMoves(leftSnapshot)}
      </div>

      <div
        data-id="move-row-right-cell"
        style={cellStyle(rightActive, rightIdx !== null)}
        onClick={() => rightIdx !== null && onJump(rightIdx)}
        onMouseEnter={(e) => {
          if (rightIdx !== null && !rightActive)
            (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'
        }}
        onMouseLeave={(e) => {
          if (!rightActive)
            (e.currentTarget as HTMLElement).style.background = 'transparent'
        }}
      >
        {formatSubMoves(rightSnapshot)}
      </div>
    </div>
  )
}
