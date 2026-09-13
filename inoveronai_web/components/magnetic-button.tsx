'use client'

import { useRef, type ReactNode, type MouseEvent, type ButtonHTMLAttributes } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

type MagneticButtonProps = {
  children: ReactNode
  strength?: number
  className?: string
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
  'aria-label'?: string
}

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  type = 'button',
  onClick,
  'aria-label': ariaLabel,
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 280, damping: 22, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 280, damping: 22, mass: 0.4 })

  const handleMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (reduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = event.clientX - (rect.left + rect.width / 2)
    const offsetY = event.clientY - (rect.top + rect.height / 2)
    const max = 14
    x.set(Math.max(-max, Math.min(max, offsetX * strength)))
    y.set(Math.max(-max, Math.min(max, offsetY * strength)))
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      className={className}
      style={{ x: springX, y: springY }}
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.button>
  )
}
