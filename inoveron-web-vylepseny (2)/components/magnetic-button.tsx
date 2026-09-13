'use client'

import { useRef, type ReactNode, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion, type HTMLMotionProps } from 'framer-motion'

type MagneticButtonProps = HTMLMotionProps<'a'> & {
  children: ReactNode
  strength?: number
}

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  onMouseMove,
  onMouseLeave,
  style,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 280, damping: 22, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 280, damping: 22, mass: 0.4 })

  const handleMove = (event: MouseEvent<HTMLAnchorElement>) => {
    onMouseMove?.(event)
    if (reduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = event.clientX - (rect.left + rect.width / 2)
    const offsetY = event.clientY - (rect.top + rect.height / 2)
    const max = 14
    x.set(Math.max(-max, Math.min(max, offsetX * strength)))
    y.set(Math.max(-max, Math.min(max, offsetY * strength)))
  }

  const handleLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    onMouseLeave?.(event)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      className={className}
      style={{ x: springX, y: springY, ...style }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...props}
    >
      {children}
    </motion.a>
  )
}
