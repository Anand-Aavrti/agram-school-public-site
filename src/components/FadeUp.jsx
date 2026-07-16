'use client'
import { useEffect, useRef } from 'react'

export default function FadeUp({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => el.classList.add('in'), delay)
        io.disconnect()
      }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [delay])
  return <div ref={ref} data-dir={direction} className={`reveal ${className}`}>{children}</div>
}
