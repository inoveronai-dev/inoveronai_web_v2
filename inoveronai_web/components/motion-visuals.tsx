'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { BrainCircuit, Database, Target, Workflow } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

export function FlowBottleneck() {
  const reduceMotion = useReducedMotion()
  const streams = [54, 82, 110, 138, 166]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease }}
      className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-5 shadow-[0_0_70px_-35px_var(--cyan)] backdrop-blur-xl sm:p-7"
    >
      <div className="mb-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        <span>Manuálna operatíva</span>
        <span className="text-cyan">Automatizovaný tok</span>
      </div>
      <svg viewBox="0 0 360 220" className="h-auto w-full" role="img" aria-label="Tok práce prechádzajúci úzkym miestom">
        <defs>
          <linearGradient id="flow-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#df5da9" stopOpacity="0.25" />
            <stop offset="0.52" stopColor="#63d8ff" stopOpacity="0.8" />
            <stop offset="1" stopColor="#63d8ff" stopOpacity="0.16" />
          </linearGradient>
          <radialGradient id="flow-core">
            <stop offset="0" stopColor="#e879c2" stopOpacity="0.95" />
            <stop offset="1" stopColor="#63d8ff" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {streams.map((y, index) => (
          <motion.path
            key={y}
            d={`M18 ${y} C105 ${y}, 125 ${110 + (y - 110) * 0.18}, 176 110 S250 ${y}, 342 ${y}`}
            fill="none"
            stroke="url(#flow-line)"
            strokeWidth="1.4"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: index * 0.08, ease }}
          />
        ))}

        {streams.map((y, index) => (
          <motion.circle
            key={`pulse-${y}`}
            r="3.1"
            fill={index % 2 ? '#ef91cf' : '#82e5ff'}
            animate={reduceMotion ? { cx: 176, cy: 110 } : {
              cx: [20, 130, 176, 235, 340],
              cy: [y, y, 110, y, y],
              opacity: [0, 1, 1, 0.9, 0],
            }}
            transition={{ duration: 4.8, delay: index * 0.5, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        <motion.circle
          cx="176"
          cy="110"
          r="26"
          fill="url(#flow-core)"
          animate={reduceMotion ? undefined : { r: [21, 29, 21], opacity: [0.55, 0.95, 0.55] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <circle cx="176" cy="110" r="11" fill="#0c1421" stroke="#78ddff" strokeWidth="1.5" />
        <motion.path
          d="M171 110 l4 4 8 -9"
          fill="none"
          stroke="#9eeaff"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.9 }}
        />

        {[28, 52, 76].map((x, index) => (
          <motion.rect
            key={x}
            x={x}
            y={192 - index * 7}
            width="13"
            height={10 + index * 7}
            rx="3"
            fill="#d75caa"
            fillOpacity="0.38"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.25 + index * 0.1 }}
            style={{ transformOrigin: 'bottom' }}
          />
        ))}
        {[272, 296, 320].map((x, index) => (
          <motion.rect
            key={x}
            x={x}
            y={190 - index * 13}
            width="13"
            height={12 + index * 13}
            rx="3"
            fill="#63d8ff"
            fillOpacity="0.7"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 1 + index * 0.12 }}
            style={{ transformOrigin: 'bottom' }}
          />
        ))}
      </svg>
      <div className="pointer-events-none absolute -right-14 -top-14 size-36 rounded-full bg-cyan/10 blur-3xl" />
    </motion.div>
  )
}

const serviceNodes = [
  { x: 100, y: 74, label: 'LEADS' },
  { x: 100, y: 226, label: 'WORKFLOW' },
  { x: 290, y: 42, label: 'APLIKÁCIE' },
  { x: 610, y: 42, label: 'INTEGRÁCIE' },
  { x: 800, y: 74, label: 'DÁTA' },
  { x: 800, y: 226, label: 'REPORTING' },
]

export function ServicesMap() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-90px' }}
      transition={{ duration: 0.8, ease }}
      className="relative mt-14 overflow-hidden rounded-3xl border border-border bg-background/55 px-3 py-6 shadow-[0_0_80px_-45px_var(--cyan)] sm:px-7"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(82,191,255,.1),transparent_48%)]" />
      <svg viewBox="0 0 900 270" className="relative h-auto w-full" role="img" aria-label="Mapa prepojených AI systémov">
        {serviceNodes.map((node, index) => (
          <motion.path
            key={`line-${node.label}`}
            d={`M450 142 C${450 + (node.x - 450) * 0.45} 142, ${450 + (node.x - 450) * 0.6} ${node.y}, ${node.x} ${node.y}`}
            fill="none"
            stroke={index % 2 ? '#d85eb2' : '#65d9ff'}
            strokeOpacity="0.35"
            strokeWidth="1.5"
            strokeDasharray="7 8"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            animate={reduceMotion ? undefined : { strokeDashoffset: [0, -30] }}
            transition={{ pathLength: { duration: 1, delay: index * 0.1 }, strokeDashoffset: { duration: 2.8, repeat: Infinity, ease: 'linear' } }}
          />
        ))}

        <motion.circle
          cx="450"
          cy="142"
          r="56"
          fill="#101528"
          stroke="#65d9ff"
          strokeOpacity="0.5"
          animate={reduceMotion ? undefined : { r: [52, 59, 52], strokeOpacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <circle cx="450" cy="142" r="39" fill="#15172a" stroke="#d85eb2" strokeOpacity="0.55" />
        <text x="450" y="137" textAnchor="middle" fill="#a9edff" fontSize="20" fontWeight="800">AI</text>
        <text x="450" y="159" textAnchor="middle" fill="#91a1b7" fontSize="9" letterSpacing="2">CORE</text>

        {serviceNodes.map((node, index) => (
          <g key={node.label}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="30"
              fill="#101521"
              stroke={index % 2 ? '#d85eb2' : '#65d9ff'}
              strokeOpacity="0.48"
              initial={{ r: 0, opacity: 0 }}
              whileInView={{ r: 30, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.3 + index * 0.1, ease }}
            />
            <text x={node.x} y={node.y + 3} textAnchor="middle" fill="#dceaf4" fontSize="8.5" fontWeight="700" letterSpacing="1">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="relative -mt-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
        Jeden inteligentný ekosystém namiesto izolovaných nástrojov
      </div>
    </motion.div>
  )
}

const coreItems = [
  { icon: Workflow, label: 'Procesy', className: 'left-1/2 top-0 -translate-x-1/2' },
  { icon: Database, label: 'Dáta', className: 'bottom-7 left-2' },
  { icon: Target, label: 'Výsledky', className: 'bottom-7 right-2' },
]

export function DataCore() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease }}
      className="relative mx-auto mt-14 h-[330px] max-w-2xl overflow-hidden rounded-3xl border border-border bg-card/55"
    >
      <div className="absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/15" />
      <motion.div
        className="absolute left-1/2 top-1/2 size-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-fuchsia-400/25"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan/40 bg-background shadow-[0_0_55px_-10px_var(--cyan)]"
        animate={reduceMotion ? undefined : { scale: [0.96, 1.06, 0.96] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="text-center">
          <BrainCircuit className="mx-auto size-8 text-cyan" />
          <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">Prax</span>
        </div>
      </motion.div>

      <svg viewBox="0 0 600 330" className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
        <motion.path d="M300 78 L300 128" stroke="#67dbff" strokeOpacity="0.4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} />
        <motion.path d="M136 258 L246 206" stroke="#d75cac" strokeOpacity="0.4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} />
        <motion.path d="M464 258 L354 206" stroke="#67dbff" strokeOpacity="0.4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} />
      </svg>

      {coreItems.map((item, index) => (
        <motion.div
          key={item.label}
          className={`absolute flex w-32 items-center justify-center gap-2 rounded-xl border border-border bg-background/90 px-3 py-3 text-xs font-bold uppercase tracking-wider text-foreground backdrop-blur ${item.className}`}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          animate={reduceMotion ? undefined : { y: [0, index % 2 ? 5 : -5, 0] }}
          transition={{ opacity: { delay: 0.25 + index * 0.16 }, scale: { delay: 0.25 + index * 0.16 }, y: { duration: 3 + index * 0.4, repeat: Infinity, ease: 'easeInOut' } }}
        >
          <item.icon className="size-4 text-cyan" />
          {item.label}
        </motion.div>
      ))}
    </motion.div>
  )
}

export function SignalField() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className="absolute left-1/2 top-1/2 aspect-square w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/20"
          animate={reduceMotion ? { opacity: 0.15 } : { scale: [0.55, 2.7], opacity: [0, 0.3, 0] }}
          transition={{ duration: 5, delay: index * 1.2, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      {[18, 36, 54, 72, 90].map((left, index) => (
        <motion.span
          key={left}
          className="absolute top-0 h-full w-px origin-bottom bg-gradient-to-b from-transparent via-fuchsia-400/15 to-cyan/30"
          style={{ left: `${left}%`, rotate: `${(left - 54) * -0.34}deg` }}
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: index * 0.1, ease }}
        />
      ))}
      <motion.div
        className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/15 blur-2xl"
        animate={reduceMotion ? undefined : { scale: [0.8, 1.35, 0.8], opacity: [0.3, 0.75, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

export function FaqScanner() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-20 sm:block" aria-hidden="true">
      <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan/25 to-transparent" />
      <motion.div
        className="absolute left-[27px] size-3 rounded-full border border-cyan bg-background shadow-[0_0_18px_var(--cyan)]"
        animate={reduceMotion ? { top: '48%' } : { top: ['8%', '88%', '8%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
