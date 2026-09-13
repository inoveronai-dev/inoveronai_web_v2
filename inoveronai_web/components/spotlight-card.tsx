'use client'

import { useRef, type ReactNode, type MouseEvent } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

type SpotlightCardProps = HTMLMotionProps<'article'> & {
  children: ReactNode
}

export function SpotlightCard({
  children,
  className = '',
  onMouseMove,
  onMouseLeave,
  style,
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLElement>(null)

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    onMouseMove?.(event)
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--spot-x', `${x}%`)
    el.style.setProperty('--spot-y', `${y}%`)
    el.dataset.spot = 'on'
  }

  const handleLeave = (event: MouseEvent<HTMLElement>) => {
    onMouseLeave?.(event)
    const el = ref.current
    if (!el) return
    el.dataset.spot = 'off'
  }

  return (
    <motion.article
      ref={ref as never}
      data-spot="off"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`spotlight-card group/spot relative overflow-hidden ${className}`}
      style={style}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] opacity-0 transition-opacity duration-300 group-data-[spot=on]/spot:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), oklch(0.78 0.14 210 / 0.16), transparent 55%)',
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] opacity-0 transition-opacity duration-300 group-data-[spot=on]/spot:opacity-100"
        style={{
          background:
            'radial-gradient(300px circle at var(--spot-x, 50%) var(--spot-y, 50%), oklch(0.68 0.22 330 / 0.55), transparent 45%)',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />
      <div className="relative z-[2] flex h-full flex-col">{children}</div>
    </motion.article>
  )
}
