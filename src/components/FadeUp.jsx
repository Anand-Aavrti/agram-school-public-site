'use client'
import { useEffect, useRef } from 'react'

// Scroll-reveal wrapper. Replays every time the element re-enters the viewport
// (scrolling down OR back up). Vertical variants flip to match the side the
// element re-enters from, so motion always follows the scroll direction.
// direction: up | down | left | right | pop | zoom | blur
export default function FadeUp({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timer
    let resetTimer

    // Hysteresis + debounce: reveal once 15% is visible; reset only after the
    // element has stayed FULLY offscreen for 300ms. Transform-based reveals
    // (zoom/pop) change the element's measured size mid-animation and can
    // re-trigger the observer around the threshold — without this latch the
    // reveal strobes on and off while partially visible.
    const io = new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1]
      if (e.intersectionRatio >= 0.15) {
        clearTimeout(resetTimer)
        clearTimeout(timer)
        if (!el.classList.contains('in')) {
          timer = setTimeout(() => el.classList.add('in'), delay)
        }
      } else if (!e.isIntersecting) {
        clearTimeout(timer)
        clearTimeout(resetTimer)
        const exitedTop = e.boundingClientRect.top < 0
        resetTimer = setTimeout(() => {
          // The element left through the top → it will re-enter from the top
          // on scroll-up, so it should drop in from above (and vice versa).
          if (direction === 'up' || direction === 'down') {
            el.dataset.dir = exitedTop ? 'down' : 'up'
          }
          // Reset instantly while offscreen so the next entry animates fresh.
          el.classList.add('no-anim')
          el.classList.remove('in')
          void el.offsetHeight
          el.classList.remove('no-anim')
        }, 300)
      }
      // Partially visible below 15%: leave the current state untouched.
    }, { threshold: [0, 0.15] })

    io.observe(el)
    return () => { clearTimeout(timer); clearTimeout(resetTimer); io.disconnect() }
  }, [delay, direction])

  return <div ref={ref} data-dir={direction} className={`reveal ${className}`}>{children}</div>
}
