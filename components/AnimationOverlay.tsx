'use client'

import { forwardRef } from 'react'

const AnimationOverlay = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      data-id="animation-overlay-canvas"
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  )
})

AnimationOverlay.displayName = 'AnimationOverlay'

export default AnimationOverlay
