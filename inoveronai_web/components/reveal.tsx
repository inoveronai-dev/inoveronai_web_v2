'use client'

import { motion, useInView, type Variants } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

const easeOut = [0.22, 1, 0.36, 1] as const

/** Fade-up + CSS blur-to-sharp on scroll into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div
      ref={ref}
      className={`reveal-cinematic ${inView ? 'is-visible' : ''} ${className ?? ''}`}
      style={{
        transitionDelay: `${delay}s`,
        ['--reveal-y' as string]: `${y}px`,
      }}
    >
      {children}
    </div>
  )
}

/** Container that staggers its RevealItem children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.12,
}: {
  children: ReactNode
  className?: string
  stagger?: number
}) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger } },
  }
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  )
}

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
}
