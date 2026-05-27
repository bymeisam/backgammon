'use client'

import { useRef, useState } from 'react'

interface FileUploadProps {
  onFile: (text: string) => void
}

export default function FileUpload({ onFile }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function readFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      onFile(text)
    }
    reader.readAsText(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) readFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) readFile(file)
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--surface-2)'}`,
        background: dragging ? 'var(--surface-2)' : 'var(--surface)',
        borderRadius: 12,
        padding: '48px 64px',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s',
        maxWidth: 480,
        width: '100%',
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎲</div>
      <p style={{ color: 'var(--text-primary)', marginBottom: 4, fontSize: 16 }}>
        Drop your .txt match file here
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
        or click to browse
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".txt"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  )
}
