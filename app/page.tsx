'use client'

import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import MatchViewer from '@/components/MatchViewer'
import type { Match } from '@/lib/types'
import { parseMatch } from '@/lib/parser'

export default function Home() {
  const [match, setMatch] = useState<Match | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleFile(text: string) {
    try {
      const parsed = parseMatch(text)
      if (parsed.games.length === 0) throw new Error('No games found in file')
      setMatch(parsed)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse file')
    }
  }

  if (match) {
    return <MatchViewer match={match} onReset={() => setMatch(null)} />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1
        className="text-4xl font-bold mb-2 font-display"
        style={{ color: 'var(--text-primary)' }}
      >
        Backgammon Replay
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
        Upload a Backgammon Galaxy match file to replay
      </p>
      <FileUpload onFile={handleFile} />
      {error && (
        <p className="mt-4 text-sm" style={{ color: '#e74c3c' }}>
          {error}
        </p>
      )}
    </div>
  )
}
