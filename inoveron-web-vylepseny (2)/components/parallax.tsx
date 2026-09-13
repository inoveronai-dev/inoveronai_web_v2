'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

type ParallaxProps = {
  children: ReactNode
  className?: string
  /** Scroll distance in px applied across the section (negative = slower / upward). */
  offset?: number
}

export function Parallax({ children, className, offset = 80 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [offset, -offset])

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className ?? ''}`}>
      <motion.div className="absolute inset-[-12%] will-change-transform" style={{ y }}>
        {children}
      </motion.div>
    </div>
  )
}
