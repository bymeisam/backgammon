'use client'

import { useEffect, useState } from 'react'
import type { Theme } from '@/lib/types'
import { THEMES, THEME_SWATCHES, THEME_LABELS } from '@/lib/themes'

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('dark-modern')

  useEffect(() => {
    const saved = localStorage.getItem('bgv-theme') as Theme | null
    if (saved && THEMES[saved]) setTheme(saved)
  }, [])

  function applyTheme(t: Theme) {
    setTheme(t)
    const vars = THEMES[t]
    const root = document.documentElement
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v)
    localStorage.setItem('bgv-theme', t)
  }

  return (
    <div data-id="theme-switcher-root" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {(Object.keys(THEMES) as Theme[]).map((t) => (
        <button
          key={t}
          data-id={`theme-switcher-swatch-${t}`}
          title={THEME_LABELS[t]}
          onClick={() => applyTheme(t)}
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: THEME_SWATCHES[t],
            border: theme === t
              ? '2px solid var(--accent)'
              : '2px solid var(--surface-2)',
            outline: theme === t ? '2px solid var(--surface-2)' : 'none',
            outlineOffset: 1,
            cursor: 'pointer',
            padding: 0,
            transition: 'border-color 0.15s, outline 0.15s',
          }}
        />
      ))}
    </div>
  )
}
