'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Search, PencilRuler, Rocket, TrendingUp } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const steps = [
  { n: '01', name: 'Objavovanie', icon: Search, title: 'Nájdeme proces s najväčším potenciálom', body: 'Najprv pochopíme problém, jeho ekonomický dopad a spôsob, akým dnes váš tím pracuje.', stat: 'Analýza', statLabel: 'problému a cieľa' },
  { n: '02', name: 'Návrh', icon: PencilRuler, title: 'Navrhneme riešenie pre váš reálny workflow', body: 'Ešte pred vývojom si odsúhlasíme fungovanie systému, hranice projektu aj očakávaný výsledok.', stat: 'Jasný plán', statLabel: 'pred prvým kódom' },
  { n: '03', name: 'Vývoj a integrácia', icon: Rocket, title: 'Projekt vyvinieme, otestujeme a prepojíme', body: 'Systém nasadíme do vášho podnikania a spojíme ho s nástrojmi, ktoré už používate.', stat: 'Testovanie', statLabel: 'pred spustením' },
  { n: '04', name: 'Nasadenie', icon: TrendingUp, title: 'Zaškolíme tím a systém doladíme v praxi', body: 'Po spustení sledujeme reálne používanie a riešenie upravíme tam, kde to prinesie najväčší efekt.', stat: 'Podpora', statLabel: 'aj po nasadení' },
]

export function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.72', 'end 0.35'],
  })
  const lineProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })
  const pulseTop = useTransform(lineProgress, [0, 1], ['0%', '100%'])

  return (
    <section ref={sectionRef} id="process" className="relative overflow-hidden bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex justify-center">
          <SectionHeading
            eyebrow="Ako pracujeme"
            title="Od stratégie po"
            highlight="funkčný systém"
            subtitle="Štyri kroky od objavenia po nasadenie."
          />
        </div>

        <div className="pointer-events-none absolute bottom-28 left-1/2 top-[21rem] hidden -translate-x-1/2 lg:block" aria-hidden="true">
          <div className="h-full w-px bg-gradient-to-b from-cyan/10 via-border to-fuchsia-400/10" />
          <motion.div
            className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-cyan via-cyan to-fuchsia-400 shadow-[0_0_16px_var(--cyan)]"
            style={{ scaleY: lineProgress }}
          />
          <motion.div
            className="absolute left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan bg-background shadow-[0_0_24px_var(--cyan)]"
            style={{ top: pulseTop }}
          />
        </div>

        <div className="relative mt-20 flex flex-col gap-16 lg:gap-24">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              {/* Big ghost number + label */}
              <Reveal y={40}>
                <div className="relative flex flex-col justify-center">
                  <span className="pointer-events-none absolute -left-2 -top-8 select-none font-display text-[9rem] font-bold leading-none text-white/[0.04] sm:text-[12rem]">
                    {step.n}
                  </span>
                  <span className="relative text-sm font-semibold tracking-widest text-muted-foreground">
                    {step.n} / 04
                  </span>
                  <span className="relative mt-2 font-display text-6xl font-bold text-cyan sm:text-7xl">
                    {step.n}
                  </span>
                  <span className="relative mt-3 font-display text-3xl font-bold text-foreground">
                    {step.name}
                  </span>
                  <span className="relative mt-4 h-0.5 w-16 bg-cyan" />
                </div>
              </Reveal>

              {/* Glass content card */}
              <Reveal y={40} delay={0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  whileInView={{ boxShadow: '0 0 52px -30px var(--cyan)' }}
                  viewport={{ once: true, margin: '-120px' }}
                  className="relative overflow-hidden rounded-2xl border border-border border-l-2 border-l-cyan bg-card/60 p-8 backdrop-blur-xl"
                >
                  <motion.span
                    className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-brand"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '-120px' }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <span className="grid size-11 place-items-center rounded-lg border border-cyan/25 bg-cyan/10 text-cyan">
                    <step.icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                  <div className="mt-8 flex items-baseline gap-3">
                    <span className="text-gradient font-display text-3xl font-bold">
                      {step.stat}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {step.statLabel}
                    </span>
                  </div>
                </motion.div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
