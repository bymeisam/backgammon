export function getCheckerCenter(checkerId: string): { x: number; y: number } | null {
  const el = document.querySelector(`[data-checker-id="${checkerId}"]`)
  if (!el) return null
  const rect = el.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

export function getElementCenter(el: Element): { x: number; y: number } {
  const rect = el.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

export function animateCheckerArc(
  overlay: HTMLElement,
  checkerEl: HTMLElement,
  from: { x: number; y: number },
  to: { x: number; y: number },
  duration: number,
  onComplete: () => void
): void {
  const rect = checkerEl.getBoundingClientRect()
  const w = rect.width
  const h = rect.height

  const mid = {
    x: (from.x + to.x) / 2,
    y: Math.min(from.y, to.y) - Math.abs(to.x - from.x) * 0.35 - 20,
  }

  const clone = checkerEl.cloneNode(true) as HTMLElement
  clone.style.cssText = `
    position: absolute;
    left: 0;
    top: 0;
    width: ${w}px;
    height: ${h}px;
    margin: 0;
    pointer-events: none;
    z-index: 1000;
    transform: translate(${from.x - w / 2}px, ${from.y - h / 2}px);
    transition: none;
  `
  overlay.appendChild(clone)

  const start = performance.now()

  function tick(now: number) {
    const t = Math.min((now - start) / duration, 1)
    const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

    const x = (1 - e) ** 2 * from.x + 2 * (1 - e) * e * mid.x + e ** 2 * to.x
    const y = (1 - e) ** 2 * from.y + 2 * (1 - e) * e * mid.y + e ** 2 * to.y

    clone.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px)`

    if (t < 1) {
      requestAnimationFrame(tick)
    } else {
      if (overlay.contains(clone)) overlay.removeChild(clone)
      onComplete()
    }
  }

  requestAnimationFrame(tick)
}
