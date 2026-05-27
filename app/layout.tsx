'use client'

import './globals.css'
import { useEffect, useState } from 'react'
import type { Theme } from '@/lib/types'
import { THEMES } from '@/lib/themes'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark-modern')

  useEffect(() => {
    const saved = localStorage.getItem('bgv-theme') as Theme | null
    if (saved && THEMES[saved]) setTheme(saved)
  }, [])

  useEffect(() => {
    const vars = THEMES[theme]
    const root = document.documentElement
    for (const [k, v] of Object.entries(vars)) {
      root.style.setProperty(k, v)
    }
    localStorage.setItem('bgv-theme', theme)
  }, [theme])

  return (
    <html lang="en">
      <head>
        <title>Backgammon Replay</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body data-id="layout-body">
        {children}
      </body>
    </html>
  )
}
