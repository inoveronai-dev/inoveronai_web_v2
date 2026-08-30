'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Phone, Sparkles } from 'lucide-react'
import { NeuralCosmos } from './neural-cosmos'

const easeOut = [0.22, 1, 0.36, 1] as const

const word = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const contentY = useTransform(scrollYProgress, [0, 0.84, 1], [0, 0, -72])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.86, 0.99], [1, 1, 0.08])
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.09], [1, 0])

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate h-[240svh] bg-background"
    >
      <div className="sticky top-0 h-svh overflow-hidden cosmic-bg">
        <NeuralCosmos progress={scrollYProgress} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,17,.9)_0%,rgba(7,9,17,.5)_46%,rgba(7,9,17,.08)_78%)] max-lg:bg-[linear-gradient(180deg,rgba(7,9,17,.56),rgba(7,9,17,.72))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />

        <motion.div
          className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-5 pb-14 pt-24 sm:px-8 sm:pb-20 sm:pt-28"
          style={{ y: contentY, opacity: contentOpacity }}
        >
        <motion.h1
          className="max-w-5xl font-display text-[clamp(2.25rem,10.5vw,5.9rem)] font-bold uppercase leading-[0.96] tracking-tight text-balance"
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.12 }}
        >
          <motion.span variants={word} className="block text-foreground">
            Automatizujte. Inovujte.
          </motion.span>
          <motion.span variants={word} className="block text-gradient">
            Škáľujte svoj biznis
          </motion.span>
          <motion.span variants={word} className="block text-gradient">
            s AI.
          </motion.span>
        </motion.h1>

        <motion.div
          className="mt-6 inline-flex w-fit items-center gap-3 rounded-2xl border border-cyan/45 bg-card/70 px-5 py-3.5 shadow-[0_0_42px_-14px_var(--cyan)] backdrop-blur-xl sm:mt-7 sm:px-6"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.7, ease: easeOut }}
        >
          <Sparkles className="size-5 shrink-0 text-cyan" />
          <p className="font-display text-sm font-bold uppercase tracking-[0.1em] text-foreground sm:text-base">
            Skúsenosti z <span className="text-gradient text-2xl sm:text-3xl">15+</span> firemných projektov
          </p>
        </motion.div>

        <motion.p
          className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-7 sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: easeOut }}
        >
          Navrhujeme a nasadzujeme automatizácie, AI asistentov a interné nástroje prispôsobené procesom vašej firmy.
        </motion.p>

        <motion.div
          className="mt-7 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7, ease: easeOut }}
        >
          <a
            href="tel:+421918326477"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-7 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-xl shadow-fuchsia-500/25 transition-transform hover:scale-[1.03]"
          >
            <Phone className="size-4" />
            Zavolať na bezplatnú konzultáciu
          </a>
          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan/40 px-7 py-4 text-sm font-semibold text-cyan transition-colors hover:bg-cyan/10"
          >
            Pozrieť naše služby ↓
          </a>
        </motion.div>
        </motion.div>

        <motion.div
          className="absolute inset-x-0 bottom-7 flex flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan/75"
          style={{ opacity: scrollHintOpacity }}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          Prebuďte sieť
          <ChevronDown className="size-5" />
        </motion.div>
      </div>
    </section>
  )
}
