'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from './section-heading'
import { RevealGroup, revealItem } from './reveal'

const stats = [
  { value: '240%', label: 'Priemerné ROI v prvom roku', type: 'line' },
  { value: '30%', label: 'Ušetrený čas zamestnancov', type: 'ring' },
  { value: '40–75%', label: 'Zníženie operatívnych chýb', type: 'bars' },
]

function MetricVisual({ type }: { type: string }) {
  if (type === 'ring') {
    return (
      <div className="relative mx-auto mt-7 size-24">
        <svg viewBox="0 0 100 100" className="-rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" className="text-border" strokeWidth="8" />
          <motion.circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="url(#ring-gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            pathLength="1"
            initial={{ strokeDasharray: '0 1' }}
            whileInView={{ strokeDasharray: '0.3 0.7' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="ring-gradient">
              <stop stopColor="#63d8ff" />
              <stop offset="1" stopColor="#e261b3" />
            </linearGradient>
          </defs>
        </svg>
        <motion.span
          className="absolute inset-0 grid place-items-center text-xs font-bold uppercase tracking-wider text-cyan"
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55 }}
        >
          Čas
        </motion.span>
      </div>
    )
  }

  if (type === 'bars') {
    return (
      <div className="mx-auto mt-8 flex h-20 max-w-40 items-end justify-center gap-2" aria-hidden="true">
        {[28, 44, 36, 62, 78, 91].map((height, index) => (
          <motion.span
            key={height}
            className="w-3 rounded-t bg-gradient-brand"
            initial={{ height: 0, opacity: 0.25 }}
            whileInView={{ height: `${height}%`, opacity: 0.75 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
    )
  }

  return (
    <svg viewBox="0 0 180 78" className="mx-auto mt-7 h-20 w-44" aria-hidden="true">
      <path d="M4 70 H176 M4 45 H176 M4 20 H176" stroke="currentColor" className="text-border" strokeWidth="1" strokeDasharray="3 6" />
      <motion.path
        d="M6 67 C31 65, 36 56, 54 58 S79 42, 96 45 S117 28, 135 31 S154 12, 176 8"
        fill="none"
        stroke="url(#chart-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cx="176"
        cy="8"
        r="4"
        fill="#70dfff"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.1 }}
      />
      <defs>
        <linearGradient id="chart-gradient">
          <stop stopColor="#dd5ead" />
          <stop offset="1" stopColor="#68ddff" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function Stats() {
  return (
    <section id="results" className="relative hex-grid py-32 sm:py-44">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex justify-center">
          <SectionHeading
            eyebrow="Trhové štandardy"
            title="Obchodný dopad"
            highlight="systémov"

          />
        </div>

        <RevealGroup className="mt-20 grid gap-8 sm:grid-cols-3">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={revealItem}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center transition-colors hover:border-cyan/50 hover:shadow-[0_0_36px_-10px_var(--cyan)]"
            >
              <motion.div
                className="text-gradient font-display text-4xl font-bold sm:text-5xl"
                initial={{ scale: 0.7, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                {s.value}
              </motion.div>
              <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
              <MetricVisual type={s.type} />
              <div className="pointer-events-none absolute -right-12 -top-12 size-28 rounded-full bg-cyan/5 blur-2xl transition-colors group-hover:bg-cyan/10" />
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
