import { useEffect, useRef, useState } from 'react'

/**
 * Retro editorial cursor:
 *  - Small filled dot that sits exactly on the pointer
 *  - Larger hollow ring that lags behind (spring-like follow)
 *  - Ring grows + fills lightly when hovering interactive elements
 *
 * On touch / mobile devices this component renders nothing and the
 * native cursor (none) CSS rule is not applied either.
 */
export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  // Ring position (lagged)
  const ringPos = useRef({ x: -100, y: -100 })
  // Cursor position (instant)
  const curPos  = useRef({ x: -100, y: -100 })
  const hovering = useRef(false)
  const raf = useRef(null)

  const [visible, setVisible] = useState(false)

  // Detect touch / mobile — no custom cursor on those devices.
  // We check at render time (matchMedia / maxTouchPoints) so we can bail
  // out before registering any event listeners or rendering DOM elements.
  const isTouchDevice =
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0)

  useEffect(() => {
    // Skip on touch devices — nothing to set up
    if (isTouchDevice) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMove = (e) => {
      curPos.current = { x: e.clientX, y: e.clientY }
      if (!visible) setVisible(true)

      // Move dot instantly
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    const onEnter = (e) => {
      if (
        e.target.closest('a, button, input, textarea, select, [role="button"], iframe')
      ) {
        hovering.current = true
        ring.classList.add('cursor-ring--hover')
        dot.classList.add('cursor-dot--hover')
      }
    }

    const onLeave = (e) => {
      if (
        e.target.closest('a, button, input, textarea, select, [role="button"], iframe')
      ) {
        hovering.current = false
        ring.classList.remove('cursor-ring--hover')
        dot.classList.remove('cursor-dot--hover')
      }
    }

    const animate = () => {
      // Ease ring toward cursor
      const ease = 0.12
      ringPos.current.x += (curPos.current.x - ringPos.current.x) * ease
      ringPos.current.y += (curPos.current.y - ringPos.current.y) * ease

      ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`

      raf.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout',  onLeave)

    raf.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout',  onLeave)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Don't render cursor elements on touch / mobile devices
  if (isTouchDevice) return null

  return (
    <>
      {/* Trailing ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          border: '1.5px solid hsl(var(--primary))',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: visible ? 1 : 0,
          transition: 'width 0.2s ease, height 0.2s ease, margin 0.2s ease, background 0.2s ease, opacity 0.3s ease',
          willChange: 'transform',
        }}
        className="cursor-ring"
      />

      {/* Instant dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 7,
          height: 7,
          marginLeft: -3.5,
          marginTop: -3.5,
          background: 'hsl(var(--primary))',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 100000,
          opacity: visible ? 1 : 0,
          transition: 'width 0.15s ease, height 0.15s ease, margin 0.15s ease, opacity 0.3s ease',
          willChange: 'transform',
        }}
        className="cursor-dot"
      />
    </>
  )
}
